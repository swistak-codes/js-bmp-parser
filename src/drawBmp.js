import { putPixel, resizeCanvas } from "./canvasHelpers";

function bytesToNumber(...bytes) {
  // inicjalizujemy zmienna gdzie bedziemy trzymac wynik
  let result = 0;
  // iterujemy po kolei po bajtach podanych jako argument funkcji
  for (let i = 0; i < bytes.length; i++) {
    // obliczamy przesuniecie z jakim musimy przesunac bajt, sa to kolejne wielokrotnosci liczby 8
    const pad = 8 * i;
    // gdyby liczba byla zapisana jako big-endian to wowczas uzylibysmy:
    // const pad = 8 * (bytes.length - 1 - i);

    // aby "zlozyc" liczbe stosujemy operacje OR
    result = result | (bytes[i] << pad);
  }

  return result;
}

function isBmpFile(contents) {
  // Signature 	2 bytes 	0000h
  // bajty których oczekujemy jako dwa pierwsze to litery BM w kodzie ASCII
  const BM = ["B".charCodeAt(0), "M".charCodeAt(0)]; // 0x42, 0x4D
  // sprawdzamy czy dwa pierwsze bajty są takie jakich oczekujemy
  const hasBM = contents[0x00] === BM[0] && contents[0x01] === BM[1];

  console.log("isBmpFile:", hasBM, contents[0], contents[1]);
  return hasBM;
}

function getDataOffset(contents) {
  // DataOffset 	4 bytes 	000Ah

  // liczba jest zapisana jako little-endian więc czytamy od tyłu
  // do tego musimy "złozyć ją w całość" do czego stosujemy przesunięcia bitowe
  // const offset =
  //   contents[0x0a] |
  //   (contents[0x0a + 1] << 8) |
  //   (contents[0x0a + 2] << 16) |
  //   (contents[0x0a + 3] << 24);

  // aby nie powtarzac kodu, skorzystamy z naszej funkcji pomocniczej
  // niestety majac ArrayBuffer nie mozemy skorzytac z JSowej funkcji Array.slice
  // dlatego wyciagamy po kolei wartosci
  const offset = bytesToNumber(
    contents[0x0a],
    contents[0x0a + 1],
    contents[0x0a + 2],
    contents[0x0a + 3]
  );

  console.log("getDataOffset:", offset);
  return offset;
}

function getWidthAndHeight(contents) {
  // Width 	4 bytes 	0012h
  // Height 	4 bytes 	0016h

  // analogicznie jak przy getDataOffset, konwertujemy nasze poszczegolne bajty
  // na 32-bitowa liczbe calkowita
  const width = bytesToNumber(
    contents[0x12],
    contents[0x12 + 1],
    contents[0x12 + 2],
    contents[0x12 + 3]
  );
  const height = bytesToNumber(
    contents[0x16],
    contents[0x16 + 1],
    contents[0x16 + 2],
    contents[0x16 + 3]
  );

  console.log("getWidthAndHeight:", width, height);
  return [width, height];
}

function getBitsPerPixel(contents) {
  // Bits Per Pixel 	2 bytes 	001Ch

  // po raz kolejny musimy otrzymać liczbę
  // jedyna róznica jest taka, ze teraz mamy jedynie 2 bajty (16 bitów)
  const bpp = bytesToNumber(contents[0x1c], contents[0x1c + 1]);

  console.log("getBitsPerPixel:", bpp);
  return bpp;
}

function isCompressedFile(contents) {
  // Compression 	4 bytes 	001Eh

  // dla ulatwienia obslugujemy tylko nieskompresowane pliki BMP
  // nieskompresowane pliki BMP maja wszystkie te 4 bajty ustawione na 0
  // dlatego aby stwierdzic czy jest skompresowany, mozemy sprawdzic
  // czy ktorykolwiek z bitow jest rozny od 0
  const isCompressed =
    contents[0x1e] !== 0 ||
    contents[0x1e + 1] !== 0 ||
    contents[0x1e + 2] !== 0 ||
    contents[0x1e + 3] !== 0;

  console.log(
    "isCompressedFile:",
    isCompressed,
    contents[0x1e],
    contents[0x1e + 1],
    contents[0x1e + 2],
    contents[0x1e + 3]
  );
  return isCompressed;
}

function drawRow(contents, start, end, width, currentHeight) {
  // obliczamy kiedy zaczyna sie czesc do pominiecia
  const padStart = width * 3 + start;
  // zmienna pomocnicza, gdzie bedziemy trzymac aktualna pozycje X na obrazie
  let x = 0;

  // przechodzimy po kolei po pikselach obrazu, kazdy piksel zajmuje 3 bity
  for (let i = start; i <= end; i += 3, x++) {
    if (i >= padStart) {
      // jeśli weszliśmy w obszar do pominięcia, to przerywamy pętlę
      break;
    }
    // kazdy piksel jest zapisany w postaci NIEBIESKI,ZIELONY,CZERWONY
    const blue = contents[i];
    const green = contents[i + 1];
    const red = contents[i + 2];

    // stawiamy piksel na obrazie
    putPixel(x, currentHeight, red, green, blue);
  }
}

export async function drawBmp(byteArray) {
  // tworzymy widok dzięki któremu będziemy mogli podgladac po kolei kolejne bajty pliku
  const contents = new Uint8Array(byteArray);

  // sprawdzamy czy nasz plik to prawidlowe BMP
  const isBmp = isBmpFile(contents);
  if (!isBmp) {
    // jezeli nie jest BMP, wyswietlamy komunikat i przerywamy odczyt
    alert("To nie jest plik BMP");
    return;
  }

  // pobieramy pozycje gdzie zaczyna sie obraz
  const dataOffset = getDataOffset(contents);
  // pobieramy wysokosc i szerokosc obrazu
  const [width, height] = getWidthAndHeight(contents);
  // jezeli znamy juz wysokosc i szerokosc, to mozemy rozszerzyc plotno
  resizeCanvas(width, height);
  // sprawdzamy z iloma bitami na kolor mamy do czynienia
  const bpp = getBitsPerPixel(contents);
  if (bpp !== 24) {
    // dla ulatwienia, wspieramy tylko 24-bitowe pliki BMP
    // dzieki temu nie bedziemy musieli martwic sie odczytem palety
    // a w przypadku 16-bitowych nie trzeba sie martwic ktory wariant zapisu zostal uzyty
    alert("Wspieramy tylko 24-bitowe pliki BMP");
    return;
  }

  // sprawdzamy czy plik BMP jest skompresowany
  const isCompressed = isCompressedFile(contents);
  if (isCompressed) {
    // dla ulatwienia wspieramy tylko nieskompresowane pliki
    alert("Nie wspieramy skompresowanych plikow BMP");
    return;
  }

  // jezeli szerokosc nie jest podzielna przez 4 to uzupelniamy aby byla
  // wówczas "dodatkowe piksele" wynoszą 0 i je pomijamy
  const paddedWidth = width * 3 + (width % 4);

  // pomocniczo przechowajmy aktualna wysokosc
  // pamietajmy, ze BMP zapisuje obraz od dolu do gory
  let currentHeight = height;
  // przechodzimy po kolei wiersz po wierszu
  for (
    let i = dataOffset;
    i < contents.length;
    i += paddedWidth, currentHeight--
  ) {
    // rysujemy aktualny wiersz
    drawRow(contents, i, i + (paddedWidth - 3), width, currentHeight);
    // opoznienie dla zaprezentowania jak rysowany jest plik BMP
    await new Promise((res) => requestAnimationFrame(res));
  }
}
