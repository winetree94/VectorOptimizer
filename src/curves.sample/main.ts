import { Drawer, PreprocessMode, RenderMode } from './drawer';

const $svg: SVGSVGElement = document.getElementById(
  'svg-root'
) as unknown as SVGSVGElement;

let preprocessMode: PreprocessMode = PreprocessMode.NONE;
let renderMode: RenderMode = RenderMode.ORIGINAL_POINT;
let colorize: boolean = true;
let linearizePointDistance: number = 8;
let ramerDouglaspeucherError: number = 1;
let curveFittingError: number = 8;

const $preprocessModes = document.getElementsByName('preprocess-mode');
$preprocessModes.forEach(($preprocessMode) =>
  $preprocessMode.addEventListener('click', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      preprocessMode = target.value as PreprocessMode;
      onValueChanged();
    }
  })
);

const $renderModes = document.getElementsByName('render-mode');
$renderModes.forEach(($renderMode) =>
  $renderMode.addEventListener('click', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      renderMode = target.value as RenderMode;
      onValueChanged();
    }
  })
);

const $colorize = document.getElementById('colorize') as HTMLInputElement;
$colorize.addEventListener('click', (e) => {
  colorize = !!$colorize.checked;
  onValueChanged();
});

const $linearizePointDistanceDisplay = document.getElementById(
  'linearize-point-distance'
);
const $linearizePointDistance = document.getElementById(
  'linearize-point-distance-slider'
) as HTMLInputElement;
$linearizePointDistance.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  const value = Number(target.value);
  $linearizePointDistanceDisplay.innerHTML = target.value;
  linearizePointDistance = value;
  onValueChanged();
});

const $curveFittingErrorDisplay = document.getElementById(
  'curve-fitting-error'
);
const $curveFittingError = document.getElementById(
  'curve-fitting-error-slider'
) as HTMLInputElement;
$curveFittingError.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  const value = Number(target.value);
  $curveFittingErrorDisplay.innerHTML = target.value;
  curveFittingError = value;
  onValueChanged();
});

const $ramerDouglaspeucherErrorDisplay = document.getElementById(
  'ramer-douglas-peucher-error'
);
const $ramerDouglaspeucherError = document.getElementById(
  'ramer-douglas-peucher-error-slider'
) as HTMLInputElement;
$ramerDouglaspeucherError.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  const value = Number(target.value);
  $ramerDouglaspeucherErrorDisplay.innerHTML = target.value;
  ramerDouglaspeucherError = value;
  onValueChanged();
});

const drawer = new Drawer($svg);

function onValueChanged(): void {
  drawer.options = {
    renderMode: renderMode,
    preprocessMode: preprocessMode,
    linearizePointDistance: linearizePointDistance,
    curveFittingError: curveFittingError,
    colorize: colorize,
  };
}
