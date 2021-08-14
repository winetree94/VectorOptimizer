import { FreeDrawRefOptions, SvgFreeDrawRef, TPoint } from './free-draw';
import { linearize } from './linearize';
import { Path, PathD, PathDPrefix, PathOptions } from './path';
import { Vector } from './vector';

export interface SVGPathRendererOptions
  extends FreeDrawRefOptions,
    PathOptions {
  maxVertexCountPerPath?: number;
}

export class SVGPathRenderer {
  public element: SVGElement;

  private _options: SVGPathRendererOptions = { bezier: true };
  private pathes: Path[] = [];

  public get options(): SVGPathRendererOptions {
    return this._options;
  }

  public set options(options: SVGPathRendererOptions) {
    Object.assign(this._options, options);
    this.pathes.forEach((path) => (path.options = this.options));
  }

  public constructor(element: SVGElement, options?: SVGPathRendererOptions) {
    this.element = element;
    this.options = options;
    console.log(this);
  }

  public getDrawablePath(): Path {
    if (
      (!this.options?.maxVertexCountPerPath && this.getLastPath()) ||
      this.getLastPath()?.partials.length < this.options?.maxVertexCountPerPath
    ) {
      return this.pathes[this.pathes.length - 1];
    } else {
      const createdPath = new Path(this.element, this.options);
      this.pathes.push(createdPath);
      return createdPath;
    }
  }

  public getFreeDrawRef(): SvgFreeDrawRef {
    return new SvgFreeDrawRef(this, this.options);
  }

  public merge(): void {
    const lines = this.getMergedPathD();
    this.clear();
    const path = this.getDrawablePath();
    path.append(...lines);
  }

  public getPathes(): Path[] {
    return this.pathes;
  }

  public applyPoints(strokes: TPoint[][]): void {
    const result: PathD[] = [];
    strokes.forEach((points) =>
      points.forEach((point, index, self) => {
        const { x, y } = point;
        if (index === 0) {
          const startPathD = new PathD(PathDPrefix.M, false, x, y);
          const circlePathD = new PathD(PathDPrefix.Q, false, x, y, x, y);
          result.push(startPathD, circlePathD);
        } else {
          const previous = self[index - 1];
          const isLastVertex = index === self.length - 1;
          const bezierPathD = new PathD(
            PathDPrefix.Q,
            false,
            previous.x,
            previous.y,
            isLastVertex ? x : (previous.x + x) / 2,
            isLastVertex ? y : (previous.y + y) / 2
          );
          result.push(bezierPathD);
        }
      })
    );
    this.apply(...result);
  }

  public getPoints(): TPoint[][] {
    return this.getMergedPathD().reduce<TPoint[][]>(
      (result, pathD, index, self) => {
        if (pathD.prefix === PathDPrefix.M) {
          result.push([]);
        }
        const target = result[result.length - 1];
        const previous = self[index - 1];

        if (previous && previous.prefix === PathDPrefix.M) {
          return result;
        }

        switch (pathD.prefix) {
          case PathDPrefix.Q:
          case PathDPrefix.L:
            target.push({
              x: pathD.values[0],
              y: pathD.values[1],
            });
            if (
              index === self.length - 1 ||
              (self[index + 1] && self[index + 1].prefix === PathDPrefix.M)
            ) {
              const [lastX, lastY] = pathD.values.slice(2);
              target.push({
                x: lastX,
                y: lastY,
              });
            }
            break;
        }
        return result;
      },
      []
    );
  }

  public translate(x: number, y: number): void {
    this.pathes.forEach((path) => path.translate(x, y));
  }

  public clear(): void {
    this.element.textContent = '';
    this.pathes.forEach((path) => path.destroy());
    this.pathes.splice(0);
  }

  public linearize(): void {
    const linearized = this.getLinearizedPoints();
    this.applyPoints(linearized);
  }

  private getLinearizedPoints(keepLast = true, all = false): Vector[][] {
    return this.getPoints().map((strokes) => {
      const linearizedPoints = linearize(
        strokes,
        this.options.linearMinDisance || 6,
        keepLast,
        all
      );
      return linearizedPoints;
    });
  }

  private getMergedPathD(includeHidden = false): PathD[] {
    return this.pathes.reduce<PathD[]>((result, currentPath) => {
      result.push(
        ...(includeHidden
          ? currentPath.partials
          : currentPath.partials.filter((partial) => !partial.hidden))
      );
      return result;
    }, []);
  }

  private apply(...pathD: PathD[]): void {
    this.pathes.splice(1);
    let [path] = this.pathes;
    if (!path) {
      path = this.getDrawablePath();
    }
    path.partials = pathD;
  }

  private getLastPath(): Path | undefined {
    return this.pathes[this.pathes.length - 1];
  }
}
