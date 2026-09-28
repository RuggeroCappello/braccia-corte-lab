# ChatGPT: farti aiutare senza perdere il controllo

[Torna alla pagina iniziale](../README.md)

Apri [ChatGPT](https://chatgpt.com/) con l’account e le modalità concordate col docente. Non serve un abbonamento a pagamento per seguire questo percorso; alcune funzioni o quantità di utilizzo possono essere limitate. Se l’accesso non è disponibile, fai le stesse prove con un compagno o con il docente.

## 1. Parti dalla tua osservazione

Gioca e compila i primi campi di [SCHEDA-BUG.md](../SCHEDA-BUG.md). Poi apri una nuova conversazione e scrivi:

```text
Sono al primo/secondo anno di liceo e conosco poco il codice.
Sto lavorando a un gioco JavaScript offline. Voglio capire un bug,
non una soluzione completa da copiare.
Questi sono i miei passi: ...
Mi aspettavo: ...
Invece succede: ...
Aiutami con una domanda e un piccolo passo per volta.
Non dire di avere provato il gioco se non l’hai davvero eseguito.
```

## 2. Mostra il materiale giusto

Nella normale chat il file sul tuo computer non è visibile solo perché ne scrivi il nome. Allega il file, se la tua interfaccia lo consente, oppure aprilo nell’editor e incolla il pezzo rilevante come testo, indicando il nome. Se non sai quale file serva, mostra prima [la mappa dei file](TECNICA.md).

Per un difetto visivo allega, se possibile, uno screenshot del **gioco**, non di tutto il desktop. Tieni fuori nomi di compagni, messaggi privati, password e chiavi API. I dati inviati a un servizio IA non rimangono soltanto nella cartella locale.

## 3. Chiedi un’ipotesi e una verifica

```text
Separa fatti e ipotesi. Quali parti del codice sostengono la tua idea?
Indicami una prova semplice che possa smentirla.
Non inventare il contenuto di file che non ti ho mostrato.
```

Se ricevi troppo codice, scrivi: “Fermati. Spiegami soltanto la prima modifica, in cinque frasi”. Se la risposta è incomprensibile, chiedi un esempio concreto.

## 4. Fai una modifica controllabile

```text
Ora proponi solo la modifica minima per questa ipotesi.
Mostra il nome del file, il testo da cercare, prima e dopo.
Spiega che cosa cambia e una prova da rifare.
Non riscrivere tutto il progetto e non aggiungere librerie.
```

Conserva una copia, applica la modifica nel tuo editor, salva e ricarica il browser. **Il fatto che ChatGPT abbia scritto del codice non significa che il tuo file sia già cambiato.** Se non trovi il testo da sostituire, non indovinare: mostra il file aggiornato.

## 5. Porta il risultato alla conversazione

Scrivi ciò che è successo nella tua prova, anche se contraddice l’IA. Non basta rispondere “non va”. Al termine spiega la modifica a un compagno senza leggere la risposta di ChatGPT.

I prompt qui sopra sono proposte didattiche originali, non comandi speciali o garanzie di correttezza. Per il funzionamento generale: [guida ufficiale al prompting](https://learn.chatgpt.com/docs/prompting).
