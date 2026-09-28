# Hai trovato un bug?

[Torna al gioco](../README.md)

La cosa più utile è riuscire a farlo succedere di nuovo. Ricorda dove eri, quali tasti hai premuto e cosa ti aspettavi. Poi prova a raccontarlo così:

> Nella sezione …, quando faccio …, mi aspetto …, invece succede …

Puoi dirlo a un amico o incollarlo in ChatGPT/OpenCode. Se ti servono, qui ci sono [quattro righe per prendere appunti](../APPUNTI-BUG.md): sono facoltative.

## Dove curiosare

- Premi **H**: i rettangoli delle collisioni corrispondono a quello che vedi?
- Prova a tenere premuto un tasto, rilasciarlo o mettere in pausa durante un movimento.
- Vai al boss con **3** e usa **I** per osservare gli attacchi con calma.
- Guarda come cambiano monete, punti e moltiplicatore quando torni indietro o perdi una vita.

Sono spunti, non una lista di errori già accertati. Potresti anche trovare qualcosa che funziona ma che vorresti diverso: puoi cambiarlo lo stesso.

## Un messaggio utile per l’IA

```text
Nel gioco succede questo: [descrivi cosa fai e cosa vedi].
Mi aspettavo invece: [descrivi il risultato].
Aiutami a capire perché. Guarda il codice e proponimi una piccola
modifica, spiegando cosa cambia e come posso provarla.
```

Fai una copia prima di cambiare qualcosa. Dopo la modifica, rifai la stessa prova e gioca ancora un po’. Se non migliora, racconta all’IA il risultato: non occorre accettare la sua prima spiegazione.

Il progetto ha anche test automatici. Possono passare tutti e lasciare sfuggire un bug: controllano soltanto le situazioni per cui sono stati scritti.
