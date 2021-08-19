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
export function removeDuplicates(pts: Vector[]): Vector[] {
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
