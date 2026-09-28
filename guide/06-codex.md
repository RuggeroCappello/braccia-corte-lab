# Prova ChatGPT Codex sul gioco

[Torna al gioco](../README.md)

Se ti è piaciuto chiedere idee a ChatGPT, prova **Codex**: può lavorare direttamente sui file della tua copia del gioco, come OpenCode.

## Apri il progetto

1. Vai alla [pagina ufficiale dell’app ChatGPT / Codex](https://learn.chatgpt.com/docs/app) e segui il download per il tuo computer.
2. Apri l’app e accedi con il tuo account ChatGPT. Funzioni e limiti disponibili dipendono dall’account: non dare per scontato che tutto sia illimitato o gratuito.
3. Seleziona **Codex** e apri la cartella del gioco sul computer, quella che hai estratto e duplicato. Lavora sulla copia locale: non serve collegare GitHub per questo primo tentativo.
4. Avvia una nuova chat nel progetto e descrivi un solo bug o miglioramento.

I nomi dei pulsanti possono cambiare con la versione; la [guida ufficiale](https://learn.chatgpt.com/docs/app) mostra il percorso aggiornato.

## Un primo messaggio

```text
Questa cartella contiene un gioco nato con le idee dei miei amici.
Vorrei [correggere questo comportamento / aggiungere questa idea].
Leggi i file e aiutami a fare una modifica piccola.
Spiegami cosa cambi e come provarlo, senza riscrivere tutto.
Deve funzionare ancora con doppio clic su index.html, anche offline.
```

Codex può leggere i file del progetto aperto e proporre modifiche. Guarda il confronto prima/dopo, chiedi spiegazioni se serve e poi apri `index.html` nel browser. **La prova decisiva è giocare con la modifica.**

Se hai Node.js, puoi anche chiedergli di eseguire `node test.mjs` e riportare il risultato. Se non può fare una prova, chiedigli di dirlo chiaramente.

Per cominciare non servono più agenti, servizi aggiuntivi o una pubblicazione online: basta la tua cartella e un’idea. Muse Spark 1.3 Free è la scelta per **OpenCode**; in Codex usi invece i modelli disponibili nel tuo account ChatGPT.
