import { Drawer } from './drawer/drawer';

const $svg: SVGElement = document.getElementById(
  'svg-root'
) as unknown as SVGElement;
const $clear = document.getElementById('clear') as HTMLButtonElement;
const $linearize = document.getElementById('linearize') as HTMLButtonElement;
const $optimize = document.getElementById('optimize') as HTMLButtonElement;

const drawer = new Drawer($svg);

$clear.onclick = () => drawer.erase();
$linearize.onclick = () => drawer.linearize();
$optimize.onclick = () => drawer.optimize();
