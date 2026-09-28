# OpenCode + Zen

[Torna al gioco](../README.md)

**OpenCode** è un’app che può leggere e modificare la cartella del gioco. **Zen** è uno dei servizi che le forniscono i modelli IA. Non serve usare anche ChatGPT.

## Per partire: scegli Muse Spark 1.3 Free

1. Scarica l’app **Desktop** dal [sito ufficiale di OpenCode](https://opencode.ai/download) e aprila.
2. Apri la tua **copia della cartella del gioco**, quella con `index.html`. Non lo ZIP.
3. Apri il selettore del modello vicino alla casella dove scrivi. Cerca **Muse Spark 1.3 Contributor Free** sotto **OpenCode Zen** e selezionalo. È il nome completo della variante gratuita da usare qui.
4. Controlla il nome del modello prima di inviare il primo messaggio. Il file `opencode.json` del progetto lo indica già come predefinito; se l’app mantiene una tua scelta precedente, selezionalo a mano.

**Non scegliere semplicemente “Muse Spark 1.3” senza “Free”**: è un’altra voce. Se non trovi la variante gratuita, controlla di avere l’app aggiornata e consulta il [catalogo Zen](https://opencode.ai/docs/zen/). Se ti viene chiesto di acquistare credito, fermati: queste istruzioni non richiedono di passare a un modello a pagamento. Disponibilità e limiti dell’offerta possono cambiare.

La variante **Contributor** consente l’uso di prompt e risposte per addestrare futuri modelli Meta: usala con i file del gioco, senza dati personali o segreti. [Dettagli ufficiali](https://opencode.ai/docs/zen/#privacy).

Se l’app richiede una connessione a Zen, segui la procedura del provider. Un’eventuale **chiave API** va soltanto nel campo di connessione, mai nella chat o nei file del gioco.

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

Scrivi `opencode` e premi Invio. **Dentro OpenCode**, `/connect` collega Zen quando necessario e `/models` apre la scelta: cerca **Muse Spark 1.3 Contributor Free**; **Tab** passa fra Plan e Build. I pulsanti della versione Desktop possono avere nomi diversi.

Esiste anche `/undo`, ma il ripristino dei file richiede Git: una cartella estratta dallo ZIP non lo include. La copia manuale funziona comunque.

[Zen e costi](https://opencode.ai/docs/zen/) · [Plan e Build](https://opencode.ai/docs/agents/) · [Permessi](https://opencode.ai/docs/permissions/) · [Comandi del terminale](https://opencode.ai/docs/tui/)
