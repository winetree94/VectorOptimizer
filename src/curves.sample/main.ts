import { Drawer } from './drawer/drawer';

document.body.style.margin = '0';

const $svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

$svg.style.width = '100%';
$svg.style.height = '100vh';

document.body.innerHTML = '';
document.body.append($svg);

const drawer = new Drawer($svg);
