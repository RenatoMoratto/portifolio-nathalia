/**
 * The physics behind the hero's floating orbs.
 *
 * Kept out of the R3F component so the numbers can be tuned - and tested -
 * without a WebGL context. The component only ever reads `x/y/z/radius/...`
 * off a body and copies them onto a mesh.
 *
 * The one rule that makes the whole thing feel like a single system rather
 * than a pile of effects: *everything is a force*. Idle drift, the cursor,
 * clicks, contacts and the walls all push on the same velocity, so they all
 * inherit the same inertia and the same damping. Nothing here assigns a
 * position directly, with one deliberate exception - `resize`, which has to
 * re-lay-out the field when the viewport changes.
 */

/**
 * Every number worth tuning, in world units and seconds.
 *
 * Two kinds of constant live here and they behave differently on small
 * screens (see `resize`): *lengths and accelerations* are multiplied by the
 * field scale, so the motion covers the same fraction of a phone screen as it
 * does of a desktop one, while *rates* (stiffness, damping, follow speeds) are
 * left alone, which keeps the timing identical everywhere.
 */
export const ORB_PHYSICS = {
  /** Fixed integration step. Decoupled from the display so a 120Hz panel and a
   *  60Hz one simulate exactly the same thing. */
  timeStep: 1 / 120,
  /** Ceiling on catch-up work per frame; the backlog is dropped past this. */
  maxSubSteps: 4,
  /** Longest frame delta the solver will believe. Tab-outs produce huge ones. */
  maxFrameDelta: 1 / 15,

  /** Friction. Velocity retained after one second of coasting is e^-damping. */
  damping: 1.15,
  /** Speed ceiling. Only ever reached by mashing clicks; keeps things sane. */
  maxSpeed: 5,

  /** Spring pulling each orb back to its anchor. Sets both how far the orbs
   *  wander and how they recover from a shove. Critical damping is
   *  2*sqrt(homeStiffness) = 1.02, so `damping` above sits just past it: no
   *  overshoot, no oscillation. */
  homeStiffness: 0.26,

  /** Amplitude of the idle drift force. Against `homeStiffness` this works out
   *  to roughly +-3 units of wander, which is a slow breathing motion rather
   *  than a tour of the viewport. */
  driftAccel: 0.55,
  /** Vertical drift relative to horizontal - the field is wider than it is tall. */
  driftVerticalRatio: 0.5,
  /** Base angular rate of the drift oscillators, radians per second. */
  driftRate: 0.11,
  /** Constant lift, so the orbs settle slightly above their anchors. */
  buoyancy: 0.14,
  /** Slow sway along the camera axis. Nothing interactive lives on this axis. */
  depthRate: 0.13,
  depthAmplitude: 0.7,

  /** Fraction of the field half-extent an orb centre may reach. */
  boundsX: 0.88,
  boundsY: 0.82,
  /** How far in front of that limit the wall starts to push back. */
  wallMargin: 1.2,
  /** Wall spring. Ramped in quadratically over `wallMargin`, so an orb drifting
   *  outwards is turned around rather than bounced. */
  wallStiffness: 3.5,
  /** How far the quadratic ramp keeps steepening past the limit. Without room
   *  to keep stiffening, the wall goes linear at exactly the point it has the
   *  most work to do, and a click-launched orb sails through it. */
  wallRampCeiling: 6,
  /** Rate outward motion is bled off near a wall, per second, scaled by the
   *  same ramp. A spring alone loses this argument - a click can out-push any
   *  spring soft enough to feel good - so the wall also takes velocity away,
   *  which nothing can out-push. */
  wallDamping: 14,

  /** Contact distance as a fraction of the summed radii. Below 1 because these
   *  are soft blurred blobs - they are *meant* to overlap a little. */
  contactRatio: 0.72,
  /** Contact spring. */
  contactStiffness: 3.4,
  /** Penetration (as a fraction of contact distance) over which the contact
   *  force eases in. Without it, first touch is a step change and the pair
   *  buzzes. */
  contactSoftness: 0.3,
  /** Absorbs the closing speed of a pair instead of letting them bounce. */
  contactDamping: 1.8,

  /** Wake: how far past contact one orb still tugs on another, as a fraction of
   *  the summed radii. This is what stops the three behaving like three
   *  independent animations - shove one and its neighbours lean after it. */
  wakeRatio: 1.7,
  /** Strength of that tug. Purely dissipative (it only ever pulls relative
   *  velocities together) so it cannot add energy however hard it is driven. */
  wakeDrag: 0.7,

  /** Reach of the cursor's push, plus a share of the orb's own radius so big
   *  orbs feel it from further out. */
  pointerRadius: 4.4,
  pointerRadiusFromSize: 0.6,
  /** Peak repulsion under the cursor. */
  pointerPush: 2.4,
  /** Softens the push direction within this distance of the cursor, so an orb
   *  the cursor passes straight through slides off it instead of snapping to
   *  whichever side the pointer left by. */
  pointerSoftening: 0.6,
  /** How much of the cursor's own velocity the orbs get dragged along with. */
  pointerDrag: 0.5,
  /** Rate the tracked cursor position chases the real one. Smooths the jitter
   *  out of raw pointer events without adding noticeable lag. */
  pointerFollow: 16,
  /** Rate the cursor velocity estimate settles. */
  pointerVelocitySmoothing: 9,
  /** Clamp on the cursor velocity estimate. A flick across the screen, or a
   *  stale canvas rect mid-scroll, must not launch anything. */
  pointerMaxSpeed: 10,
  /** Rate the cursor's influence fades in and out. Nothing switches on hard. */
  pointerFade: 5,
  /** How far outside the canvas (in normalised units) the cursor still counts. */
  pointerBounds: 1.15,

  /** Reach of a click. Wider than the cursor's, so a click is felt by the
   *  neighbours too and travels outward through their contacts. */
  shockRadius: 7,
  /** Peak acceleration at the centre of a click. */
  shockAccel: 24,
  /** How long a click pushes for. Short: it is an impulse, not a wind. */
  shockDuration: 0.22,
  /** As `pointerSoftening`. Tighter, because a click landing on an orb should
   *  shove it, and only a shot through its dead centre has nowhere to push. */
  shockSoftening: 0.45,
  /** Concurrent clicks. Past this the oldest is recycled. */
  maxShocks: 4,
  /** Overlapping clicks share a budget: each is scaled by `count ** -shockShare`.
   *  At 0 they stack and a mashed button launches the orbs; at 1 the fourth
   *  click of a burst is a quarter as loud as the first, which feels dead.
   *  Halfway, a burst is about twice one click however fast it is driven. */
  shockShare: 0.5,

  /** Squash. A click compresses the orbs slightly before they spring back. */
  pulseGain: 0.3,
  pulseStiffness: 60,
  pulseDamping: 9,
  maxPulseVelocity: 0.6,

  /** Idle rotation, radians per second, plus a term that lets a shoved orb roll. */
  spinBase: 0.05,
  spinFromVelocity: 0.05,
};

