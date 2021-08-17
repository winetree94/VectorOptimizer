/* eslint-disable no-case-declarations */
import { CurveFit } from '../curves/curve-fit';
import { linearize } from '../curves/curve-preprocess';
import { Vector } from '../curves/vector';

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
    this._options = {
      ...this._options,
      ...options,
    };
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
    this.element.appendChild($startCircle);
    this.originPoints.push(startPoint);

    const onMouseMove = (event: MouseEvent) => {
      const point = {
        x: event.offsetX,
        y: event.offsetY,
      };
      const $circle = this.createCircle(point);
      this.element.appendChild($circle);
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
          this.element.appendChild($circle);
        });
        break;
      case RenderMode.PREPROCESSED:
        this.clearView();
        this.getPreprocessedVectors().forEach((vector) => {
          const $circle = this.createCircle(vector);
          this.element.appendChild($circle);
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
          this.getPreprocessedVectors(),
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
          this.element.appendChild($path);
        });
        break;
    }
  }
}
