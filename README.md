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
7. probléma a css és kép fájlok betöltésénél (nem akarom mindet egyesével hozzáadni importként)
8. require.context() nem működik -> npm i --save reuire-context után sem működik
9. adatok mentése adatbázisba probléma -> registration.js fájlban egy Firebase User objektumot akartam a setDoc() függvénynek paraméterül adni, de oda csak egy egyszerű JavaScript objektumot fogad el
