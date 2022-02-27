import { Vector } from './vector';

// Copyright (c) 2015 burningmime
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//    claim that you wrote the original software. If you use this software
//    in a product, an acknowledgement in the product documentation would be
//    appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//    misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

export function linearize(
  src: Vector[],
  minDistance: number,
  alwaysKeepLastVertex: boolean = false,
  alwaysLinearizeAllVertexes: boolean = true
): Vector[] {
  const dist: Vector[] = [];
  if (src === null) {
    throw new Error('Source vector array is null');
  }
  if (minDistance <= Number.EPSILON) {
    throw new Error(
      `md ${minDistance}' is be less than epsilon ${Number.EPSILON}`
    );
  }

  if (src.length > 0) {
    let pp = src[0];
    dist.push(pp);
    let cd = 0;
    for (let ip = 1; ip < src.length; ip++) {
      const p0 = src[ip - 1];
      const p1 = src[ip];
      const td = p0.distance(p1);
      if (cd + td > minDistance) {
        const pd = minDistance - cd;
        dist.push(p0.lerp(p1, pd / td));
        let rd = td - pd;
        while (rd > minDistance) {
          rd -= minDistance;
          if (alwaysLinearizeAllVertexes) {
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
    if (alwaysKeepLastVertex || !pp.equalsOrClose(lp)) {
      dist.push(lp);
    }
  }
  return dist;
}

export function removeDuplicates(pts: Vector[]): Vector[] {
  if (pts.length < 2) {
    return pts;
  }

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
export function rdpReduce(pts: Vector[], error: number): Vector[] {
  if (pts == null) throw new Error('pts');
  pts = removeDuplicates(pts);
  if (pts.length < 3) {
    return [...pts];
  }
  const keepIndex = [];
  keepIndex.push(0);
  keepIndex.push(pts.length - 1);
  rdpRecursive(pts, error, 0, pts.length - 1, keepIndex);
  keepIndex.sort();
  const res: Vector[] = [];
  // ReSharper disable once LoopCanBeConvertedToQuery
  keepIndex.forEach((i) => res.push(pts[i]));
  return res;
}

export function rdpRecursive(
  pts: Vector[],
  error: number,
  first: number,
  last: number,
  keepIndex: number[]
): void {
  const nPts = last - first + 1;
  if (nPts < 3) {
    return;
  }

  const a = pts[first];
  const b = pts[last];
  const abDist = a.distance(b);
  const aCrossB = a.x * b.y - b.x * a.y;
  let maxDist = error;
  let split = 0;
  for (let i = first + 1; i < last - 1; i++) {
    const p = pts[i];
    const pDist = perpendicularDistance(a, b, abDist, aCrossB, p);
    if (pDist > maxDist) {
      maxDist = pDist;
      split = i;
    }
  }
  if (split != 0) {
    keepIndex.push(split);
    rdpRecursive(pts, error, first, split, keepIndex);
    rdpRecursive(pts, error, split, last, keepIndex);
  }
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
export function perpendicularDistance(
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
