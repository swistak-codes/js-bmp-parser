import { drawBmp } from "./drawBmp";

document.getElementById("file-input").addEventListener("change", (e) => {
  // bierzemy pierwszy z plików wczytanych do inputa
  const file = e.target.files[0];
  // jezeli pliku nie ma, przerywamy operacje
  if (!file) {
    return;
  }

  // FileReader pozwala na odczyt plikow binarnych w przegladarkowym JS
  const reader = new FileReader();
  // tworzymy akcje, ktora wykona sie gdy FileReader skonczy przetwarzanie pliku
  reader.onload = (event) => {
    const contents = event.target.result;
    // wywolujemy nasza funkcje odczytujaca plik BMP
    drawBmp(contents);
  };
  // wywolujemy odczyt pliku jako tablice bajtow
  reader.readAsArrayBuffer(file);
});
