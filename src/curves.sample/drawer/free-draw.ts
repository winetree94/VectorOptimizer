import { Vector } from '../../curves/vector';
import { Path, PathD, PathDPrefix, PathOptions } from './path';
import { SVGPathRenderer } from './renderer';

export interface TPoint {
  x: number;
  y: number;
}

export interface FreeDrawRefOptions extends PathOptions {
  bezier?: boolean;
  trackingPoint?: boolean;
  realTimeLinearize?: boolean;
  linearMinDisance?: number;
}

export class SvgFreeDrawRef {
  private options: FreeDrawRefOptions;

  private _finished = false;

  private trackingElement: SVGPathElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );

  private trackingPoints: TPoint[] = [];

  private lastLinearized: TPoint;
  private lastRequested: TPoint;
  private cd = 0;

  private _lastPath?: Path;
  private _lastPathD?: PathD;

  public get finished(): boolean {
    return this._finished;
  }

  public constructor(
    private readonly renderer: SVGPathRenderer,
    options: PathOptions
  ) {
    this.options = {
      linearMinDisance: 6,
      bezier: true,
      ...options,
    };
  }

  public start(point: TPoint): void {
    if (this._finished) {
      throw new Error('Already finished reference');
    }
    const path = this.renderer.getDrawablePath();
    const startPathD = new PathD(PathDPrefix.M, false, point.x, point.y);
    path.append(startPathD);
    this._lastPath = path;
    this._lastPathD = (() => {
      if (this.options.bezier) {
        return new PathD(
          PathDPrefix.Q,
          false,
          point.x,
          point.y,
          point.x,
          point.y
        );
      } else {
        return new PathD(PathDPrefix.L, false, point.x, point.y);
      }
    })();
    path.append(this._lastPathD);
    this.lastLinearized = point;
    this.lastRequested = point;

    this.trackingElement.setAttribute(
      'stroke',
      this.options?.strokeColor || 'black'
    );
    this.trackingElement.setAttribute(
      'stroke-width',
      `${this.options?.strokeWidth || 1}`
    );
    this.trackingElement.setAttribute('fill', 'none');
    this.renderer.element.append(this.trackingElement);
  }

  public forward(point: TPoint): void {
    const td = Vector.from(this.lastLinearized).distance(Vector.from(point));
    const linearMinDisance = this.options.linearMinDisance;

    if (this.options.realTimeLinearize) {
      if (this.cd + td > linearMinDisance) {
        const pd = linearMinDisance - this.cd;
        const lerpPoint = Vector.from(this.lastRequested).lerp(
          Vector.from(point),
          pd / td
        );
        let rd = td - pd;
        while (rd > linearMinDisance) {
          rd -= linearMinDisance;
        }
        this.cd = rd;
        this.lastLinearized = lerpPoint;
        this.linearized(lerpPoint);
        this.trackingPoints.splice(0);
      } else {
        this.cd += td;
      }
    } else {
      this.linearized(point);
      this.trackingPoints.splice(0);
    }

    if (this.options.trackingPoint) {
      this.track(point);
    }
    this.lastRequested = point;
  }

  public finish(): void {
    if (this.lastRequested !== this.lastLinearized) {
      this.linearized(this.lastRequested);
    }
    this.trackingElement.parentElement?.removeChild(this.trackingElement);
    if (this._finished) {
      throw new Error('Already finished draw reference');
    }
    if (this._lastPathD.prefix === PathDPrefix.L && this.options.bezier) {
      const previous =
        this._lastPath.partials[this._lastPath.partials.length - 2];
      previous.values = [
        ...previous.values.slice(0, 2),
        ...this._lastPathD.values,
      ];
      this._lastPath.remove(this._lastPathD);
      this._lastPath.render();
    }
    this._finished = true;
  }

  private track(point: TPoint): void {
    this.trackingPoints.push(point);
    this.trackingElement.setAttribute(
      'd',
      this.trackingPoints.reduce((result, current, index, self) => {
        let d = result;
        if (index === 0) {
          d += `M ${current.x} ${current.y}`;
        }
        if (self[index + 1] && self[self.length - 1] !== current) {
          const next = self[index + 1];
          d += ` Q ${current.x} ${current.y} ${(current.x + next.x) / 2} ${
            (current.y + next.y) / 2
          }`;
        }
        return d;
      }, '')
    );
  }

  private linearized({ x, y }: TPoint): void {
    if (this._finished) {
      throw new Error('Already finished reference');
    }
    const path = this.renderer.getDrawablePath();

    if (this._lastPathD?.prefix === PathDPrefix.L && this.options.bezier) {
      const [previousX, previousY] = this._lastPathD.values;
      this._lastPathD.prefix = PathDPrefix.Q;
      this._lastPathD.values.push((x + previousX) / 2, (y + previousY) / 2);
      if (path !== this._lastPath) {
        this._lastPath.render();
      }
    }

    if (path.partials.length === 0) {
      const values = (() => {
        if (this._lastPathD) {
          return this._lastPathD.values.slice(
            this._lastPathD.values.length - 2
          );
        } else {
          return [x, y];
        }
      })();
      const mPathD = new PathD(PathDPrefix.M, true, ...values);
      path.append(mPathD);
    }

    const pathD = new PathD(PathDPrefix.L, false, x, y);
    this._lastPath = path;
    this._lastPathD = pathD;
    path.append(pathD);
  }
}
