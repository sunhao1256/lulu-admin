export const canvasFitViewport = (viewer) => {
  viewer.get('canvas').zoom('fit-viewport', 'auto');
}

export const scrollZoom = (viewer,s: number) => {
  viewer.get('zoomScroll').stepZoom(s);
}
