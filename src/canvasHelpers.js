/**
 * Funkcja zmieniająca rozmiar płótna
 * @param {Number} width - nowa szerokość
 * @param {Number} height - nowa wysokość
 */
export function resizeCanvas(width, height) {
  // pobieramy płótno z HTMLa
  const canvas = document.getElementById("main");
  // ustawiamy szerokość i wysokość na podane w argumentach funkcji
  canvas.width = width;
  canvas.height = height;
}

/**
 * Funkcja stawiająca piksel na płótnie. Implementacja bardzo naiwna i mało wydajna.
 * Nie wykorzystuj jej w prawdziwych projektach.
 * @param {Number} x - pozycja X piksela
 * @param {Number} y - pozycja Y piksela
 * @param {Number} red - wartość kanału koloru czerwonego (0-255)
 * @param {Number} green - wartość kanału koloru zielonego (0-255)
 * @param {Number} blue - wartość kanału koloru niebieskiego (0-255)
 */
export function putPixel(x, y, red, green, blue) {
  // pobieramy płótno z HTMLa
  const canvas = document.getElementById("main");
  // pobieramy kontekst rysowania w 2D
  const context = canvas.getContext("2d");
  // ustawiamy kolor wypełnienia (w takiej formie jak w CSS)
  context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
  // stawiamy prostokąt o wymiarach 1x1 na wskazanej pozycji
  context.fillRect(x, y, 1, 1);
}
