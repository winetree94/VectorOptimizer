/* eslint-disable no-case-declarations */
import { SampleVertexes } from '../spec/vector-optimizer/curve-preprocess.sample';
import { CurveFit } from '../src/vertor-optimizer/curve-fit';
import { linearize, rdpReduce } from '../src/vertor-optimizer/curve-preprocess';
import { Vector } from '../src/vertor-optimizer/vector';

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
  ORIGINAL_POINTS = 'original-points',
  ORIGINAL_LINES = 'original-lines',
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
  rdpError: number;
  curveFittingError: number;
  colorize: boolean;
}

export class Drawer {
  private originPoints: Point[] = SampleVertexes.slice(0);

  private _options: DrawerOptions = {
    preprocessMode: PreprocessMode.NONE,
    renderMode: RenderMode.ORIGINAL_POINTS,
    linearizePointDistance: 8,
    rdpError: 1,
    curveFittingError: 8,
    colorize: true,
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
    this.render();
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
        return rdpReduce(this.transformToVector(), this.options.rdpError);
    }
  }

  private render(): void {
    switch (this.options.renderMode) {
      case RenderMode.ORIGINAL_POINTS:
        this.clearView();
        this.originPoints.forEach((point) => {
          const $circle = this.createCircle(point);
          this.element.appendChild($circle);
        });
        break;
      case RenderMode.ORIGINAL_LINES:
        this.clearView();
        for (let i = 1; i < this.originPoints.length; i++) {
          const previous = this.originPoints[i - 1];
          const current = this.originPoints[i];
          const $polyline = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'polyline'
          );
          $polyline.setAttribute('fill', 'none');
          $polyline.setAttribute(
            'stroke',
            this.options.colorize ? getRandomColor() : 'red'
          );
          $polyline.setAttribute(
            'points',
            `${previous.x} ${previous.y} ${current.x}, ${current.y}`
          );
          this.element.appendChild($polyline);
        }
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

        const preproccessed = this.getPreprocessedVectors();
        const curveFit = new CurveFit(preproccessed);
        const cubicBeziers = curveFit.fit(this.options.curveFittingError);
        cubicBeziers.forEach((bezier) => {
          const $path = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
          );
          $path.setAttribute('fill', 'none');
          $path.setAttribute(
            'stroke',
            this.options.colorize ? getRandomColor() : 'red'
          );
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
