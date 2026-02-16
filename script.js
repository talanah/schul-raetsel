const raetselListe = [
  {
    q: "Was hat Städte, aber keine Häuser?",
    a: "landkarte",
    h: "💡 Papier oder Google Maps.",
  },
  {
    q: "Was gehört dir, wird aber von anderen öfter benutzt?",
    a: "name",
    h: "💡 Man ruft dich damit.",
  },
  {
    q: "Je mehr man davon wegnimmt, desto größer wird es.",
    a: "loch",
    h: "💡 Denk an den Boden.",
  },
  {
    q: "Was hat einen Hals, aber keinen Kopf?",
    a: "flasche",
    h: "💡 Man trinkt daraus.",
  },
  {
    q: "Was steht im Dezember am Ende?",
    a: "r",
    h: "💡 Buchstabe am Wortende.",
  },
  {
    q: "Was ist am Anfang groß und am Ende klein?",
    a: "kerze",
    h: "💡 Schmilzt beim Brennen.",
  },
  {
    q: "Welches Wort steht immer 'falsch' im Wörterbuch?",
    a: "falsch",
    h: "💡 Es ist genau das Wort.",
  },
  {
    q: "Was läuft, hat aber keine Beine?",
    a: "nase",
    h: "💡 Passiert bei Schnupfen.",
  },
  {
    q: "Was hat Zähne, kann aber nicht beißen?",
    a: "kamm",
    h: "💡 Für die Haare.",
  },
  {
    q: "Was hört man, sieht man aber nie?",
    a: "echo",
    h: "💡 Ruft im Gebirge zurück.",
  },
  {
    q: "Was hat 88 Tasten, öffnet aber kein Schloss?",
    a: "klavier",
    h: "💡 Musikinstrument.",
  },
  {
    q: "Was wird nass, während es trocknet?",
    a: "handtuch",
    h: "💡 Nach dem Duschen.",
  },
  {
    q: "Was muss man brechen, um es zu essen?",
    a: "ei",
    h: "💡 Kommt aus dem Huhn.",
  },
  {
    q: "Was hat ein Auge, kann aber nichts sehen?",
    a: "nadel",
    h: "💡 Zum Nähen.",
  },
  {
    q: "Welcher Monat hat 28 Tage?",
    a: "alle",
    h: "💡 Jeder Monat hat mindestens so viele.",
  },
  {
    q: "Was geht hoch, aber nie wieder runter?",
    a: "alter",
    h: "💡 Geburtstag!",
  },
  {
    q: "Was hat einen Daumen, aber kein Fleisch?",
    a: "handschuh",
    h: "💡 Kleidung.",
  },
  {
    q: "Was füllt den Raum, braucht aber keinen Platz?",
    a: "licht",
    h: "💡 Lampe an!",
  },
  {
    q: "Was hat ein Bett, schläft aber nie?",
    a: "fluss",
    h: "💡 Er fließt ins Meer.",
  },
  { q: "Was man teilt, hat man nicht mehr?", a: "geheimnis", h: "💡 Pssst!" },
  {
    q: "Was hat ein Gesicht, aber keine Augen?",
    a: "uhr",
    h: "💡 Zeigt die Zeit.",
  },
  {
    q: "Welcher Baum hat keine Blätter?",
    a: "purzelbaum",
    h: "💡 Eine sportliche Übung.",
  },
  {
    q: "Was hat Füße, kann aber nicht gehen?",
    a: "tisch",
    h: "💡 Möbelstück.",
  },
  {
    q: "Welcher Tag ist der längste der Woche?",
    a: "donnerstag",
    h: "💡 Zähl mal die Buchstaben.",
  },
  {
    q: "Was wird beim Waschen schmutzig?",
    a: "wasser",
    h: "💡 Es nimmt den Dreck auf.",
  },
  { q: "Was fliegt ohne Flügel?", a: "zeit", h: "💡 'Die ... verrennt'." },
  {
    q: "Was hat einen Kopf, aber kein Gehirn?",
    a: "salat",
    h: "💡 Grünes Gemüse.",
  },
  {
    q: "Was sinkt, ohne nass zu werden?",
    a: "temperatur",
    h: "💡 Wenn es kalt wird.",
  },
  {
    q: "Was hat einen Rücken, aber keinen Bauch?",
    a: "buch",
    h: "💡 Du liest darin.",
  },
  {
    q: "Was wird kürzer, je länger man daran zieht?",
    a: "zigarette",
    h: "💡 Nicht sehr gesund.",
  },
];

const container = document.getElementById("puzzle-container");
let solvedCount = 0;

// Automatisches Erstellen der 30 Karten
raetselListe.forEach((data, index) => {
  const id = index + 1;
  const card = document.createElement("div");
  card.className = "raetsel-card";
  card.id = `card${id}`;
  card.innerHTML = `
        <label>${id}. ${data.q}</label>
        <div class="input-row">
            <input type="text" id="answer${id}" placeholder="..." autocomplete="off"
                   onkeydown="if(event.key==='Enter') check(${id})">
            <button id="btn${id}" onclick="check(${id})">OK</button>
        </div>
        <div id="hint${id}" class="hint-box"></div>
    `;
  container.appendChild(card);
});
function check(id) {
  const input = document.getElementById(`answer${id}`);
  const hint = document.getElementById(`hint${id}`);
  const card = document.getElementById(`card${id}`);
  const btn = document.getElementById(`btn${id}`);

  // Die ultimative Reinigungs-Funktion
  const clean = (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/\s+/g, "") // Entfernt alle Leerzeichen
      .replace(/[.,!?;:]/g, ""); // Entfernt Satzzeichen
  };

  const val = clean(input.value);
  const correct = clean(raetselListe[id - 1].a);

  if (val === correct && val !== "") {
    input.disabled = true;
    card.classList.add("solved");
    hint.style.display = "none";
    btn.innerHTML = "✓";
    btn.style.background = "var(--success)";
    solvedCount++;
    updateUI();

    // Auto-Fokus auf das nächste Feld
    const next = document.getElementById(`answer${id + 1}`);
    if (next) {
      setTimeout(() => {
        next.focus();
        document.getElementById(`card${id + 1}`).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  } else {
    input.classList.add("shake");
    hint.innerText = raetselListe[id - 1].h;
    hint.style.display = "block";
    setTimeout(() => input.classList.remove("shake"), 400);
  }
}

function updateUI() {
  const percent = (solvedCount / raetselListe.length) * 100;
  document.getElementById("progress").style.width = percent + "%";
  document.getElementById("solved-text").innerText = solvedCount;

  if (solvedCount === raetselListe.length) {
    document.getElementById("finish-area").style.display = "block";
    document
      .getElementById("finish-area")
      .scrollIntoView({ behavior: "smooth" });
  }
}

window.onscroll = function() {
  const header = document.querySelector('.glass-header');
  
  // Wenn mehr als 10px gescrollt wurde, Klasse hinzufügen
  if (window.pageYOffset > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};