# Debug: dal “non va” a una modifica che funziona

[Torna al gioco](../README.md)

Non serve capire tutto il codice. Parti da un comportamento preciso e usa l’IA per orientarti.

## 1. Trova una prova che puoi ripetere

Apri la tua copia del gioco. Scegli un problema e prova a rifarlo: stessa sezione, stessi tasti, stesso punto. **1/2/3** ti portano alle sezioni; **H** mostra le collisioni e **I** permette di esplorare senza morire. Quando descrivi la prova, indica se li hai usati.

Qualche posto dove curiosare:

- Il personaggio tocca qualcosa che sembra ancora lontano? Confronta il disegno con i rettangoli di H.
- Un comando si comporta in modo diverso se lo tieni premuto, lo rilasci o metti in pausa?
- Gli attacchi del boss si capiscono in tempo? Osservali con I, poi riprovali senza invincibilità.
- Monete e moltiplicatore cambiano come ti aspetti quando ripassi nello stesso punto?

Sono spunti, non errori già accertati. Anche rendere più chiaro qualcosa che funziona è un miglioramento.

## 2. Raccontalo in modo utile

“Il salto è rotto” lascia troppe possibilità. Meglio indicare **azione, aspettativa e risultato**.

Esempio inventato, non un bug confermato:

> Avvio una partita, tengo premuto D e premo Esc. Mi aspetto che tutto si fermi, ma il personaggio continua a muoversi. Succede anche riprovando.

Puoi aggiungere uno screenshot del gioco. Se ti aiuta, usa questi [appunti brevi](../APPUNTI-BUG.md).

## 3. Fai guardare all’IA i file giusti

In **OpenCode o Codex**, apri la cartella estratta del gioco. In una normale chat **ChatGPT**, allega i file o incolla il codice: il loro nome da solo non basta.

```text
Sto provando questo gioco e ho trovato un problema.
Passi: [cosa faccio, in ordine].
Mi aspetto: [risultato atteso].
Succede invece: [quello che vedo].
Leggi i file, cerca la possibile causa e spiegamela in modo semplice.
Proponi una modifica piccola e dimmi come controllare se funziona.
Mantieni il gioco offline e non cambiare cose che non c’entrano.
```

Se l’IA va troppo veloce, chiedile: “Quale parte del codice ti fa pensare che sia quello il problema?”. Può avere un’ipotesi sbagliata: non devi darle ragione per forza.

## 4. Cambia, ricarica, riprova

Conserva una copia buona. Fatti mostrare quali righe cambiano: il confronto prima/dopo si chiama **diff**. Applica la modifica, oppure lascia che l’agente la applichi nella tua cartella.

Poi **salva e ricarica il browser**. Ripeti la prova del punto 1. Se riesce, prova anche una situazione vicina: un altro nemico, un salto diverso, una nuova partita. Una correzione può sistemare una cosa e romperne un’altra.

Se non funziona, un buon messaggio è:

```text
Ho provato la modifica. Ho fatto [passi] e succede ancora [risultato].
Rivediamo l’ipotesi: quale altra prova possiamo fare?
Evita di aggiungere altre modifiche tutte insieme.
```

## Se il gioco diventa bianco

Potrebbe esserci un errore JavaScript. Su Chrome, Edge o Firefox apri la **console**, la finestra dove il browser mostra gli errori:

- Windows: **Ctrl + Shift + J** su Chrome/Edge; **Ctrl + Shift + K** su Firefox.
- Mac: **Cmd + Option + J** su Chrome/Edge; **Cmd + Option + K** su Firefox.

Ricarica il gioco e cerca il primo messaggio rosso. Copia il testo, il nome del file e il numero di riga nella chat dell’IA, insieme alla modifica appena fatta. Non incollare comandi suggeriti nella console: qui ti serve solo leggere l’errore. Se non trovi la finestra, puoi comunque confrontare il tentativo con la copia buona.

## E i test automatici?

Se hai Node.js puoi chiedere a OpenCode o Codex di eseguire `node test.mjs`. Se manca, continua con le prove nel browser; [qui trovi il percorso facoltativo per i test](TECNICA.md).

I test possono passare tutti e non vedere il tuo bug. Quando hai capito il problema, puoi chiedere all’IA di aggiungere una prova che lo riproduca: dovrebbe fallire prima della correzione e riuscire dopo. Non basta cancellare il test che fallisce.

Quando il risultato ti convince, tieni questa versione come nuova copia buona. E magari scegli il prossimo miglioramento!
