import { SVGPathRenderer, SVGPathRendererOptions } from './renderer';

export interface DrawerOptions {
  strokeWidth: number;
  strokeColor: string;
}

export class Drawer {
  private renderer: SVGPathRenderer;

  public constructor(private readonly element: SVGElement) {
    this.renderer = new SVGPathRenderer(element, {
      bezier: true,
      maxVertexCountPerPath: 30,
      realTimeLinearize: true,
      linearMinDisance: 3,
      trackingPoint: true,
      strokeColor: 'black',
      strokeWidth: 5,
    });
    element.addEventListener('pointerdown', this.onMouseDown.bind(this));
    element.addEventListener('mousedown', this.onMouseDown.bind(this));
    element.addEventListener('touchstart', (e) => e.preventDefault());
  }

  public setOptions(options: SVGPathRendererOptions): void {
    this.renderer.options = options;
  }

  private onMouseDown(event: MouseEvent): void {
    event.preventDefault();

    const ref = this.renderer.getFreeDrawRef();
    ref.start({
      x: event.offsetX,
      y: event.offsetY,
    });

    const onMouseMove = (event: MouseEvent) => {
      ref.forward({
        x: event.offsetX,
        y: event.offsetY,
      });
    };

    const onMouseUp = (event: MouseEvent) => {
      this.renderer.merge();
      this.element.removeEventListener('pointermove', onMouseMove);
      this.element.removeEventListener('pointerup', onMouseUp);
      this.element.removeEventListener('mousemove', onMouseMove);
      this.element.removeEventListener('mouseup', onMouseUp);
      ref.finish();
    };

    this.element.addEventListener('mousemove', onMouseMove);
    this.element.addEventListener('mouseup', onMouseUp);
    this.element.addEventListener('pointermove', onMouseMove);
    this.element.addEventListener('pointerup', onMouseUp);
  }

  public linearize(): void {
    this.renderer.linearize();
  }

  public erase(): void {
    this.renderer.clear();
  }
}
