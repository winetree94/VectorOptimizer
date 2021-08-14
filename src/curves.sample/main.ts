import { Drawer, PreprocessMode, RenderMode } from './drawer/drawer';

const $svg: SVGSVGElement = document.getElementById(
  'svg-root'
) as unknown as SVGSVGElement;

let preprocessMode: PreprocessMode = PreprocessMode.NONE;
let renderMode: RenderMode = RenderMode.ORIGINAL_POINT;
let linearizePointDistance: number = 1;
let ramerDouglasPeuckerError: number = 1;
let curveFittingError: number = 1;

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

const $ramerDouglasPeuckerErrorDisplay = document.getElementById(
  'ramer-douglas-peucker-error'
);
const $ramerDouglasPeuckerError = document.getElementById(
  'ramer-douglas-peucker-error-slider'
) as HTMLInputElement;
$ramerDouglasPeuckerError.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  const value = Number(target.value);
  $ramerDouglasPeuckerErrorDisplay.innerHTML = target.value;
  ramerDouglasPeuckerError = value;
  onValueChanged();
});

const drawer = new Drawer($svg);

function onValueChanged(): void {
  drawer.options = {
    renderMode: renderMode,
    preprocessMode: preprocessMode,
    linearizePointDistance: linearizePointDistance,
  };
}
