import { linearize } from './curve-preprocess';
import {
  ExpectedLinearizedSample,
  SampleVertexes,
} from './curve-preprocess.sample';
import { approximate } from './math';
import { Vector } from './vector';

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
