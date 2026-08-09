/** Testable orb simulation independent of WebGL rendering. */

/**
 * Tunable values in world units and seconds. Lengths and accelerations scale
 * with the field; rates do not.
 */
export const ORB_PHYSICS = {
  /** Fixed step keeps motion refresh-rate independent. */
  timeStep: 1 / 120,
  maxSubSteps: 4,
  /** Ignores long gaps such as backgrounded tabs. */
  maxFrameDelta: 1 / 15,

  damping: 1.15,
  maxSpeed: 5,

  /** Slight overdamping prevents anchor oscillation. */
  homeStiffness: 0.26,

  driftAccel: 0.55,
  /** Reduced vertical drift suits the wider field. */
  driftVerticalRatio: 0.5,
  driftRate: 0.11,
  buoyancy: 0.14,
  depthRate: 0.13,
  depthAmplitude: 0.7,

  /** Center bounds as fractions of each half-extent. */
  boundsX: 0.88,
  boundsY: 0.82,
  wallMargin: 1.2,
  wallStiffness: 3.5,
  /** Reinforces soft bounds against click impulses. */
  wallRampCeiling: 6,
  wallDamping: 14,

  /** Allows intentional overlap between blurred orbs. */
  contactRatio: 0.72,
  contactStiffness: 3.4,
  /** Eases in contact force to prevent buzzing at first touch. */
  contactSoftness: 0.3,
  contactDamping: 1.8,

  /** Couples nearby orbs so motion propagates through the group. */
  wakeRatio: 1.7,
  wakeDrag: 0.7,

  pointerRadius: 4.4,
  pointerRadiusFromSize: 0.6,
  pointerPush: 2.4,
  /** Prevents direction flips near an orb's center. */
  pointerSoftening: 0.6,
  /** Carries orbs with pointer motion as well as repelling them. */
  pointerDrag: 0.5,
  /** Filters raw pointer jitter. */
  pointerFollow: 16,
  pointerVelocitySmoothing: 9,
  /** Prevents large pointer jumps from launching orbs. */
  pointerMaxSpeed: 10,
  /** Avoids abrupt pointer activation. */
  pointerFade: 5,
  /** Retains influence slightly beyond the canvas edge. */
  pointerBounds: 1.15,

  /** Lets clicks reach neighboring orbs. */
  shockRadius: 7,
  shockAccel: 24,
  /** Keeps clicks impulse-like rather than continuous. */
  shockDuration: 0.22,
  shockSoftening: 0.45,
  maxShocks: 4,
  /** Shares force across concurrent clicks. */
  shockShare: 0.5,

  /** Click squash and rebound. */
  pulseGain: 0.3,
  pulseStiffness: 60,
  pulseDamping: 9,
  maxPulseVelocity: 0.6,

  spinBase: 0.05,
  spinFromVelocity: 0.05,
};

const P = ORB_PHYSICS;

/** Desktop reference size for viewport scaling. */
const REFERENCE_EXTENT = 4.2;

export interface OrbSpec {
  scale: number;
  mobileScale: number;
  /** Anchor as fractions of the field half-extents. */
  home: readonly [x: number, y: number];
  depth: number;
  driftRate: number;
  phase: number;
}

export interface OrbBody {
  readonly spec: OrbSpec;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  radius: number;
  invMass: number;
  /** Fractional scale offset; negative values squash. */
  pulse: number;
  pulseVelocity: number;
  spin: number;
  ax: number;
  ay: number;
}

interface Shock {
  x: number;
  y: number;
  age: number;
}

function smoothstep(t: number): number {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return c * c * (3 - 2 * c);
}

/** Zero-slope endpoints prevent abrupt force changes. */
function falloff(distance: number, radius: number): number {
  if (distance >= radius) return 0;
  const u = distance / radius;
  const q = 1 - u * u;
  return q * q;
}

export class OrbField {
  readonly bodies: OrbBody[] = [];

  private halfWidth = REFERENCE_EXTENT;
  private halfHeight = REFERENCE_EXTENT;
  private scale = 1;
  private laidOut = false;

  private time = 0;
  private accumulator = 0;

