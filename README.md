# js-bmp-parser

BMP Parser made for purposes of blog article at https://swistak.codes. You can check how it's working on the CodeSandbox: https://codesandbox.io/s/github/tswistak/js-bmp-parser  
Comments are in Polish, since article's also in Polish.

Parser plików BMP stworzony na potrzeby artykułu na https://swistak.codes. Mozesz sprawdzić działanie na CodeSandbox: https://codesandbox.io/s/github/tswistak/js-bmp-parser  
Kod zawiera komentarze w języku polskim, ze względu na fakt, ze artykuł jest równiez po polsku.

## Running guide / instrukcja uruchomienia

```bash
npm install
npm start
```

## Limitations / Ograniczenia

Limitations are made due to keep parser simple (for learning purposes):

- only standard Windows BMP images (only BITMAPINFOHEADER is supported)
- only non-compressed BMP images
- only 24BPP format

Wprowadzone są ograniczenia, aby parser był prostszy (dla prostszej nauki):

- tylko standardowe Windowsowe obrazy BMP (wspierany jest tylko BITMAPINFOHEADER)
- tylko nieskompresowane BMP
- tylko w formacie 24BPP
