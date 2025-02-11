// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDx_MOiGnGhCo717hFptzrV2EMN0SYGIbY",
  authDomain: "sanremo25.firebaseapp.com",
  projectId: "sanremo25",
  storageBucket: "sanremo25.firebasestorage.app",
  messagingSenderId: "24245687332",
  appId: "1:24245687332:web:5a2bf509913e0b862a34b1",
  measurementId: "G-9N4657P07D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Lista dei partecipanti con punteggio iniziale
let partecipanti = [];

// 🔄 Funzione per caricare la classifica da Firebase
function caricaClassifica() {
    db.collection("classifica").orderBy("punteggio", "desc").get().then((snapshot) => {
        partecipanti = [];
        snapshot.forEach(doc => {
            partecipanti.push({ id: doc.id, ...doc.data() });
        });
        aggiornaClassifica();
    });
}

// 🔄 Funzione per aggiornare la classifica e salvarla nel database
function aggiornaClassifica() {
    const tbody = document.querySelector("#classificaTable tbody");
    tbody.innerHTML = "";

    partecipanti.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${p.nome}</td><td>${Math.round(p.punteggio)}</td>`;
        tbody.appendChild(row);
    });
}

// 🔄 Funzione per aggiornare il punteggio Elo e salvare nel database
function calcolaPunteggioElo(vincitore, perdente) {
    const K = 32;
    const expectedScore = 1 / (1 + Math.pow(10, (perdente.punteggio - vincitore.punteggio) / 400));
    const nuovoPunteggioVincitore = vincitore.punteggio + K * (1 - expectedScore);
    const nuovoPunteggioPerdente = perdente.punteggio - K * (1 - expectedScore);

    // Aggiorna Firestore
    db.collection("classifica").doc(vincitore.id).update({ punteggio: nuovoPunteggioVincitore });
    db.collection("classifica").doc(perdente.id).update({ punteggio: nuovoPunteggioPerdente });

    // Ricarica la classifica aggiornata
    setTimeout(caricaClassifica, 1000);
}

// 🔄 Genera una nuova sfida
function generaSfida() {
    if (partecipanti.length < 2) {
        alert("Errore: non ci sono abbastanza partecipanti per generare una sfida.");
        return;
    }

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

// 🔄 Gestione click dei vincitori
document.getElementById("vincitore1").addEventListener("click", () => {
    calcolaPunteggioElo(sfidante1, sfidante2);
    generaSfida();
});

document.getElementById("vincitore2").addEventListener("click", () => {
    calcolaPunteggioElo(sfidante2, sfidante1);
    generaSfida();
});

// 🔄 Inizializza il sito
caricaClassifica();
generaSfida();
