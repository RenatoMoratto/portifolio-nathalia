import { describe, expect, it } from 'vitest';
import { ORB_PHYSICS, OrbField, type OrbSpec } from './orbPhysics';

/**
 * The orbs are a decoration nobody would file a bug against - they would just
 * look wrong. So what is pinned here is not the choreography (which is meant to
 * be tuned) but the properties that make the tuning safe: the simulation stays
 * finite, stays inside the viewport, settles when left alone, reacts the way
 * the geometry says it should, and cannot be driven unstable by input.
 */

const SPECS: readonly OrbSpec[] = [
  {
    scale: 2.5,
    mobileScale: 1.5,
    home: [0.42, 0.3],
    depth: -1,
    driftRate: 1,
    phase: 12.7,
  },
  {
    scale: 2.0,
    mobileScale: 1.2,
    home: [-0.42, -0.26],
    depth: -2,
    driftRate: 1.27,
    phase: 58.3,
  },
  {
    scale: 1.8,
    mobileScale: 1.0,
    home: [0, -0.06],
    depth: -3,
    driftRate: 0.83,
    phase: 91.1,
  },
];

/** A 16:9 desktop hero, measured at the orbs' plane. */
const HALF_W = 7.36;
const HALF_H = 4.14;
const FRAME = 1 / 60;

function makeField(halfWidth = HALF_W, halfHeight = HALF_H, mobile = false) {
  const field = new OrbField(SPECS);
  field.resize(halfWidth, halfHeight, mobile);
  return field;
}

function run(field: OrbField, seconds: number, onFrame?: (time: number) => void) {
  const frames = Math.round(seconds / FRAME);
  for (let i = 0; i < frames; i += 1) {
    onFrame?.(i * FRAME);
    field.update(FRAME);
  }
}

const speedOf = (body: { vx: number; vy: number }) => Math.hypot(body.vx, body.vy);
const peakSpeed = (field: OrbField) => Math.max(...field.bodies.map(speedOf));

