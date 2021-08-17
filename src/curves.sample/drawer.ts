/* eslint-disable no-case-declarations */
import { CurveFit } from '../curves/curve-fit';
import { linearize } from '../curves/curve-preprocess';
import { Vector } from '../curves/vector';

const test = [
  {
    x: 418,
    y: 382,
  },
  {
    x: 418,
    y: 383,
  },
  {
    x: 418,
    y: 386,
  },
  {
    x: 422,
    y: 395,
  },
  {
    x: 427,
    y: 405,
  },
  {
    x: 431,
    y: 411,
  },
  {
    x: 440,
    y: 424,
  },
  {
    x: 447,
    y: 434,
  },
  {
    x: 459,
    y: 449,
  },
  {
    x: 471,
    y: 464,
  },
  {
    x: 478,
    y: 474,
  },
  {
    x: 492,
    y: 491,
  },
  {
    x: 504,
    y: 506,
  },
  {
    x: 516,
    y: 523,
  },
  {
    x: 523,
    y: 531,
  },
  {
    x: 534,
    y: 547,
  },
  {
    x: 544,
    y: 559,
  },
  {
    x: 551,
    y: 567,
  },
  {
    x: 557,
    y: 575,
  },
  {
    x: 562,
    y: 582,
  },
  {
    x: 568,
    y: 590,
  },
  {
    x: 572,
    y: 596,
  },
  {
    x: 575,
    y: 599,
  },
  {
    x: 579,
    y: 603,
  },
  {
    x: 582,
    y: 607,
  },
  {
    x: 585,
    y: 611,
  },
  {
    x: 586,
    y: 612,
  },
  {
    x: 587,
    y: 612,
  },
  {
    x: 588,
    y: 612,
  },
  {
    x: 589,
    y: 611,
  },
  {
    x: 594,
    y: 603,
  },
  {
    x: 599,
    y: 597,
  },
  {
    x: 617,
    y: 577,
  },
  {
    x: 638,
    y: 556,
  },
  {
    x: 664,
    y: 534,
  },
  {
    x: 686,
    y: 515,
  },
  {
    x: 725,
    y: 484,
  },
  {
    x: 752,
    y: 467,
  },
  {
    x: 793,
    y: 440,
  },
  {
    x: 819,
    y: 423,
  },
  {
    x: 832,
    y: 416,
  },
  {
    x: 854,
    y: 402,
  },
  {
    x: 859,
    y: 399,
  },
  {
    x: 866,
    y: 394,
  },
  {
    x: 867,
    y: 393,
  },
  {
    x: 868,
    y: 392,
  },
  {
    x: 869,
    y: 392,
  },
].map((point) => Vector.from(point));

function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export interface Point {
  x: number;
  y: number;
}

export enum RenderMode {
  ORIGINAL_POINT = 'original-points',
  PREPROCESSED = 'preprocessed',
  CONTROL_POINTS = 'control-points',
  REPARAMATERIZED = 'reparamaterized',
  FINAL_CURVES = 'final-curves',
}

export enum PreprocessMode {
  NONE = 'none',
  LINEARIZE = 'linearize',
  RAMER_DOUGLAS_PEUCHER = 'ramer-douglas-peucher',
}

export interface DrawerOptions {
  renderMode: RenderMode;
  preprocessMode: PreprocessMode;
  linearizePointDistance: number;
  curveFittingError: number;
}

export class Drawer {
  private originPoints: Point[] = [];

  private _options: DrawerOptions = {
    preprocessMode: PreprocessMode.NONE,
    renderMode: RenderMode.ORIGINAL_POINT,
    linearizePointDistance: 1,
    curveFittingError: 1,
  };

  public get options(): DrawerOptions {
    return this._options;
  }

  public set options(options: DrawerOptions) {
    Object.assign(this._options, options);
    this.render();
  }

  public constructor(private readonly element: SVGSVGElement) {
    element.addEventListener('pointerdown', this.onMouseDown.bind(this));
    element.addEventListener('mousedown', this.onMouseDown.bind(this));
    element.addEventListener('touchstart', (e) => e.preventDefault());
  }

  private onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.clearOriginPoints();
    this.clearView();

    const startPoint = {
      x: event.offsetX,
      y: event.offsetY,
    };
    const $startCircle = this.createCircle(startPoint);
    this.element.append($startCircle);
    this.originPoints.push(startPoint);

    const onMouseMove = (event: MouseEvent) => {
      const point = {
        x: event.offsetX,
        y: event.offsetY,
      };
      const $circle = this.createCircle(point);
      this.element.append($circle);
      this.originPoints.push(point);
    };

    const onMouseUp = () => {
      this.element.removeEventListener('pointermove', onMouseMove);
      this.element.removeEventListener('pointerup', onMouseUp);
      this.element.removeEventListener('mousemove', onMouseMove);
      this.element.removeEventListener('mouseup', onMouseUp);
      this.render();
    };

    this.element.addEventListener('mousemove', onMouseMove);
    this.element.addEventListener('mouseup', onMouseUp);
    this.element.addEventListener('pointermove', onMouseMove);
    this.element.addEventListener('pointerup', onMouseUp);
  }

  public createCircle(point: Point): SVGCircleElement {
    const $circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    $circle.setAttribute('cx', point.x.toString());
    $circle.setAttribute('cy', point.y.toString());
    $circle.setAttribute('r', (1).toString());
    $circle.setAttribute('fill', 'red');
    return $circle;
  }

  public clearOriginPoints(): void {
    this.originPoints.splice(0);
  }

  public clearView(): void {
    this.element.innerHTML = '';
  }

  private transformToVector(): Vector[] {
    return this.originPoints.map((point) => Vector.from(point));
  }

  private getPreprocessedVectors(): Vector[] {
    switch (this.options.preprocessMode) {
      case PreprocessMode.NONE:
        return this.transformToVector();
      case PreprocessMode.LINEARIZE:
        return linearize(
          this.transformToVector(),
          this.options.linearizePointDistance
        );
      case PreprocessMode.RAMER_DOUGLAS_PEUCHER:
        return this.transformToVector();
    }
  }

  private render(): void {
    switch (this.options.renderMode) {
      case RenderMode.ORIGINAL_POINT:
        this.clearView();
        this.originPoints.forEach((point) => {
          const $circle = this.createCircle(point);
          this.element.append($circle);
        });
        break;
      case RenderMode.PREPROCESSED:
        this.clearView();
        this.getPreprocessedVectors().forEach((vector) => {
          const $circle = this.createCircle(vector);
          this.element.append($circle);
        });
        break;
      case RenderMode.FINAL_CURVES:
        this.clearView();
        const $path = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );
        $path.setAttribute('fill', 'none');
        $path.setAttribute('stroke', 'red');

        CurveFit.Fit(
          test,
          // this.getPreprocessedVectors(),
          this.options.curveFittingError
        ).forEach((bezier) => {
          const $path = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
          );
          $path.setAttribute('fill', 'none');
          $path.setAttribute('stroke', getRandomColor());
          $path.setAttribute('stroke-width', `${2}px`);
          $path.setAttribute(
            'd',
            `M ${bezier.p0.x} ${bezier.p0.y} C ${bezier.p1.x} ${bezier.p1.y} ${bezier.p2.x} ${bezier.p2.y} ${bezier.p3.x} ${bezier.p3.y}`
          );
          this.element.append($path);
        });
        break;
    }
  }
}
