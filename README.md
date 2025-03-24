Recepteket kezelő alkalmazás
Recipe management website

A projekt célja egy olyan weboldal létrehozása, melyre mindenféle recept feltölthető, korlátozások nélkül.
...

Szempontok, amiért a Firebase-t választottam, mint adatbáziskezelőt:
 - saját maga kezeli a jelszavakat
 - 

Diagramok elkészítése, receptek, képek gyűjtése
1. Git fiók/repo létrehozása, projekt inicializálása
2. Fájlstruktúrát, alap CSS formázások, regisztrációs űrlap létrehozása
3. Firebase fiók létrehozása
4. firebase-config.js fájl konfigurálása 
5. probléma a weboldal betöltésénél, kell használni valamilyen build eszközt (webpack)
6. webpack.config.js fájl konfigurálása
7. probléma a css és kép fájlok betöltésénél -> muszáj beimportálni a js fájlba egyesével a képeket és css fájlokat, hogy létrehozza őket a dist mappába és betöltse a weboldal
8. böngésző ikon betöltés probléma -> megoldás: a webpack.config.js fájlban megadtam a HtmlWebpackPlugin-ban favicon-ként az ikonom elérési útvonalát 
9. adatok mentése adatbázisba probléma -> registration.js fájlban egy Firebase User objektumot akartam a setDoc() függvénynek paraméterül adni, de oda csak egy egyszerű JavaScript objektumot fogad el
10. két main.js fájl volt a dist mappában, ezért kaptam egy "404 not found" hibát, mert nem a jó main.js fájlt találta meg -> megoldás: az index.html fájlban beszúrtam script tag-ben a dist/main.js fájlt, de erre nincs szükség, mert automatikusan meghívja a program


Források:
 - nosalty.hu
 - cookpad.com/hu
 - streetkitchen.hu