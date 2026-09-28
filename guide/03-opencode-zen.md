# OpenCode + Zen

[Torna al gioco](../README.md)

**OpenCode** è un’app che può leggere e modificare la cartella del gioco. **Zen** è uno dei servizi che le forniscono i modelli IA. Non serve usare anche ChatGPT.

## Per partire

1. Scarica l’app **Desktop** dal [sito ufficiale di OpenCode](https://opencode.ai/download), scegliendo la versione per il tuo computer.
2. Apri nell’app la tua **copia della cartella del gioco**, quella con `index.html`. Non lo ZIP.
3. Collega un servizio IA. Se scegli **OpenCode Zen**, segui la connessione al provider nell’app e scegli un modello.

Zen può richiedere credito a pagamento: avere ChatGPT non significa avere credito Zen. Controlla i costi prima di attivarlo; non devi comprare nulla per giocare o usare l’altro percorso. Se sei minorenne, fatti aiutare da un adulto per account e acquisti.

La **chiave API** è una credenziale per il servizio: inseriscila soltanto nel campo di connessione, non nella chat, nei file o su GitHub.

## Cosa scrivergli

```text
Questo è il mio gioco. Leggi i file e aiutami a [la tua idea].
Sono alle prime armi: spiegami brevemente cosa tocchi e perché.
Facciamo una modifica piccola, poi la provo nel browser.
Mantieni il gioco offline, senza aggiungere librerie.
```

Puoi usare **Plan** per parlarne prima e **Build** per lavorare sui file. Quando OpenCode mostra le modifiche, guarda il confronto prima/dopo: si chiama *diff*. Se qualcosa non ti è chiaro, chiedi.

Il progetto include già `AGENTS.md` con qualche indicazione per l’assistente e `opencode.json` che chiede conferma prima di cambiare file o eseguire comandi. Approva ciò che corrisponde alla tua richiesta; non serve rigenerare queste impostazioni.

Poi apri o ricarica `index.html` nel browser e prova la tua versione. OpenCode può aiutarti anche a leggere un errore, ma il risultato conta più del suo “fatto!”. Tieni una copia buona per tornare indietro facilmente.

## Se usi la versione nel terminale

Puoi saltare questa parte usando l’app Desktop. Il terminale è una finestra dove scrivi comandi al computer.

Dopo aver installato la CLI seguendo le [istruzioni ufficiali](https://opencode.ai/docs/), apri un terminale nella cartella del gioco:

- **Windows:** in Esplora file, tasto destro sullo spazio vuoto → **Apri nel terminale**, se disponibile.
- **Mac:** apri Terminale, scrivi `cd ` con lo spazio, trascina la cartella nella finestra e premi Invio.

Scrivi `opencode` e premi Invio. **Dentro OpenCode**, `/connect` collega Zen e `/models` sceglie il modello; **Tab** passa fra Plan e Build. I pulsanti della versione Desktop possono avere nomi diversi.

Esiste anche `/undo`, ma il ripristino dei file richiede Git: una cartella estratta dallo ZIP non lo include. La copia manuale funziona comunque.

[Zen e costi](https://opencode.ai/docs/zen/) · [Plan e Build](https://opencode.ai/docs/agents/) · [Permessi](https://opencode.ai/docs/permissions/) · [Comandi del terminale](https://opencode.ai/docs/tui/)
