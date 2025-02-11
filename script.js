// Lista dei partecipanti con punteggio iniziale
let partecipanti = [
    { nome: "Achille Lauro", punteggio: 1000 },
    { nome: "Gaia", punteggio: 1000 },
    { nome: "Coma_Cose", punteggio: 1000 },
    { nome: "Francesco Gabbani", punteggio: 1000 },
    { nome: "Willie Peyote", punteggio: 1000 },
    { nome: "Noemi", punteggio: 1000 },
    { nome: "Rkomi", punteggio: 1000 },
    { nome: "Modà", punteggio: 1000 },
    { nome: "Rose Villain", punteggio: 1000 },
    { nome: "Brunori Sas", punteggio: 1000 },
    { nome: "Irama", punteggio: 1000 },
    { nome: "Clara", punteggio: 1000 }
];

// Variabili per la sfida corrente
let sfidante1, sfidante2;

// Funzione per aggiornare la classifica
function aggiornaClassifica() {
    partecipanti.sort((a, b) => b.punteggio - a.punteggio);

    const tbody = document.querySelector("#classificaTable tbody");
    tbody.innerHTML = "";

    partecipanti.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${p.nome}</td><td>${Math.round(p.punteggio)}</td>`;
        tbody.appendChild(row);
    });
}

// Funzione per generare una nuova sfida
function generaSfida() {
    let indice1 = Math.floor(Math.random() * partecipanti.length);
    let indice2;

    do {
        indice2 = Math.floor(Math.random() * partecipanti.length);
    } while (indice1 === indice2);

    sfidante1 = partecipanti[indice1];
    sfidante2 = partecipanti[indice2];

    document.getElementById("partecipante1").textContent = sfidante1.nome;
    document.getElementById("partecipante2").textContent = sfidante2.nome;
}

// Funzione per calcolare il punteggio Elo
function calcolaPunteggioElo(vincitore, perdente) {
    const K = 32;
    const expectedScore = 1 / (1 + Math.pow(10, (perdente.punteggio - vincitore.punteggio) / 400));
    vincitore.punteggio += K * (1 - expectedScore);
    perdente.punteggio -= K * (1 - expectedScore);
}

// Gestione eventi per i pulsanti di vincita
document.getElementById("vincitore1").addEventListener("click", () => {
    calcolaPunteggioElo(sfidante1, sfidante2);
    aggiornaClassifica();
    generaSfida();
});

document.getElementById("vincitore2").addEventListener("click", () => {
    calcolaPunteggioElo(sfidante2, sfidante1);
    aggiornaClassifica();
    generaSfida();
});

// Inizializzazione
aggiornaClassifica();
generaSfida();
