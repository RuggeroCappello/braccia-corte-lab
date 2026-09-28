# Le avventure di Braccia Corte

Questo è il gioco nato dalle vostre idee durante il nostro incontro. Ve lo lascio qui: potete giocarci, smontarlo, cambiare quello che non vi piace e farne qualcosa di vostro.

È stato costruito con l’aiuto dell’IA, e qualche cosa da sistemare c’è. Se trovate un bug, può essere un buon punto da cui partire. Oppure aggiungete una piattaforma, cambiate una battuta, inventate un nemico. Scegliete voi.

![Le avventure di Braccia Corte](assets/anteprima.png)

## Voglio giocarci

1. **[Scarica lo ZIP](https://github.com/RuggeroCappello/braccia-corte-lab/archive/refs/heads/main.zip)**. Non serve un account GitHub.
2. Estrailo: su **Windows**, tasto destro → **Estrai tutto**; su **Mac**, doppio clic sullo ZIP.
3. Apri la cartella estratta e fai doppio clic su **`index.html`**. Se si apre come testo, usa **Apri con → il tuo browser**.

Tieni i file insieme nella cartella. Il gioco funziona anche offline.

| Tasto | Azione |
| --- | --- |
| ← → oppure A / D | Muoviti |
| Spazio | Salta: tenendolo premuto salti più in alto |
| Shift | Corri |
| E | Scatto Tirchio |
| Esc | Pausa |
| M / F | Audio / schermo intero |

Per esplorare più comodamente: **1/2/3** ti portano alle tre sezioni, **I** ti rende invincibile, **H** mostra i rettangoli usati per le collisioni. Compare la scritta DEBUG: sono strumenti per fare prove.

## Comincia da qualcosa che non funziona

Fai una **copia della cartella**: sarà la tua versione da sperimentare. Poi scegli una cosa strana che hai notato giocando. Cercare di capire e sistemare un problema si chiama **debug**.

1. **Rifallo succedere.** In quale sezione sei? Che tasti premi? Usa 1/2/3 per tornare subito lì e H per vedere le collisioni.
2. **Descrivilo.** “Quando faccio … mi aspetto …, invece succede …”. È il punto di partenza da dare all’IA.
3. **Chiedi un intervento piccolo.** Falle leggere i file e chiedile di spiegare la possibile causa, senza riscrivere tutto il gioco.
4. **Prova davvero.** Dopo la modifica salva, ricarica `index.html` e ripeti gli stessi passi. Funziona? Prova anche un’altra parte del gioco.

Se non cambia niente, racconta all’IA quello che hai visto. Se peggiora, torna alla copia buona. Non significa che non sei capace: è così che si capisce cosa sta succedendo.

**[Qui trovi un esempio e i passaggi di debug più nel dettaglio](guide/01-indagine.md)**, compreso cosa fare se il gioco diventa bianco.

## E poi fallo diventare tuo

Non fermarti ai bug. Quale versione di Braccia Corte vorresti giocare?

| Per partire | Per spingerti un po’ oltre |
| --- | --- |
| Cambia una battuta o i colori | Aggiungi un percorso alternativo sui tetti |
| Sposta qualche moneta | Crea un oggetto da raccogliere con un effetto nuovo |
| Rendi un salto più comodo | Inventa un nemico o un attacco del boss |
| Migliora un suggerimento poco chiaro | Aggiungi comandi touch per giocare sul telefono |

Scegli **una sola idea per cominciare**. Puoi scrivere all’IA:

```text
Vorrei aggiungere [la mia idea] a questo gioco.
Leggi i file e proponimi una prima versione semplice.
Poi aiutami a realizzarla, spiegandomi cosa cambia e come provarla.
Deve continuare a funzionare aprendo index.html, anche offline.
```

[Prima modifica, da zero](guide/00-primi-passi.md) · [Come è fatto il gioco](guide/TECNICA.md) · [Qualcosa si è bloccato?](guide/05-aiuto.md)

## Se ti va di condividere

Passa la tua versione a un amico o [proponi una modifica qui su GitHub](guide/04-condividi.md). Anche segnalare un bug è utile. Mi piacerebbe vedere cosa ne fate!

## Ora prova gli strumenti

Scarica **[OpenCode](https://opencode.ai/download)** e **[ChatGPT / Codex](https://learn.chatgpt.com/docs/app)** e apri la tua copia del gioco. Puoi provarne uno alla volta: entrambi possono aiutarti a lavorare sui file.

- **OpenCode:** usa **Muse Spark 1.3 Contributor Free**, la variante gratuita di Muse Spark 1.3. Il progetto è già impostato su questo modello; [qui trovi i passaggi per selezionarlo](guide/03-opencode-zen.md).
- **ChatGPT Codex:** accedi con il tuo account ChatGPT, apri la cartella e parti da una richiesta piccola. [Guida al primo tentativo](guide/06-codex.md). Disponibilità e limiti dipendono dal tuo account.

Vuoi prima parlarne in una normale chat? Puoi anche usare [ChatGPT dal browser](guide/02-chatgpt.md). Per questi strumenti serve Internet; il gioco resta offline.

Il primo messaggio può essere semplicemente: **“Questo è il mio gioco. Aiutami a capire e migliorare questa cosa…”**
