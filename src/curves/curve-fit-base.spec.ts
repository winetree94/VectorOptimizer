import { CubicBezier } from './cubic-bezier';
import { CurveFit } from './curve-fit';
import { ExpectedLinearizedSample } from './curve-preprocess.sample';
import { Vector } from './vector';

const approximate = (a: number) => Math.floor(a * 10) / 10;

describe('CurveFitBase', () => {
  const linearized = ExpectedLinearizedSample.map((point) =>
    Vector.from(point)
  );
  let curveFit: CurveFit;
  let result: CubicBezier[];

  beforeEach(() => {
  });
  
  it('sdf', () => {
    curveFit = CurveFit.GetInstance();
    result = CurveFit.Fit(linearized, 8);
  });
});
