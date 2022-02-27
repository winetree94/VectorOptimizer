export function approximate(v: number, precision = 10): number {
  return Math.floor(v * precision) / precision;
}
