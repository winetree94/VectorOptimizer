const fixed = (num: number) => Number(num.toFixed(1));

export enum PathDPrefix {
  M = 'M',
  L = 'L',
  C = 'C',
  T = 'T',
  Q = 'Q',
  a = 'a',
  COMMA = ',',
}

export class PathD {
  public hidden = false;
  public prefix: PathDPrefix;
  public values: number[];

  public constructor(
    prefix: PathDPrefix,
    hidden: boolean,
    ...values: number[]
  ) {
    this.hidden = hidden;
    this.prefix = prefix;
    this.values = values;
  }

  public toString(): string {
    return `${this.prefix} ${this.values
      .map((value) => fixed(value))
      .join(' ')}`;
  }
}

export interface PathOptions {
  strokeWidth?: number;
  strokeColor?: string;
  fill?: string;
}

export class Path {
  public $element: SVGPathElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );

  private _options: PathOptions = {};
  private _partials: Readonly<PathD[]> = [];

  public get partials(): Readonly<PathD[]> {
    return this._partials;
  }

  public set partials(partials: Readonly<PathD[]>) {
    this._partials = partials;
    this.render();
  }

  public get options(): PathOptions {
    return this._options;
  }

  public set options(options: PathOptions) {
    Object.assign(this._options, options);
    this.$element.setAttribute('stroke', `${this.options?.strokeColor || 1}`);
    this.$element.setAttribute(
      'stroke-width',
      `${this.options?.strokeWidth || 1}`
    );
    this.$element.setAttribute('fill', this.options?.fill || 'none');
  }

  public constructor(private readonly $svg: SVGElement, options?: PathOptions) {
    this.options = options;
    this.$svg.appendChild(this.$element);
  }

  public append(...partials: PathD[]): void {
    this.partials = [...this.partials, ...partials];
  }

  public remove(...partials: PathD[]): void {
    const clone = this.partials.slice();
    partials.forEach((partial) => {
      const index = clone.indexOf(partial);
      if (index !== -1) {
        clone.splice(index, 1);
      }
    });
    if (clone.length !== this.partials.length) {
      this.partials = clone;
    }
  }

  public toString(): string {
    return this.partials.map((line) => line.toString()).join(' ');
  }

  public translate(x: number, y: number): void {
    this.$element.setAttribute('transform', `translate(${x}, ${y})`);
  }

  public destroy(): void {
    this.$element.parentElement?.removeChild(this.$element);
  }

  public render(): void {
    const model = this.toString();
    if (this.$element.getAttribute('d') !== model) {
      this.$element.setAttribute('d', model);
    }
  }
}
