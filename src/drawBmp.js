import { putPixel, resizeCanvas } from "./canvasHelpers";

export function drawBmp(contents) {
  // losowy test
  resizeCanvas(320, 240);
  for (let x = 0; x < 320; x++) {
    for (let y = 0; y < 240; y++) {
      putPixel(
        x,
        y,
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255
      );
    }
  }
}