/** Shorthand for the maths below. */
const P = ORB_PHYSICS;

/**
 * Half-extent a field is tuned for - roughly the visible half-height of the
 * hero on a desktop. Everything scales off the ratio to this.
 */
const REFERENCE_EXTENT = 4.2;

export interface OrbSpec {
  /** Radius in world units. */
  scale: number;
  /** Radius on narrow viewports. */
  mobileScale: number;
  /** Anchor the orb rests at, as a fraction of the field's half-extent. */
  home: readonly [x: number, y: number];
  /** Plane the orb sways around, on the camera axis. */
  depth: number;
  /** Multiplier on this orb's drift rate, so the three never move in step. */
  driftRate: number;
  /** Phase offset, same reason. */
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
  /** Fractional scale offset: negative is squashed. */
  pulse: number;
  pulseVelocity: number;
  spin: number;
  /** Force accumulators, reset at the top of every step. @internal */
  ax: number;
  ay: number;
}

interface Shock {
  x: number;
  y: number;
  age: number;
}

/** Cubic smoothstep of an input that is normalised but not yet clamped. */
function smoothstep(t: number): number {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return c * c * (3 - 2 * c);
}

/**
 * Radial falloff shared by the cursor and by clicks.
 *
 * 1 at the centre, 0 at `radius`, and - the part that matters - a *zero slope*
 * at both ends. An orb drifting across the edge of the interaction radius
 * feels the force ease in from nothing instead of switching on, and one sitting
 * under the cursor feels no singularity.
 */
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
  /** Ratio of this field to `REFERENCE_EXTENT`; scales lengths and forces. */
  private scale = 1;
  private laidOut = false;

  private time = 0;
  private accumulator = 0;

  /** Smoothed cursor position, in world units. */
  private pointerX = 0;
  private pointerY = 0;
  /** Latest reported cursor position, which the above chases. */
  private targetX = 0;
  private targetY = 0;
  private pointerVX = 0;
  private pointerVY = 0;
  private pointerActive = false;
  private pointerSeen = false;
  /** 0..1 ramp on everything the cursor does. */
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

  /**
   * Re-lays out the field for a new viewport.
   *
   * The first call places the orbs on their anchors. Later ones scale the
   * bodies with the viewport rather than snapping them, so dragging a window
   * edge moves the orbs with it instead of making them swim back into place.
   */
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

      // Mass goes with area, but normalised against the field so the *ratios*
      // between the orbs survive while absolute accelerations do not drift
      // when every radius shrinks on a phone.
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

  /** Reports the cursor, in normalised field coordinates (-1..1 on each axis). */
  setPointer(nx: number, ny: number) {
    this.targetX = nx * this.halfWidth;
    this.targetY = ny * this.halfHeight;

    if (!this.pointerSeen) {
      // First sighting: snap, or the velocity estimator reads the jump from
      // the origin as a flick and throws the orbs across the screen.
      this.pointerX = this.targetX;
      this.pointerY = this.targetY;
      this.pointerSeen = true;
    }

    this.pointerActive =
      Math.abs(nx) <= P.pointerBounds && Math.abs(ny) <= P.pointerBounds;
  }

  /** The cursor left the page, or the touch ended. Its influence fades out. */
  releasePointer() {
    this.pointerActive = false;
  }

  /** Adds a click impulse, in the same normalised coordinates as `setPointer`. */
  impulse(nx: number, ny: number) {
    const x = nx * this.halfWidth;
    const y = ny * this.halfHeight;

    // Prefer a finished slot, then a free one, then the oldest still running:
    // a fixed pool is what bounds the energy a burst of clicks can inject.
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

  /** Advances the simulation by one frame's worth of time. */
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
    // Out of budget: drop the backlog rather than fast-forwarding through it,
    // which would read as a lurch every time the main thread stalls.
    if (steps === P.maxSubSteps) this.accumulator = 0;
  }

  /** Smooths the reported cursor and estimates its velocity. Once per frame. */
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

    // Overlapping clicks divide a shared budget rather than summing. Without
    // it a held-down mouse button is a rocket motor, not a series of taps.
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

  /** Anchor spring, wandering drift and lift: what the orbs do when left alone. */
  private applyDrift(body: OrbBody, scale: number) {
    body.ax += (body.homeX - body.x) * P.homeStiffness;
    body.ay += (body.homeY - body.y) * P.homeStiffness;

    // Two detuned oscillators per axis. Their beat is long enough that the
    // path never reads as a loop, and slow enough (well below the anchor
    // spring's own frequency) that the orbs follow it as a smooth drift
    // instead of being shaken by it.
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

  /**
   * Soft walls.
   *
   * Two halves, because a spring on its own is not enough. The spring ramps in
   * quadratically across `wallMargin` and does the everyday work of turning a
   * drifting orb around gently. The velocity bleed underneath it is what makes
   * the edge hold: click forces are an order of magnitude stronger than any
   * spring that would still feel soft, and they would simply carry an orb
   * through. Taking the outward velocity away instead cannot be out-pushed,
   * and because it is exponential it stays stable at any strength.
   */
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

  /**
   * Cursor proximity: a push away from the pointer plus a share of the
   * pointer's own velocity, both weighted by the same smooth falloff.
   */
  private applyPointer(body: OrbBody, scale: number) {
    const radius = P.pointerRadius * scale + body.radius * P.pointerRadiusFromSize;
    const dx = body.x - this.pointerX;
    const dy = body.y - this.pointerY;
    const distanceSq = dx * dx + dy * dy;

    const weight = falloff(Math.sqrt(distanceSq), radius) * this.influence;
    if (weight <= 0) return;

    // Softened normal: full strength everywhere except the last half-unit
    // around the cursor, where the direction would otherwise flip as it
    // crosses the orb's centre.
    const softening = P.pointerSoftening * scale;
    const soft = Math.sqrt(distanceSq + softening * softening);
    const push = (P.pointerPush * scale * weight * body.invMass) / soft;
    body.ax += dx * push;
    body.ay += dy * push;

    const drag = P.pointerDrag * weight * body.invMass;
    body.ax += this.pointerVX * drag;
    body.ay += this.pointerVY * drag;
  }

  /** Click impulses: a short outward blast that fades in and out. */
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

      // Parabolic envelope: zero at both ends, so the blast arrives and leaves
      // without a discontinuity in acceleration. What is left afterwards is
      // pure momentum, which damping then spends.
      const t = shock.age / P.shockDuration;
      const envelope = 4 * t * (1 - t);

      const soft = Math.sqrt(distanceSq + softening * softening);
      const strength = P.shockAccel * scale * gain * weight * envelope * body.invMass;
      body.ax += (dx / soft) * strength;
      body.ay += (dy / soft) * strength;

      // The same blast compresses the orb a little; the spring in `integrate`
      // rings it back out.
      body.pulseVelocity -= strength * P.pulseGain * h;
    }
  }

  /**
   * Everything one orb does to another: the wake it drags behind it, and the
   * cushion it presses back with once they touch.
   *
   * Both are equal and opposite, so a shove given to one orb travels through
   * the group instead of stopping at whoever the cursor happened to reach.
   */
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
          // Viscous coupling: each orb is pulled towards the other's velocity,
          // weighted by the same smooth falloff the cursor uses. Neighbours
          // lean into a shove and settle together rather than one at a time.
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

        // Easing the spring in over the first slice of the overlap is what
        // makes contact feel cushioned; a bare Hookean step buzzes at grazing
        // contact, where orbs spend most of their time.
        const spring =
          P.contactStiffness *
          penetration *
          smoothstep(penetration / (rest * P.contactSoftness));

        // Only damp closing speed - damping separation would make them sticky.
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
    // Exponential decay, so friction is identical at any step size.
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