  private pointerX = 0;
  private pointerY = 0;
  private targetX = 0;
  private targetY = 0;
  private pointerVX = 0;
  private pointerVY = 0;
  private pointerActive = false;
  private pointerSeen = false;
  private influence = 0;

  private readonly shocks: Shock[] = [];

  constructor(specs: readonly OrbSpec[]) {
    for (const spec of specs) {
      this.bodies.push({
        spec,
        x: 0,
        y: 0,
        z: spec.depth,
        vx: 0,
        vy: 0,
        homeX: 0,
        homeY: 0,
        radius: spec.scale,
        invMass: 1,
        pulse: 0,
        pulseVelocity: 0,
        spin: spec.phase * 0.1,
        ax: 0,
        ay: 0,
      });
    }
    this.resize(REFERENCE_EXTENT, REFERENCE_EXTENT, false);
  }

  /** Rescales current state instead of snapping bodies to new anchors. */
  resize(halfWidth: number, halfHeight: number, isMobile: boolean) {
    const ratioX = this.laidOut ? halfWidth / this.halfWidth : 1;
    const ratioY = this.laidOut ? halfHeight / this.halfHeight : 1;

    this.halfWidth = halfWidth;
    this.halfHeight = halfHeight;
    this.scale = clamp(Math.min(halfWidth, halfHeight) / REFERENCE_EXTENT, 0.55, 1.15);

    let meanRadius = 0;
    for (const body of this.bodies) {
      body.radius = isMobile ? body.spec.mobileScale : body.spec.scale;
      meanRadius += body.radius;
    }
    meanRadius /= this.bodies.length || 1;

    for (const body of this.bodies) {
      body.homeX = body.spec.home[0] * halfWidth;
      body.homeY = body.spec.home[1] * halfHeight;

      // Preserve mass ratios when mobile radii shrink.
      const mass = (body.radius / meanRadius) ** 2;
      body.invMass = 1 / mass;

      if (!this.laidOut) {
        body.x = body.homeX;
        body.y = body.homeY;
        body.vx = 0;
        body.vy = 0;
      } else {
        body.x *= ratioX;
        body.y *= ratioY;
        body.vx *= ratioX;
        body.vy *= ratioY;
      }
    }

    this.laidOut = true;
  }

  /** Sets the pointer in normalized field coordinates. */
  setPointer(nx: number, ny: number) {
    this.targetX = nx * this.halfWidth;
    this.targetY = ny * this.halfHeight;

    if (!this.pointerSeen) {
      // Avoid interpreting the first position as pointer velocity.
      this.pointerX = this.targetX;
      this.pointerY = this.targetY;
      this.pointerSeen = true;
    }

    this.pointerActive =
      Math.abs(nx) <= P.pointerBounds && Math.abs(ny) <= P.pointerBounds;
  }

  releasePointer() {
    this.pointerActive = false;
  }

  /** Adds a click impulse in normalized field coordinates. */
  impulse(nx: number, ny: number) {
    const x = nx * this.halfWidth;
    const y = ny * this.halfHeight;

    // Recycle shocks to bound concurrent input energy.
    let slot = this.shocks.find((shock) => shock.age >= P.shockDuration);
    if (!slot && this.shocks.length < P.maxShocks) {
      slot = { x, y, age: 0 };
      this.shocks.push(slot);
    }
    slot ??= this.shocks.reduce((oldest, shock) =>
      shock.age > oldest.age ? shock : oldest,
    );

    slot.x = x;
    slot.y = y;
    slot.age = 0;
  }

  /** Advances by a frame delta in seconds. */
  update(delta: number) {
    const dt = Math.min(Math.max(delta, 0), P.maxFrameDelta);
    if (dt <= 0) return;

    this.trackPointer(dt);

    this.accumulator += dt;
    let steps = 0;
    while (this.accumulator >= P.timeStep && steps < P.maxSubSteps) {
      this.step(P.timeStep);
      this.accumulator -= P.timeStep;
      steps += 1;
    }
    // Drop excess backlog to avoid catch-up lurches.
    if (steps === P.maxSubSteps) this.accumulator = 0;
  }

