![CI](https://github.com/winetree94/VanillaRecyclerView/workflows/CI/badge.svg?branch=master)
[![GitHub license](https://img.shields.io/github/license/winetree94/VectorOptimizer)](https://github.com/winetree94/VectorOptimizer/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/vector-optimizer.svg)](https://badge.fury.io/js/vector-optimizer)

English | [한국어](https://github.com/winetree94/VectorOptimizer/blob/master/readme/readme-ko.md)

---

# VectorOptimizer

This is Javascript / Typescript implementation of [Bobby Fraser's 'Curves' C# Project.](https://gitlab.com/burningmime/curves)

Curves is vector optimization utility library, and i have modified it for use browser and node.js environment.

After implementing all the features of the origin project first, I will add my own stuff that I need.

if you want to use this project, please thank to Bobby Fraser, not me.

---

# What can you do with this?

if you draw in some shape using canvas or svg in browser, points will appear like below

![Original Points](https://user-images.githubusercontent.com/51369962/155883128-315afbb4-f179-4391-80a7-91b9b64fb8ba.png)

If you connect these points in a straight line, lines will appear like below

![Original Lines](https://user-images.githubusercontent.com/51369962/155883127-f34fffd8-8aaa-4a9a-bc26-b8aa5f2fc82e.png)

this looks like an intended shape, but points are too many and there's a bit of jitter visible.

Using this project, you can reduce the number of points as below and show a natural curve shape.

![Linearized Points](https://user-images.githubusercontent.com/51369962/155883126-8cb76bec-7a48-4378-91c0-5515f1767781.png)

![Optimized Curves](https://user-images.githubusercontent.com/51369962/155883123-888eb0a2-8bb2-4034-93df-03088a4651a7.png)

---

# Live Example

![Screen Shot 2021-08-20 at 9 40 07 PM](https://user-images.githubusercontent.com/51369962/130234610-044bc079-2d4a-42a5-a60d-268c92103370.png)

I made an example app like the origin project, so you can test how it works and how much it deforms. ([Link](https://winetree94.github.io/VectorOptimizer))

---

# Currently supported features compared to the original project

Preprocessing
- [x] linearize
- [ ] Ramer-Douglas-Puecker

FitCurve
- [x] FitCurve

# Installation

```bash
$ npm install vector-optimizer
```

---

# How to import

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

# API Document

It operates in two stages. The first is the `Linearize(Simplify)` step, and the second is the `Fit(Fit curves to the data)` step.

I recommend playing around with the [sample app link](https://winetree94.github.io/VectorOptimizer) for a bit to get a feel for exactly
how the parameters and pre-processing methods work.

Also, please refer to the explanation of the original project.

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