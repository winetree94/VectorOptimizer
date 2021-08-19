import { CurveFit } from './curve-fit';
import { ExpectedLinearizedSample } from './curve-preprocess.sample';
import { Vector } from './vector';

const approximate = (a: number) => Math.floor(a * 10) / 10;

describe('CurveFitBase', () => {
  it('CurveFit.InitializeArcLength', () => {
    const linearized = ExpectedLinearizedSample.map((point) =>
      Vector.from(point)
    );
    const curveFit = CurveFit.GetInstance();
    curveFit._pts = linearized;
    curveFit.initializeArcLengths();

    const expected = [
      0, 6.97334051, 13.562501, 20.429615, 27.8845119, 35.5359268, 43.3639946,
      51.3639946, 59.3032227, 67.1615, 74.89529, 82.75928, 90.4504242, 98.19717,
      105.967682, 113.765083, 121.670692, 129.577774, 137.380524, 144.9937,
      152.617828, 160.617828, 168.617828, 176.0101, 182.983444, 189.894333,
      196.9654, 204.6168, 212.0402, 219.431274, 226.86377, 234.411667,
      240.985352, 247.856537, 255.306824, 263.306824, 270.514984, 277.373383,
      285.0248, 293.0248, 300.4785, 307.4518, 315.191284, 323.166, 330.903778,
      338.629059, 346.399536, 354.399536, 361.991882, 369.584259, 377.32373,
      384.796539, 392.467438, 399.881653, 407.371033, 414.936, 422.338,
      430.127045, 437.9551, 445.783, 453.717651, 461.717651, 469.717651,
      477.717651, 485.717651, 493.717651, 501.717651, 509.717651, 517.6189,
      525.44696, 533.275, 541.069336, 548.767, 556.332947, 563.7901, 571.5459,
      578.857666, 586.2719, 593.9568, 601.4463, 608.9942, 616.4043, 623.849548,
      631.849548, 639.849548, 647.4164, 655.1447, 662.9152, 670.804749,
      678.365967, 685.9821, 693.8102, 701.8102, 709.4616, 716.90686, 724.300232,
      731.709839, 739.26886, 746.8438, 754.258057, 761.2314, 768.0849, 775.6595,
      783.6595, 791.4549, 799.316, 806.841248, 814.3527, 821.622131, 828.797668,
      836.1751, 843.3214, 850.475159, 856.791748, 864.182861, 871.8343,
      879.4857, 887.3138, 895.3138, 902.9652, 910.854, 918.7494, 926.5855,
      934.3833, 942.325439, 950.266357, 958.246765, 966.0271, 973.8221,
      981.286865, 988.873169, 996.3373, 1004.08417, 1011.72186, 1019.28168,
      1027.08118, 1034.92737, 1042.75122, 1050.75122, 1058.75122, 1066.59412,
      1074.40955, 1081.85474, 1089.68286, 1097.54321, 1105.17188, 1113.08521,
      1120.96692, 1128.72192, 1136.54065, 1144.34326, 1152.23413, 1160.056,
      1167.34558, 1174.47925, 1181.54761, 1189.14, 1196.87952, 1204.42737,
      1211.85791, 1219.496, 1226.43384, 1233.4873, 1241.13867, 1248.79, 1256.79,
      1263.58057, 1268.75122, 1275.45508, 1283.30786, 1291.28735, 1299.284,
      1307.27344, 1315.27344, 1323.25769, 1331.24084, 1339.23975, 1347.23669,
      1355.23108, 1363.22522, 1371.22473, 1379.16809, 1386.95715, 1394.60852,
      1402.60852, 1410.25989, 1417.1427, 1424.02551, 1430.3501, 1431.80664,
    ];

    expect(curveFit._arclen.length).toBe(expected.length);
    curveFit._arclen.forEach((value, index) => {
      expect(approximate(value)).toBe(approximate(expected[index]));
    });
  });

  it('CurveFit.Fit', () => {
    // const results = CurveFit.Fit(linearized, 8);
    // expect(results.length).toBe(ExpectedCurveFitResult.length);
    // results.forEach((bezier, index) => {
    //   expect(approximate(bezier.p0.x)).toBe(
    //     approximate(ExpectedCurveFitResult[index].p0.x)
    //   );
    //   expect(approximate(bezier.p0.y)).toBe(
    //     approximate(ExpectedCurveFitResult[index].p0.y)
    //   );
    //   expect(approximate(bezier.p1.x)).toBe(
    //     approximate(ExpectedCurveFitResult[index].p1.x)
    //   );
    //   expect(approximate(bezier.p1.y)).toBe(
    //     approximate(ExpectedCurveFitResult[index].p1.y)
    //   );
    //   expect(approximate(bezier.p2.x)).toBe(
    //     approximate(ExpectedCurveFitResult[index].p2.x)
    //   );
    //   expect(approximate(bezier.p2.y)).toBe(
    //     approximate(ExpectedCurveFitResult[index].p2.y)
    //   );
    //   expect(approximate(bezier.p3.x)).toBe(
    //     approximate(ExpectedCurveFitResult[index].p3.x)
    //   );
    //   expect(approximate(bezier.p3.y)).toBe(
    //     approximate(ExpectedCurveFitResult[index].p3.y)
    //   );
    // });
  });
});