import { approximate } from './math';
import { Vector } from './vector';

describe('Vector', () => {
  it('distance', () => {
    const a = new Vector(343.445, 234.2342);
    const b = new Vector(251.236, 896.3652);
    const distance = a.distance(b);
    const answer = 668.5207;
    expect(approximate(distance)).toBe(approximate(answer));
  });

  it('distanceSquared', () => {
    const a = new Vector(343.445, 234.2342);
    const b = new Vector(251.236, 896.3652);
    const distanceSquared = a.distanceSquared(b);
    const answer = 446919.938;
    expect(approximate(distanceSquared)).toBe(approximate(answer));
  });

  it('dot', () => {
    const a = new Vector(343.445, 234.2342);
    const b = new Vector(251.236, 896.3652);
    const distanceSquared = a.dot(b);
    const answer = 296245.125;
    expect(approximate(distanceSquared)).toBe(approximate(answer));
  });

  it('length', () => {
    const a = new Vector(343.445, 234.2342);
    const b = new Vector(251.236, 896.3652);
    const lengthA = a.length();
    const lengthB = b.length();
    const answerA = 415.716431;
    const answerB = 930.908142;
    expect(approximate(lengthA)).toBe(approximate(answerA));
    expect(approximate(lengthB)).toBe(approximate(answerB));
  });

  it('lengthSquared', () => {
    const a = new Vector(343.445, 234.2342);
    const b = new Vector(251.236, 896.3652);
    const lengthSquaredA = a.lengthSquared();
    const lengthSquaredB = b.lengthSquared();
    const answerA = 172820.141;
    const answerB = 866590;
    expect(approximate(lengthSquaredA)).toBe(approximate(answerA));
    expect(approximate(lengthSquaredB)).toBe(approximate(answerB));
  });

  it('lerp', () => {
    const a = new Vector(343.445, 234.2342);
    const b = new Vector(251.236, 896.3652);
    const lerpA = a.lerp(b, 3.123);
    const lerpB = b.lerp(a, 1.34);
    const answerA = {
      x: 55.47626,
      y: 2302.069,
    };
    const answerB = {
      x: 374.7961,
      y: 9.109619,
    };
    expect(approximate(lerpA.x)).toBe(approximate(answerA.x));
    expect(approximate(lerpA.y)).toBe(approximate(answerA.y));
    expect(approximate(lerpB.x)).toBe(approximate(answerB.x));
    expect(approximate(lerpB.y)).toBe(approximate(answerB.y));
  });

  it('normalize', () => {
    const a = new Vector(343.445, 234.2342);
    const b = new Vector(251.236, 896.3652);
    const normalizeA = a.normalize();
    const normalizeB = b.normalize();
    const answerA = {
      x: 0.8261521,
      y: 0.5634471,
    };
    const answerB = {
      x: 0.2698827,
      y: 0.9628932,
    };
    expect(approximate(normalizeA.x, 100)).toBe(approximate(answerA.x, 100));
    expect(approximate(normalizeA.y, 100)).toBe(approximate(answerA.y, 100));
    expect(approximate(normalizeB.x, 100)).toBe(approximate(answerB.x, 100));
    expect(approximate(normalizeB.y, 100)).toBe(approximate(answerB.y, 100));
  });
});
