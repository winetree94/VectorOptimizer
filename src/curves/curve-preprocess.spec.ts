import { linearize } from './curve-preprocess';
import {
  ExpectedLinearizedSample,
  SampleVertexes,
} from './curve-preprocess.sample';
import { Vector } from './vector';

const approximate = (a: number) => Math.floor(a * 10) / 10;

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