  private trackPointer(dt: number) {
    if (this.pointerSeen) {
      const prevX = this.pointerX;
      const prevY = this.pointerY;

      const follow = 1 - Math.exp(-P.pointerFollow * dt);
      this.pointerX += (this.targetX - this.pointerX) * follow;
      this.pointerY += (this.targetY - this.pointerY) * follow;

      const blend = 1 - Math.exp(-P.pointerVelocitySmoothing * dt);
      this.pointerVX += ((this.pointerX - prevX) / dt - this.pointerVX) * blend;
      this.pointerVY += ((this.pointerY - prevY) / dt - this.pointerVY) * blend;

      const limit = P.pointerMaxSpeed * this.scale;
      const speed = Math.sqrt(this.pointerVX ** 2 + this.pointerVY ** 2);
      if (speed > limit) {
        const k = limit / speed;
        this.pointerVX *= k;
        this.pointerVY *= k;
      }
    }

    const target = this.pointerActive ? 1 : 0;
    this.influence += (target - this.influence) * (1 - Math.exp(-P.pointerFade * dt));
  }

  private step(h: number) {
    this.time += h;

    const bodies = this.bodies;
    const scale = this.scale;
    const pointerLive = this.influence > 0.001;

    let live = 0;
    for (const shock of this.shocks) if (shock.age < P.shockDuration) live += 1;
    const shockGain = live > 0 ? live ** -P.shockShare : 0;

    for (const body of bodies) {
      body.ax = 0;
      body.ay = 0;

      this.applyDrift(body, scale);
      this.applyWalls(body, scale, h);
      if (pointerLive) this.applyPointer(body, scale);
      if (live > 0) this.applyShocks(body, scale, h, shockGain);
    }

    this.applyPairs();
    this.integrate(h, scale);

    for (const shock of this.shocks) {
      if (shock.age < P.shockDuration) shock.age += h;
    }
  }

  private applyDrift(body: OrbBody, scale: number) {
    body.ax += (body.homeX - body.x) * P.homeStiffness;
    body.ay += (body.homeY - body.y) * P.homeStiffness;

    // Detuned frequencies keep the drift from visibly looping.
    const w = this.time * P.driftRate * body.spec.driftRate;
    const p = body.spec.phase;
    const drift = P.driftAccel * scale;

    body.ax += (Math.sin(w + p) + 0.55 * Math.sin(w * 2.31 + p * 1.7)) * drift;
    body.ay +=
      (Math.cos(w * 0.79 + p * 1.3) + 0.55 * Math.cos(w * 1.87 + p * 0.4)) *
      drift *
      P.driftVerticalRatio;
    body.ay += P.buoyancy * scale;
  }

  /** A soft spring turns drift while damping contains stronger impulses. */
  private applyWalls(body: OrbBody, scale: number, h: number) {
    const margin = P.wallMargin * scale;

    const limitX = this.halfWidth * P.boundsX;
    const overX = margin - (limitX - Math.abs(body.x));
    if (overX > 0) {
      const dir = body.x >= 0 ? 1 : -1;
      const ramp = Math.min(overX / margin, P.wallRampCeiling);
      body.ax -= dir * overX * ramp * P.wallStiffness;
      if (body.vx * dir > 0) body.vx *= Math.exp(-P.wallDamping * ramp * h);
    }

    const limitY = this.halfHeight * P.boundsY;
    const overY = margin - (limitY - Math.abs(body.y));
    if (overY > 0) {
      const dir = body.y >= 0 ? 1 : -1;
      const ramp = Math.min(overY / margin, P.wallRampCeiling);
      body.ay -= dir * overY * ramp * P.wallStiffness;
      if (body.vy * dir > 0) body.vy *= Math.exp(-P.wallDamping * ramp * h);
    }
  }

  private applyPointer(body: OrbBody, scale: number) {
    const radius = P.pointerRadius * scale + body.radius * P.pointerRadiusFromSize;
    const dx = body.x - this.pointerX;
    const dy = body.y - this.pointerY;
    const distanceSq = dx * dx + dy * dy;

    const weight = falloff(Math.sqrt(distanceSq), radius) * this.influence;
    if (weight <= 0) return;

    const softening = P.pointerSoftening * scale;
    const soft = Math.sqrt(distanceSq + softening * softening);
    const push = (P.pointerPush * scale * weight * body.invMass) / soft;
    body.ax += dx * push;
    body.ay += dy * push;

    const drag = P.pointerDrag * weight * body.invMass;
    body.ax += this.pointerVX * drag;
    body.ay += this.pointerVY * drag;
  }

