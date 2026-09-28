# OpenCode + Zen: lavorare sulla tua cartella

[Torna alla pagina iniziale](../README.md)

**OpenCode** è l’app che può leggere e modificare i file. **Zen** fornisce modelli IA a OpenCode ed è facoltativo. Un account ChatGPT non equivale automaticamente a credito Zen. Il gioco rimane gratuito e offline; le richieste a un modello possono avere un costo.

## A. Preparazione insieme al docente — una sola volta

1. Scarica OpenCode dal [sito ufficiale](https://opencode.ai/download). La pagina offre l’app Desktop per Windows, Mac e Linux. Sul computer della scuola usa l’installazione predisposta dal docente; se non puoi installare, passa alla [guida ChatGPT](02-chatgpt.md).
2. Apri nell’app **la cartella estratta `braccia-corte-esperimenti`**, quella con `index.html`. Non aprire soltanto lo ZIP o tutto il disco. Cerca il comando per aprire un progetto/cartella; il nome può cambiare con la versione.
3. Il docente decide account, servizio e modello disponibili. Non acquistare crediti o abbonamenti per tentativi. Zen può richiedere dati di fatturazione e una **chiave API**, cioè una credenziale riservata che abilita l’uso del servizio.
4. Per Zen, segui la connessione al provider OpenCode Zen. Inserisci l’eventuale chiave **solo nel campo di connessione dell’app**, mai in chat, nel codice, nella scheda o su GitHub. Non scambiare chiavi fra compagni.

Le istruzioni ufficiali verificabili per l’interfaccia testuale sono: `/connect`, scelta **OpenCode Zen**, procedura su [opencode.ai/auth](https://opencode.ai/auth), poi `/models` per scegliere il modello concordato. Scrivi questi comandi **dentro OpenCode**, non nel terminale del sistema o in ChatGPT. L’app Desktop può presentare gli stessi passaggi come pulsanti/selettori. [Fonte: Zen](https://opencode.ai/docs/zen/).

Le pagine ufficiali di download e introduzione possono riferirsi a versioni differenti: qui non fissiamo un vecchio comando di installazione. Se l’interfaccia non corrisponde, mostra la schermata al docente e consulta [la documentazione della versione installata](https://opencode.ai/docs/).

## B. Inizia con un’analisi, non con “aggiusta tutto”

Il progetto contiene già `AGENTS.md`, istruzioni per l’assistente, e `opencode.json`, che richiede conferma per scrivere file ed eseguire comandi. Non serve generare un nuovo AGENTS.md con `/init`.

Seleziona **Plan** per discutere l’indagine. Nell’interfaccia testuale puoi passare fra Plan e Build con **Tab**: controlla il nome visualizzato. Plan aiuta a pianificare; Build è la modalità di lavoro sui file. I permessi restano importanti: non interpretarli come una garanzia assoluta. [Fonte: agenti OpenCode](https://opencode.ai/docs/agents/).

Primo messaggio:

```text
Leggi AGENTS.md. Sono un principiante e questo è un laboratorio scolastico.
Non modificare file adesso. Riassumi in 5 righe come è fatto il gioco.
Poi aiutami a riprodurre questo problema: [i miei passi e l’esito].
Fai una domanda per volta. Non risolvere altri problemi.
```

## C. Dal piano alla modifica

1. Chiedi quale file sarebbe modificato e perché.
2. Spiega con parole tue cosa ti aspetti dalla modifica.
3. Conserva la copia precedente. Passa a **Build** solo quando vuoi applicare la proposta.
4. Scrivi: “Applica solo questa modifica e mostrami cosa cambia”.
5. Leggi la richiesta di permesso: riguarda il file previsto? Se sì, approva quella singola azione. Se non capisci, rifiuta e chiedi spiegazione. Non attivare approvazioni automatiche generali.
6. Leggi il **diff**, cioè il confronto prima/dopo: spesso rosso = rimosso, verde = aggiunto. Chiedi il significato delle righe che non capisci.
7. Apri o ricarica `index.html` dalla stessa cartella e ripeti la tua prova.

La configurazione inclusa usa `ask` per modifiche/comandi e `deny` per accessi fuori progetto. Altre configurazioni o versioni dell’app possono influenzare i permessi: controlla sempre la richiesta effettiva. [Fonte: permessi](https://opencode.ai/docs/permissions/).

## D. Se qualcosa peggiora

Prima conserva una copia del tentativo fallito: serve a capire. Riprendi poi la cartella buona e fai un esperimento diverso. Non chiedere dieci correzioni in sequenza senza giocare fra una e l’altra.

Nell’interfaccia testuale esiste `/undo`, ma il ripristino dei file richiede un repository Git: **una cartella estratta da ZIP non lo è**. Per questo laboratorio la copia manuale rimane il metodo comune a tutti. [Fonte: TUI](https://opencode.ai/docs/tui/).

## Solo se il docente ha scelto il terminale

Non è richiesto per il percorso Desktop. Il docente prepara il comando `opencode` secondo le istruzioni della versione installata. Per avviarlo:

- **Windows:** apri la cartella del gioco in Esplora file; se disponibile, tasto destro sullo spazio vuoto → Apri nel terminale. Altrimenti chiedi al docente di aprire il terminale in quella cartella.
- **Mac:** apri Terminale, scrivi `cd ` con uno spazio, trascina la cartella del gioco nella finestra e premi Invio.
- Scrivi `opencode` e premi Invio. Se il comando non viene trovato, torna alla preparazione: non è un bug del gioco.

Il terminale è una finestra di comandi al computer; la conversazione con l’IA comincia dopo che OpenCode si è aperto. Non copiare i simboli di prompt del terminale o comandi casuali presi da altre risposte.
