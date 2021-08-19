import { CubicBezier } from './cubic-bezier';

export const ExpectedCurveFitResult: ReadonlyArray<CubicBezier> = [
  {
    p0: {
      x: 127,
      y: 152,
    },
    p1: {
      x: 264.752,
      y: 58.261,
    },
    p2: {
      x: 249.197,
      y: 317.985,
    },
    p3: {
      x: 177.083,
      y: 217.083,
    },
  },
  {
    p0: {
      x: 177.083,
      y: 217.083,
    },
    p1: {
      x: 161.115,
      y: 194.74,
    },
    p2: {
      x: 185.11,
      y: 180.015,
    },
    p3: {
      x: 205.938,
      y: 188.938,
    },
  },
  {
    p0: {
      x: 205.938,
      y: 188.938,
    },
    p1: {
      x: 235.782,
      y: 201.723,
    },
    p2: {
      x: 251.807,
      y: 239.502,
    },
    p3: {
      x: 277.054,
      y: 258.054,
    },
  },
  {
    p0: {
      x: 277.054,
      y: 258.054,
    },
    p1: {
      x: 314.238,
      y: 285.377,
    },
    p2: {
      x: 406.84,
      y: 279.919,
    },
    p3: {
      x: 441.635,
      y: 252,
    },
  },
  {
    p0: {
      x: 441.635,
      y: 252,
    },
    p1: {
      x: 462,
      y: 234.857,
    },
    p2: {
      x: 485.145,
      y: 208.545,
    },
    p3: {
      x: 463.484,
      y: 182.484,
    },
  },
  {
    p0: {
      x: 463.484,
      y: 182.484,
    },
    p1: {
      x: 438.334,
      y: 152.224,
    },
    p2: {
      x: 372.164,
      y: 166.874,
    },
    p3: {
      x: 368,
      y: 208.165,
    },
  },
  {
    p0: {
      x: 368,
      y: 208.165,
    },
    p1: {
      x: 360.836,
      y: 279.213,
    },
    p2: {
      x: 472.908,
      y: 328.853,
    },
    p3: {
      x: 339.73,
      y: 401.635,
    },
  },
  {
    p0: {
      x: 339.73,
      y: 401.635,
    },
    p1: {
      x: 260.134,
      y: 445.134,
    },
    p2: {
      x: 103.141,
      y: 340.667,
    },
    p3: {
      x: 148.344,
      y: 295,
    },
  },
  {
    p0: {
      x: 148.344,
      y: 295,
    },
    p1: {
      x: 154.507,
      y: 288.773,
    },
    p2: {
      x: 163.538,
      y: 299.558,
    },
    p3: {
      x: 171.348,
      y: 302.739,
    },
  },
  {
    p0: {
      x: 171.348,
      y: 302.739,
    },
    p1: {
      x: 215.019,
      y: 320.529,
    },
    p2: {
      x: 262.927,
      y: 327.404,
    },
    p3: {
      x: 308,
      y: 319,
    },
  },
].map((data) => CubicBezier.from(data));
