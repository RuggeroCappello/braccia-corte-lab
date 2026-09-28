# Mappa dei file e test — approfondimento facoltativo

[Torna alla pagina iniziale](../README.md)

| File | A che cosa serve |
| --- | --- |
| `index.html` | La pagina che apre il gioco e carica gli altri file |
| `style.css` | Le dimensioni della pagina e i pulsanti sotto il gioco |
| `level.js` | Mappa, oggetti, piattaforme e posizione dei personaggi |
| `game.js` | Le regole: movimenti, collisioni, vite, punti e boss |
| `render.js` | Disegna ciò che vedi, compresi titolo e testi sul Canvas |
| `main.js` | Legge tastiera, gestisce tempo, pausa e suoni |
| `test.mjs` | Prove automatiche delle regole |
| `AGENTS.md` | Indicazioni didattiche per gli assistenti IA |
| `opencode.json` | Permessi iniziali per OpenCode; nessuna chiave inclusa |

Il Canvas è la superficie su cui il codice disegna il gioco. La simulazione usa 60 piccoli aggiornamenti al secondo. Non ci sono librerie, immagini scaricate o un server necessari a giocare. `assets/anteprima.png` serve soltanto alla README.

## Leggere la mappa

In `level.js`, `MAPS` contiene righe di caratteri: una cella vale 40 pixel. `#` è terreno, `=` una piattaforma, `~` una spesa pericolosa, `o` una moneta, `T` tasse, `L` Libo, `G` barriera, `M` piattaforma mobile, `C` checkpoint, `B` il riferimento grafico/di mappa del boss. Le coordinate effettive del boss sono calcolate in `game.js`: non assumere che spostare una lettera sposti ogni cosa.

Cambia una cella alla volta senza cambiare la lunghezza della riga. Se vuoi aggiungere colonne o spostare l’arena, esistono anche coordinate esplicite da aggiornare: chiedi di individuare tutte le dipendenze, senza affidarti a un solo file.

## Eseguire le prove automatiche

Serve **Node.js**, un programma che esegue JavaScript fuori dal browser. Usa la versione predisposta dal docente, oppure il download LTS dal [sito ufficiale](https://nodejs.org/). Non serve installare pacchetti del progetto.

Apri un terminale nella cartella del gioco (vedi [la guida OpenCode](03-opencode-zen.md#solo-se-il-docente-ha-scelto-il-terminale)) e scrivi, una riga per volta:

```sh
node --version
node test.mjs
```

La prima riga mostra una versione; la seconda esegue i test. Nella distribuzione iniziale sono **23/23**. Il risultato dettagliato viene scritto in `qa/test-report.json`. Quella cartella viene creata automaticamente; non serve crearla tu.

Se un test fallisce, annota il nome e il messaggio: può avere scoperto un problema o un’aspettativa da discutere. Non cancellarlo e non modificare il risultato atteso soltanto per ottenere il verde. Dopo una correzione, una nuova prova dovrebbe fallire prima e riuscire dopo.

## Cosa sappiamo, e cosa no

Le prove iniziali coprono salto, varchi, checkpoint, raccolta, nemici, scatto, boss e una partita completa automatica. Un bot che reagisce immediatamente vince in 66,3 secondi: questo non misura il tempo di uno studente. Le prove non coprono tutte le combinazioni di input, ogni browser, la chiarezza dei testi o la corrispondenza perfetta fra grafica e collisioni.

Il codice viene distribuito invariato rispetto alla versione di partenza del laboratorio. Non sono stati introdotti bug artificiali e non sono state svolte le indagini degli studenti.
