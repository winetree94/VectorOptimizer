![CI](https://github.com/winetree94/VanillaRecyclerView/workflows/CI/badge.svg?branch=master)
[![GitHub license](https://img.shields.io/github/license/winetree94/VectorOptimizer)](https://github.com/winetree94/VectorOptimizer/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/vector-optimizer.svg)](https://badge.fury.io/js/vector-optimizer)

[English](https://github.com/winetree94/VectorOptimizer) | 한국어

---

# VectorOptimizer

이 프로젝트는 [Bobby Fraser's 'Curves' C# Project.](https://gitlab.com/burningmime/curves) 를 Javascript / Typescript 로 재구현한 것입니다.

Curves 는 벡터 최적화 유틸리티이며, 저는 이것을 브라우저와 Node.js 환경에서 동작할 수 있도록 재작성하였습니다.

원본 프로젝트의 모든 내용을 먼저 구현한 이후에, 제게 필요한 기능을 점진적으로 추가할 계획입니다.

만약 이 프로젝트를 사용하고자 한다면, 제가 아닌 Bobby Fraser 에게 감사를 전해주세요.

---

# 이것을 통해 무엇을 할 수 있나요?

만약 사용자가 브라우저에서 펜이나 마우스를 사용해 선을 그린다면, 점선은 아래와 같이 나타날 것 입니다.

![Original Points](https://user-images.githubusercontent.com/51369962/155883128-315afbb4-f179-4391-80a7-91b9b64fb8ba.png)

그리고 이 선들을 직선으로 잇는다면, 선은 아래와 같이 나타날 것 입니다.

![Original Lines](https://user-images.githubusercontent.com/51369962/155883127-f34fffd8-8aaa-4a9a-bc26-b8aa5f2fc82e.png)

이는 어느 정도는 의도된 모양대로 나오지만, 점선이 너무 많으며 지터링 현상이 보이게 됩니다.

이 프로젝트를 사용하면 아래와 같이 점의 개수를 줄이고, 자연스러운 곡선 형태를 표현할 수 있습니다.

![Linearized Points](https://user-images.githubusercontent.com/51369962/155883126-8cb76bec-7a48-4378-91c0-5515f1767781.png)

![Optimized Curves](https://user-images.githubusercontent.com/51369962/155883123-888eb0a2-8bb2-4034-93df-03088a4651a7.png)

---

# 실시간 예제

![Screen Shot 2021-08-20 at 9 40 07 PM](https://user-images.githubusercontent.com/51369962/130234610-044bc079-2d4a-42a5-a60d-268c92103370.png)

저는 원본 프로젝트와 유사하게 예제 프로젝트를 만들어 두었습니다. 이 프로젝트가 어떻게 동작하는지를 먼저 확인해보세요. ([Link](https://winetree94.github.io/VectorOptimizer))

---

# 원본 프로젝트 대비 지원되는 기능

Preprocessing
- [x] linearize
- [ ] Ramer-Douglas-Puecker

FitCurve
- [x] FitCurve

# 설치 방법

```bash
$ npm install vector-optimizer
```

---

# 프로젝트에 포함시키는 방법

### Plain HTML

```html
<script src="https://unpkg.com/vector-optimizer@latest/dist/vector-optimizer.min.js"></script>
```

### CommonJS

```js
const VectorOptimizer = require('vector-optimizer');
```

### ES6 Import


```js
import * as VectorOptimizer from 'vector-optimizer';
```

---

# API 문서

이 프로젝트는 크게 두 단계로 동작합니다. 첫번째는 `Linearize(Simplify)` 라 불리는 점의 단순화 작업이며, 두번째는 점을 곡선 형태로 변환시키는 `Fit(Fit curves to the data)` 단계입니다.

문서를 읽기 전에 각 단계와 파라미터가 어떻게 작용하는지 확인하기 위해 예제를 먼저 확인하는 것을 추천합니다. [sample app link](https://winetree94.github.io/VectorOptimizer). 또한 원본 프로젝트의 설명도 참조하는 것을 권장합니다.

## Linearize

```typescript
/**
 * @description
 * Creates a list of equally spaced points that lie on the path described by straight line segments between
 * adjacent points in the source list.
 * 
 * @param src - Source list of points.
 * @param minDistance - Distance between points on the new path.
 * @return - List of equally-spaced points on the path.
 */
export declare function linearize(
  src: Vector[],
  minDistance: number,
): Vector[];
```

## Fit

```typescript
export declare class CurveFit extends CurveFitBase {

  /**
   * @param points - Set of points to fit to.
   */
  constructor(
    points: ReadonlyArray<Vector>,
  );

/**
 * @description
 * Attempts to fit a set of Bezier curves to the given data. It returns a set of curves that form a
 * http://en.wikipedia.org/wiki/Composite_B%C3%A9zier_curve with C1 continuity (that is, each curve's start
 * point is coincident with the previous curve's end point, and the tangent vectors of the start and end
 * points are going in the same direction, so the curves will join up smoothly). Returns an empty array
 * if less than two points in input.
 * 
 * Input data MUST not contain repeated points (that is, the same point twice in succession). The best way to
 * ensure this is to call any one of the methods in <see cref="CurvePreprocess" />, since all three pre-processing
 * methods will remove duplicate points. If repeated points are encountered, unexpected behavior can occur.
 * 
 * @param maxError - Maximum distance from any data point to a point on the generated curve.
 */
  fit(maxError: number): CubicBezier[];
}
```