describe('OrbField', () => {
  it('places the orbs on their anchors and scales them for the viewport', () => {
    const field = makeField();

    expect(field.bodies).toHaveLength(3);
    expect(field.bodies[0].x).toBeCloseTo(0.42 * HALF_W);
    expect(field.bodies[0].y).toBeCloseTo(0.3 * HALF_H);
    expect(field.bodies[0].radius).toBe(2.5);
    expect(makeField(2.02, HALF_H, true).bodies[0].radius).toBe(1.5);
  });

  it('starts clear of contact, so the field can actually come to rest', () => {
    // Anchors that overlap would leave the contact springs fighting the anchor
    // springs forever, and the orbs would never stop moving.
    const { bodies } = makeField();

    for (let i = 0; i < bodies.length; i += 1) {
      for (let j = i + 1; j < bodies.length; j += 1) {
        const a = bodies[i];
        const b = bodies[j];
        const rest = (a.radius + b.radius) * ORB_PHYSICS.contactRatio;
        expect(Math.hypot(b.x - a.x, b.y - a.y)).toBeGreaterThan(rest);
      }
    }
  });

  it('drifts gently and stays inside the viewport for ten minutes', () => {
    const field = makeField();
    let fastest = 0;

    run(field, 600, () => {
      fastest = Math.max(fastest, peakSpeed(field));
      for (const body of field.bodies) {
        expect(Number.isFinite(body.x)).toBe(true);
        expect(Math.abs(body.x)).toBeLessThan(HALF_W);
        expect(Math.abs(body.y)).toBeLessThan(HALF_H);
      }
    });

    // Idle motion is a slow breath, not a tour of the hero.
    expect(fastest).toBeLessThan(1);
  });

  it('simulates the same motion at 60Hz and at 144Hz', () => {
    const slow = makeField();
    const fast = makeField();

    for (let i = 0; i < 60 * 30; i += 1) slow.update(1 / 60);
    for (let i = 0; i < 144 * 30; i += 1) fast.update(1 / 144);

    for (let i = 0; i < slow.bodies.length; i += 1) {
      expect(fast.bodies[i].x).toBeCloseTo(slow.bodies[i].x, 1);
      expect(fast.bodies[i].y).toBeCloseTo(slow.bodies[i].y, 1);
    }
  });

  it('survives the frame deltas a backgrounded tab produces', () => {
    const field = makeField();

    field.update(0);
    field.update(-1);
    field.update(30);
    field.update(Number.NaN);

    for (const body of field.bodies) {
      expect(Number.isFinite(body.x)).toBe(true);
      expect(Number.isFinite(body.vx)).toBe(true);
    }
    expect(peakSpeed(field)).toBeLessThan(ORB_PHYSICS.maxSpeed);
  });

  it('does not lurch when it first sees the cursor', () => {
    const field = makeField();
    run(field, 5);
    const before = peakSpeed(field);

    // A first sighting in the far corner is a jump from nowhere, not a flick.
    field.setPointer(0.95, 0.95);
    run(field, 0.1);

    expect(peakSpeed(field)).toBeLessThan(before + 0.2);
  });

  it('eases the cursor force in rather than switching it on at a threshold', () => {
    const field = makeField();
    run(field, 5);

    const body = field.bodies[0];
    const reach =
      ORB_PHYSICS.pointerRadius + body.radius * ORB_PHYSICS.pointerRadiusFromSize;
    let biggestJump = 0;

    // Walk the cursor in from well outside the interaction radius to the orb.
    run(field, 3, (time) => {
      const distance = reach * 1.5 * (1 - time / 3);
      field.setPointer((body.x + distance) / HALF_W, body.y / HALF_H);
      const before = speedOf(body);
      field.update(0);
      biggestJump = Math.max(biggestJump, Math.abs(speedOf(body) - before));
    });

    // No frame may change an orb's speed by more than a whisker: crossing the
    // edge of the radius has to be indistinguishable from any other frame.
    expect(biggestJump).toBeLessThan(0.05);
  });

  it('pushes an orb away from a cursor parked on it, then lets it drift back', () => {
    const field = makeField();
    run(field, 5);

    // The smallest orb: the heaviest one is sluggish by design, and if it
    // happens to be near an edge it has nowhere to flee to.
    const body = field.bodies[2];
    const from = { x: body.x, y: body.y };
    const at = { x: body.x / HALF_W, y: body.y / HALF_H };
    run(field, 3, () => field.setPointer(at.x, at.y));

    const fled = Math.hypot(body.x - from.x, body.y - from.y);
    expect(fled).toBeGreaterThan(0.5);

    field.releasePointer();
    run(field, 8);
    expect(peakSpeed(field)).toBeLessThan(1);
  });

  it('drags orbs along with a fast cursor, not just away from it', () => {
    const field = makeField();
    run(field, 5);

    const body = field.bodies[2];
    const startX = body.x;
    // Sweep left to right straight through the middle orb.
    run(field, 1, (time) => field.setPointer(-1 + time * 2, body.y / HALF_H));

    expect(body.x).toBeGreaterThan(startX);
    expect(body.vx).toBeGreaterThan(0);
  });

  it('pushes orbs outward from a click, hardest on the closest', () => {
    const field = makeField();
    run(field, 5);

    const before = field.bodies.map((body) => Math.hypot(body.x, body.y));
    field.impulse(0, 0);
    run(field, 0.3);

    const after = field.bodies.map((body) => Math.hypot(body.x, body.y));
    for (let i = 0; i < after.length; i += 1) expect(after[i]).toBeGreaterThan(before[i]);

    // The click was at the origin, so the nearest orb must have moved furthest.
    const nearest = before.indexOf(Math.min(...before));
    const moved = after.map((distance, i) => distance - before[i]);
    expect(moved[nearest]).toBe(Math.max(...moved));
  });

  it('keeps a click going on momentum and spends it through damping', () => {
    const field = makeField();
    run(field, 5);

    field.impulse(0, 0);
    run(field, ORB_PHYSICS.shockDuration);
    const launched = peakSpeed(field);
    expect(launched).toBeGreaterThan(1);

    // The blast is over by now: whatever happens next is inherited momentum.
    const travelled = field.bodies.map((body) => ({ x: body.x, y: body.y }));
    run(field, 0.3);
    const coasted = field.bodies.some(
      (body, i) => Math.hypot(body.x - travelled[i].x, body.y - travelled[i].y) > 0.1,
    );
    expect(coasted).toBe(true);

    run(field, 6);
    expect(peakSpeed(field)).toBeLessThan(1);
  });

  it('stays stable under a mashed mouse button', () => {
    const field = makeField();
    run(field, 5);

    run(field, 5, (time) => {
      if (Math.round(time / FRAME) % 4 === 0) {
        field.impulse(Math.sin(time * 9) * 0.6, Math.cos(time * 7) * 0.6);
      }
      expect(peakSpeed(field)).toBeLessThanOrEqual(ORB_PHYSICS.maxSpeed);
      for (const body of field.bodies) {
        expect(Math.abs(body.x)).toBeLessThan(HALF_W);
        expect(Math.abs(body.y)).toBeLessThan(HALF_H);
      }
    });

    // And recovers on its own.
    run(field, 10);
    expect(peakSpeed(field)).toBeLessThan(1);
  });

  it('lets a click reach an orb it did not land on', () => {
    const field = makeField();
    run(field, 5);

    // Furthest orb from the origin: too far to be shoved much directly, so what
    // moves it is the wake of its neighbours.
    const distances = field.bodies.map((body) => Math.hypot(body.x, body.y));
    const furthest = field.bodies[distances.indexOf(Math.max(...distances))];
    const from = { x: furthest.x, y: furthest.y };

    field.impulse(0, 0);
    run(field, 0.6);

    expect(Math.hypot(furthest.x - from.x, furthest.y - from.y)).toBeGreaterThan(0.05);
  });

  it('cushions overlap instead of letting orbs pass through each other', () => {
    const field = makeField();
    const [a, b] = field.bodies;

    // Fire them at each other and watch the contact take the closing speed out.
    a.x = -1.5;
    a.y = 0;
    a.vx = 4;
    b.x = 1.5;
    b.y = 0;
    b.vx = -4;

    let deepest = 0;
    run(field, 4, () => {
      const rest = (a.radius + b.radius) * ORB_PHYSICS.contactRatio;
      deepest = Math.max(deepest, 1 - Math.hypot(b.x - a.x, b.y - a.y) / rest);
    });

    // They squeeze, but neither swaps sides.
    expect(deepest).toBeLessThan(0.75);
    expect(b.x).toBeGreaterThan(a.x);
  });

  it('carries the orbs with the viewport on a resize', () => {
    const field = makeField();
    run(field, 10);
    const before = field.bodies.map((body) => ({ x: body.x, y: body.y }));

    field.resize(HALF_W / 2, HALF_H, false);

    field.bodies.forEach((body, i) => {
      expect(body.x).toBeCloseTo(before[i].x / 2);
      expect(body.y).toBeCloseTo(before[i].y);
    });
  });
});