  private applyShocks(body: OrbBody, scale: number, h: number, gain: number) {
    const radius = P.shockRadius * scale;
    const softening = P.shockSoftening * scale;

    for (const shock of this.shocks) {
      if (shock.age >= P.shockDuration) continue;

      const dx = body.x - shock.x;
      const dy = body.y - shock.y;
      const distanceSq = dx * dx + dy * dy;
      const weight = falloff(Math.sqrt(distanceSq), radius);
      if (weight <= 0) continue;

      // Zero endpoints avoid abrupt acceleration changes.
      const t = shock.age / P.shockDuration;
      const envelope = 4 * t * (1 - t);

      const soft = Math.sqrt(distanceSq + softening * softening);
      const strength = P.shockAccel * scale * gain * weight * envelope * body.invMass;
      body.ax += (dx / soft) * strength;
      body.ay += (dy / soft) * strength;

      body.pulseVelocity -= strength * P.pulseGain * h;
    }
  }

  /** Equal-and-opposite wake and contact forces transfer motion between orbs. */
  private applyPairs() {
    const bodies = this.bodies;

    for (let i = 0; i < bodies.length; i += 1) {
      const a = bodies[i];
      for (let j = i + 1; j < bodies.length; j += 1) {
        const b = bodies[j];

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distanceSq = dx * dx + dy * dy;
        const summed = a.radius + b.radius;

        const wake = summed * P.wakeRatio;
        if (distanceSq < wake * wake) {
          const weight = falloff(Math.sqrt(distanceSq), wake) * P.wakeDrag;
          const dvx = b.vx - a.vx;
          const dvy = b.vy - a.vy;
          a.ax += dvx * weight * a.invMass;
          a.ay += dvy * weight * a.invMass;
          b.ax -= dvx * weight * b.invMass;
          b.ay -= dvy * weight * b.invMass;
        }

        const rest = summed * P.contactRatio;
        if (distanceSq >= rest * rest) continue;

        const distance = Math.sqrt(distanceSq);
        if (distance < 1e-4) continue;

        const nx = dx / distance;
        const ny = dy / distance;
        const penetration = rest - distance;

        const spring =
          P.contactStiffness *
          penetration *
          smoothstep(penetration / (rest * P.contactSoftness));

        // Dampen only closing motion to avoid stickiness.
        const closing = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        const total = spring + (closing < 0 ? -closing * P.contactDamping : 0);

        a.ax -= nx * total * a.invMass;
        a.ay -= ny * total * a.invMass;
        b.ax += nx * total * b.invMass;
        b.ay += ny * total * b.invMass;
      }
    }
  }

  private integrate(h: number, scale: number) {
    // Exponential decay keeps damping step-size independent.
    const decay = Math.exp(-P.damping * h);
    const maxSpeed = P.maxSpeed * scale;
    const maxSpeedSq = maxSpeed * maxSpeed;

    for (const body of this.bodies) {
      body.vx = (body.vx + body.ax * h) * decay;
      body.vy = (body.vy + body.ay * h) * decay;

      const speedSq = body.vx * body.vx + body.vy * body.vy;
      if (speedSq > maxSpeedSq) {
        const k = maxSpeed / Math.sqrt(speedSq);
        body.vx *= k;
        body.vy *= k;
      }

      body.x += body.vx * h;
      body.y += body.vy * h;
      body.z =
        body.spec.depth +
        Math.sin(this.time * P.depthRate + body.spec.phase) * P.depthAmplitude;

      body.pulseVelocity = clamp(
        body.pulseVelocity +
          (-body.pulse * P.pulseStiffness - body.pulseVelocity * P.pulseDamping) * h,
        -P.maxPulseVelocity,
        P.maxPulseVelocity,
      );
      body.pulse += body.pulseVelocity * h;

      body.spin += (P.spinBase + body.vx * P.spinFromVelocity) * h;
    }
  }
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}
