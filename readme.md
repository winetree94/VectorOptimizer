![CI](https://github.com/winetree94/VanillaRecyclerView/workflows/CI/badge.svg?branch=master)
[![GitHub license](https://img.shields.io/github/license/winetree94/curves)](https://github.com/winetree94/curves/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/curves.svg)](https://badge.fury.io/js/curves)

# Curves

This is Javascript / Typescript implementation of [Bobby Fraser's 'Curves' C# Project.](https://gitlab.com/burningmime/curves)

Curves is vector optimization utility library, and i have modified it for use browser and node.js environment.

After implementing all the features of the origin project first, I will add my own stuff that I need.

if you want to use this project, please thank to Bobby Fraser, not me.

# What can you do with this?

if you draw in some shape using canvas or svg in browser, points will appear like below

![Screen Shot 2021-08-20 at 9 39 30 PM](https://user-images.githubusercontent.com/51369962/130234600-8b0e0073-d1d8-4d03-b94d-b9ca924c538b.png)

this looks like an intended shape, but points are too many and there's a bit of jitter visible.

it will help to reduce lots of points, while maintaning its original form like below.

![Screen Shot 2021-08-20 at 9 39 36 PM](https://user-images.githubusercontent.com/51369962/130234605-72595f6b-dafd-4d91-be7c-a1d32bb8b4c4.png)

it will optimize points and represent them as Cubic Bézier curves.

Using this, you can reduce the size of svg and increase the performance

# Live Example

![Screen Shot 2021-08-20 at 9 40 07 PM](https://user-images.githubusercontent.com/51369962/130234610-044bc079-2d4a-42a5-a60d-268c92103370.png)

I made an example app like the origin project, so you can test how it works and how much it deforms. ([Link](https://winetree94.github.io/curves))

# Currently Supported Features

Preprocessing
- [x] linearize
- [ ] Ramer-Douglas-Puecker

Optimization
- [x] optimization

# Installation

```bash
$ npm install curves
```

# How to import

### Plain HTML

```html
<script src=""></script>
```

### CommonJS

```js
const curves = require('curves');
```

### ES6 Import


```js
import * as curves from 'curves';
```

# API Document
