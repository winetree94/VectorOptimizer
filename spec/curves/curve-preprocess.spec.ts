import { linearize } from '../../src/curves/curve-preprocess';
import {
  ExpectedLinearizedSample,
  SampleVertexes,
} from './curve-preprocess.sample';
import { approximate } from '../../src/curves/math';
import { Vector } from '../../src/curves/vector';

describe('Preprocessing', () => {
  it('linearize', () => {
    const vectors = SampleVertexes.map((point) => Vector.from(point));
    const linearizedVectors = linearize(vectors, 8, false, true);

    expect(linearizedVectors.length).toBe(ExpectedLinearizedSample.length);

    linearizedVectors.forEach((linearizedVector, index) => {
      expect(approximate(linearizedVector.x)).toBe(
        approximate(ExpectedLinearizedSample[index].x)
      );
      expect(approximate(linearizedVector.y)).toBe(
        approximate(ExpectedLinearizedSample[index].y)
      );
    });
  });
});
