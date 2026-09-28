# Braccia Corte: un videogioco, un laboratorio sull’IA

**Non serve saper programmare per cominciare.** Ti servono un computer con tastiera, un browser (Chrome, Edge, Firefox o Safari) e un po’ di curiosità.

Questo gioco è nato dalle idee di una classe ed è stato costruito con l’aiuto dell’intelligenza artificiale. Ora tocca a voi: giocatelo, cercate ciò che non funziona e provate a migliorarlo. L’obiettivo è **capire e verificare**, non ottenere più codice possibile.

![La schermata iniziale del gioco](assets/anteprima.png)

## 1. Scarica e gioca — circa 5 minuti

1. **[Scarica il gioco in formato ZIP](https://github.com/RuggeroCappello/braccia-corte-lab/archive/refs/heads/main.zip)**. Uno ZIP è una cartella compressa, come una valigia chiusa. Non serve un account GitHub.
2. Apri la cartella **Download** del computer e cerca `braccia-corte-lab-main.zip`.
3. **Windows:** tasto destro sullo ZIP → **Estrai tutto** → **Estrai**. **Mac:** doppio clic sullo ZIP.
4. Apri la cartella estratta, poi entra fino a vedere `index.html`, `game.js` e gli altri file insieme. **Non giocare direttamente dentro lo ZIP.**
5. Fai doppio clic su **`index.html`**. Se si apre come testo: tasto destro → **Apri con** → il tuo browser.
6. Premi **Invio** per partire. Tieni tutti i file nella stessa cartella: sono i pezzi dello stesso gioco.

**Risultato atteso:** vedi “Le avventure di Braccia Corte” e puoi muovere il personaggio. Il gioco funziona anche senza Internet. Internet serve invece per parlare con le IA.

| Tasto | Cosa fa |
| --- | --- |
| Frecce ← → oppure A / D | Muove il personaggio |
| Spazio, W oppure ↑ | Salta; tieni premuto per saltare più in alto |
| Shift | Corre |
| E | Scatto Tirchio: supera gli abbonamenti, ferma Libo, respinge i cocchi |
| Esc | Mette in pausa o riprende |
| M / F | Audio / schermo intero |
| H / I | Mostra le zone di collisione / invincibilità per fare prove |
| 1 / 2 / 3 | Va alle tre sezioni per riprovare un punto senza rifare tutto |

Con H, I o 1/2/3 compare **DEBUG**: significa “strumenti per fare prove”.

## 2. Fatti una copia — 1 minuto

Chiudi il gioco. Duplica **l’intera cartella estratta** e chiama la copia `braccia-corte-esperimenti`. Conserva l’originale. Da ora apri il gioco e modifica i file **solo nella copia esperimenti**.

## 3. La tua prima missione — circa 15 minuti

1. Gioca per qualche minuto **prima di chiedere aiuto all’IA**.
2. Scegli una sola cosa strana. Riesci a farla succedere di nuovo?
3. Compila [SCHEDA-BUG.md](SCHEDA-BUG.md): cosa hai premuto, cosa ti aspettavi, cosa è successo.
4. Segui [Trova e verifica un bug](guide/01-indagine.md). Poi scegli una delle due strade sotto.

**Non sai da dove iniziare?** Nella guida trovi piccole indagini, senza soluzioni. Puoi anche documentare un problema senza riuscire a correggerlo: è già un lavoro utile.

## 4. Scegli come farti aiutare

| La tua situazione | Inizia qui |
| --- | --- |
| Non hai mai aperto un file di codice | [ChatGPT, un passo alla volta](guide/02-chatgpt.md) |
| Hai OpenCode sul computer o il docente ti aiuta a installarlo | [OpenCode + Zen](guide/03-opencode-zen.md) |
| Non sai cosa sono file, editor o terminale | [Le parole e gli strumenti di base](guide/00-primi-passi.md) |
| Il gioco non si apre o una modifica non si vede | [Se qualcosa si blocca](guide/05-aiuto.md) |

ChatGPT può aiutarti a ragionare sul materiale che gli mostri. OpenCode può leggere e modificare i file del progetto che apri. **Zen è un servizio di modelli per OpenCode, non un altro editor.** Non occorre usarli entrambi. Usa gli account e gli strumenti concordati con il docente; se non ne hai accesso, lavora in coppia o continua l’indagine senza IA.

## 5. Quando puoi dire “ho finito”?

- [ ] Un’altra persona riesce a riprodurre il problema dalle mie istruzioni.
- [ ] So dire con parole mie cosa penso lo causasse.
- [ ] Ho conservato la versione precedente.
- [ ] Ho cambiato una cosa per volta e rifatto la stessa prova.
- [ ] Ho controllato anche un’altra parte del gioco.
- [ ] Ho scritto come mi ha aiutato l’IA e dove l’ho dovuta correggere.

Poi segui [Come consegnare](guide/04-consegna.md). **Non devi pubblicare nulla per forza:** puoi consegnare la cartella al docente. GitHub è un percorso facoltativo.

## Una cosa importante sui test

Il progetto contiene 23 controlli automatici iniziali. “Tutti verdi” significa soltanto che **quelle prove** sono riuscite. Un difetto visivo, un comando poco chiaro o una situazione non prevista possono esserci lo stesso. Le affermazioni dell’IA vanno messe alla prova proprio come il gioco.

I bug osservati in classe restano da indagare: questa distribuzione conserva il codice del gioco e non aggiunge guasti artificiali né correzioni agli esercizi.

## Per il docente e per chi vuole approfondire

[Guida docente](guide/DOCENTE.md) · [Mappa dei file e test](guide/TECNICA.md) · [Fonti e versioni degli strumenti](guide/FONTI.md)

I personaggi e le situazioni sono caricature di fantasia. Il laboratorio usa solo grafica disegnata dal codice e suoni sintetici. Per questa attività puoi scaricare il progetto e modificare la tua copia.
