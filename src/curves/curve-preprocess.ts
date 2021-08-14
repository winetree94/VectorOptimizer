import { Vector } from './vector';

export function linearize(
  src: Vector[],
  md: number,
  keepLast = false,
  all = true
): Vector[] {
  const dist: Vector[] = [];

  if (src == null) {
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
