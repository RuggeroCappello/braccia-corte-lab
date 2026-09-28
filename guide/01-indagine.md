# Trova e verifica un bug

[Torna alla pagina iniziale](../README.md)

## Prima osserva, poi interpreta

Un’osservazione è “dopo questi tasti, il personaggio ha perso una vita”. Un’ipotesi è “forse la zona di collisione è troppo grande”. La seconda frase non diventa vera perché la pronuncia un’IA.

1. Parti da una nuova partita e ripeti il problema.
2. Scrivi i tasti nell’ordine esatto e indica la sezione.
3. Conta quante volte succede su tre tentativi.
4. Confronta cosa vedi con quello che ti aspettavi.
5. Compila [la scheda](../SCHEDA-BUG.md). Uno screenshot aiuta, ma non sostituisce le istruzioni.

**Esempio inventato, non bug confermato del gioco:** “Premo pausa; mi aspetto che il tempo si fermi, ma continua a salire”. È molto più utile di “la pausa è rotta”.

## Piccole indagini, senza soluzioni

Scegline una, oppure usa il problema indicato dal docente. Sono domande da verificare: non promettono che troverai un errore.

| Indagine | Una prova da fare | Che cosa annotare |
| --- | --- | --- |
| Quello che vedo corrisponde alle collisioni? | Attiva H e confronta personaggi, oggetti e rettangoli durante il movimento. | Quale parte tocca? È decorativa oppure dovrebbe contare? |
| I comandi rispondono come mi aspetto? | Prova pressione breve, tasto tenuto, pausa e ritorno alla finestra. | Ordine dei tasti e comportamento dopo la pausa. |
| Il boss avvisa abbastanza chiaramente? | Vai alla sezione 3, osserva entrambi gli attacchi; usa I per studiarli. | Dove si vede il pericolo e dove arriva il colpo. |
| Il punteggio ha senso? | Prendi un oggetto, torna indietro, supera un nemico, perdi una vita. | Valori prima e dopo; spiegazione alternativa. |
| Il gioco è comprensibile a un compagno? | Fallo provare senza spiegare i comandi a voce. | Dove si blocca e quale testo potrebbe aiutarlo. |

Un problema di chiarezza può essere importante anche se il programma non “si rompe”. Distingui **bug**, **scelta di gioco** e **miglioramento desiderato**. Se non trovi un difetto, consegna una prova ben fatta con risultato “non riprodotto”. Non inventarlo.

## Chiedi un aiuto piccolo all’IA

```text
Sto indagando un solo comportamento di questo gioco.
Passi: [scrivi qui]. Atteso: [scrivi qui]. Osservato: [scrivi qui].
Non correggere ancora il codice. Fammi una domanda utile e proponi
una prova che distingua due possibili spiegazioni.
Spiega le parole tecniche. Se mancano dati, dillo.
```

Non incollare il testo con le parentesi ancora vuote: sostituiscile con i tuoi dati.

## Correggi, poi cerca di smentirti

Conserva una copia prima della modifica. Scegli una sola ipotesi, una sola modifica e un modo per tornare indietro. Dopo la modifica:

- rifai **esattamente** la prova che falliva;
- ripetila tre volte;
- prova anche una situazione vicina, ma diversa;
- prova un pezzo del gioco che funzionava già;
- se usi i test automatici, annota il risultato senza cancellare quelli scomodi.

Se non cambia nulla, l’ipotesi può essere sbagliata. Non accumulare altre cinque modifiche: riparti dalla copia precedente o chiedi aiuto su quella prova.

## La domanda finale sull’IA

“Che cosa so perché l’ho osservato, e che cosa credo soltanto perché l’IA l’ha detto?” Scrivi un esempio concreto nella scheda.
