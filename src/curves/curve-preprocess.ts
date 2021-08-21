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
