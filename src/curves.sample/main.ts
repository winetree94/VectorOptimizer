import { Drawer } from './drawer/drawer';

const $svg: SVGElement = document.getElementById(
  'svg-root'
) as unknown as SVGElement;

const drawer = new Drawer($svg);
