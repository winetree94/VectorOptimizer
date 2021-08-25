import { CubicBezier } from '../../src/curves/cubic-bezier';
import { approximate } from '../../src/curves/math';
import { Vector } from '../../src/curves/vector';

describe('CubicBezier', () => {
  it('Sample', () => {
    const cubicBezier = new CubicBezier(
      new Vector(127, 152),
      new Vector(542.5641, 95.86368),
      new Vector(232.3383, 319.945),
      new Vector(308, 319)
    );

    const sample = cubicBezier.sample(0.009903266);
    const answer = { x: 139.1339, y: 150.4142 };

    expect(approximate(sample.x)).toBe(approximate(answer.x));
    expect(approximate(sample.y)).toBe(approximate(answer.y));
  });
});
