import { Vector } from './vector';

/**
 * Creates a list of equally spaced points that lie on the path described by straight line segments between
 * adjacent points in the source list.
 *
 * @param src - Source list of points.
 * @param md - Distance between points on the new path.
 * @param keepLast - Always keep last points, default is false.
 * @param all - defualt is true.
 * @returns List of equally-spaced points on the path.
 */
export function linearize(
  src: Vector[],
  md: number,
  keepLast: boolean = false,
  all: boolean = true
): Vector[] {
  const dist: Vector[] = [];
  if (src === null) {
    throw new Error('src');
  }
  if (md <= Number.EPSILON) {
    throw new Error(`md ${md}' is be less than epislon ${Number.EPSILON}`);
  }

  if (src.length > 0) {
    let pp = src[0];
    dist.push(pp);
    let cd = 0;
    for (let ip = 1; ip < src.length; ip++) {
      const p0 = src[ip - 1];
      const p1 = src[ip];
      const td = p0.distance(p1);
      if (cd + td > md) {
        const pd = md - cd;
        dist.push(p0.lerp(p1, pd / td));
        let rd = td - pd;
        while (rd > md) {
          rd -= md;
          if (all) {
            const np = p0.lerp(p1, (td - rd) / td);
            if (!np.equalsOrClose(pp)) {
              dist.push(np);
              pp = np;
            }
          }
        }
        cd = rd;
      } else {
        cd += td;
      }
    }
    const lp = src[src.length - 1];
    if (keepLast || !pp.equalsOrClose(lp)) {
      dist.push(lp);
    }
  }
  return dist;
}

/**
 * Removes any repeated points (that is, one point extremely close to the previous one). The same point can
 * appear multiple times just not right after one another. This does not modify the input list. If no repeats
 * were found, it returns the input list; otherwise it creates a new list with the repeats removed.
 *
 * @param pts - Initial list of points
 * @returns Either pts (if no duplicates were found), or a new list containing pts with duplicates removed.
 */
export function RemoveDuplicates(pts: Vector[]): Vector[] {
  if (pts.length < 2) {
    return pts;
  }

  // Common case -- no duplicates, so just return the source list
  let prev: Vector = pts[0];
  const len: number = pts.length;
  let nDup: number = 0;
  for (let i = 1; i < len; i++) {
    const cur: Vector = pts[i];
    if (prev.equalsOrClose(cur)) nDup++;
    else prev = cur;
  }

  if (nDup == 0) {
    return pts;
  } else {
    // Create a copy without them
    const dst: Vector[] = [];
    prev = pts[0];
    dst.push(prev);
    for (let i = 1; i < len; i++) {
      const cur: Vector = pts[i];
      if (!prev.equalsOrClose(cur)) {
        dst.push(cur);
        prev = cur;
      }
    }
    return dst;
  }
}

/// <summary>
/// "Reduces" a set of line segments by removing points that are too far away. Does not modify the input list; returns
/// a new list with the points removed.
/// The image says it better than I could ever describe: http://upload.wikimedia.org/wikipedia/commons/3/30/Douglas-Peucker_animated.gif
/// The wiki article: http://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
/// Based on:  http://www.codeproject.com/Articles/18936/A-Csharp-Implementation-of-Douglas-Peucker-Line-Ap
/// </summary>
/// <param name="pts">Points to reduce</param>
/// <param name="error">Maximum distance of a point to a line. Low values (~2-4) work well for mouse/touchscreen data.</param>
/// <returns>A new list containing only the points needed to approximate the curve.</returns>
// public static List<VECTOR> RdpReduce(List<VECTOR> pts, FLOAT error)
// {
//     if(pts == null) throw new ArgumentNullException("pts");
//     pts = RemoveDuplicates(pts);
//     if(pts.Count < 3)
//         return new List<VECTOR>(pts);
//     List<int> keepIndex = new List<int>(Math.Max(pts.Count / 2, 16));
//     keepIndex.Add(0);
//     keepIndex.Add(pts.Count - 1);
//     RdpRecursive(pts, error, 0, pts.Count - 1, keepIndex);
//     keepIndex.Sort();
//     List<VECTOR> res = new List<VECTOR>(keepIndex.Count);
//     // ReSharper disable once LoopCanBeConvertedToQuery
//     foreach(int idx in keepIndex)
//         res.Add(pts[idx]);
//     return res;
// }

export function RdpReduce(pts: Vector[], error: number): Vector[] {
  // if(pts == null)  {
  //   throw new Error("pts");
  // }
  // pts = RemoveDuplicates(pts);
  // if(pts.length < 3) {
  //   return [...pts];
  // }
  // const keepIndex: number[] = [];
  // keepIndex.push(0);
  // keepIndex.push(pts.length - 1);
  // RdpRecursive(pts, error, 0, pts.Count - 1, keepIndex);
  // keepIndex.Sort();
  // List<VECTOR> res = new List<VECTOR>(keepIndex.Count);
  // // ReSharper disable once LoopCanBeConvertedToQuery
  // foreach(int idx in keepIndex)
  //     res.Add(pts[idx]);
  // return res;
  return [];
}

/// <summary>
/// Finds the shortest distance between a point and a line. See: http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
/// </summary>
/// <param name="a">First point of the line.</param>
/// <param name="b">Last point of the line.</param>
/// <param name="abDist">Distance between a and b (length of the line).</param>
/// <param name="aCrossB">"a.X*b.Y - b.X*a.Y" This would be the Z-component of (⟪a.X, a.Y, 0⟫ ⨯ ⟪b.X, b.Y, 0⟫) in 3-space.</param>
/// <param name="p">The point to test.</param>
/// <returns>The perpendicular distance to the line.</returns>
export function PerpendicularDistance(
  a: Vector,
  b: Vector,
  abDist: number,
  aCrossB: number,
  p: Vector
): number {
  // a profile with the test data showed that originally this was eating up ~44% of the runtime. So, this went through
  // several iterations of optimization and staring at the disassembly. I tried different methods of using cross
  // products, doing the computation with larger vector types, etc... this is the best I could do in ~45 minutes
  // running on 3 hours of sleep, which is all scalar math, but RyuJIT puts it into XMM registers and does
  // ADDSS/SUBSS/MULSS/DIVSS because that's what it likes to do whenever it sees a vector in a function.
  const area = Math.abs(
    aCrossB + b.x * p.y + p.x * a.y - p.x * b.y - a.x * p.y
  );
  const height = area / abDist;
  return height;
}
