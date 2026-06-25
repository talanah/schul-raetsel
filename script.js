/**
 * Überprüft die Antwort eines Standard-Rätsels
 * Fehlertolerant gegen Leerzeichen & Groß-/Kleinschreibung
 * @param {number} id - Die ID des Rätsels
 * @param {string|string[]} correctAnswer - Die korrekte Lösung
 */
function checkAnswer(id, correctAnswer) {
  const inputField = document.getElementById(`input-${id}`);
  const cardElement = document.getElementById(`card-${id}`);

  if (!inputField || !cardElement) return;

  const buttonElement = inputField.nextElementSibling;
  const tippElement = cardElement.querySelector(".tipp");

  // .trim() entfernt Leerzeichen am Anfang & Ende, .replace(/\s+/g, ' ') macht aus doppelten Leerzeichen ein einzelnes
  const userAnswer = inputField.value.trim().toLowerCase().replace(/\s+/g, " ");

  const answers = Array.isArray(correctAnswer)
    ? correctAnswer
    : [correctAnswer];

  const isCorrect =
    userAnswer !== "" &&
    answers.some(
      (ans) => ans.trim().toLowerCase().replace(/\s+/g, " ") === userAnswer,
    );

  if (isCorrect) {
    inputField.disabled = true;
    cardElement.classList.add("solved");

    if (buttonElement) {
      buttonElement.innerHTML = "✓";
      buttonElement.disabled = true;
    }

    if (tippElement) {
      tippElement.style.display = "none";
    }

    const solutionEl = document.getElementById(`solution-${id}`);
    if (solutionEl) {
      solutionEl.style.display = "block";
    }
  } else {
    inputField.classList.add("shake-input");

    if (tippElement) {
      tippElement.style.display = "block";
    }

    setTimeout(() => {
      inputField.classList.remove("shake-input");
    }, 400);
  }
}

/**
 * Türerrätsel: Akzeptiert mehrere sinngemäß korrekte Antworten und verzeiht kleine Abweichungen
 * @param {number} id - Die ID des Rätsels
 */
function checkAnswerDoor(id) {
  const inputField = document.getElementById(`input-${id}`);
  const cardElement = document.getElementById(`card-${id}`);
  const feedbackEl = document.getElementById("door-feedback");

  if (!inputField || !cardElement) return;

  const buttonElement = inputField.nextElementSibling;
  const tippElement = cardElement.querySelector(".tipp");

  // Bereinigt alle unsauberen Leerzeichen im Text
  const userAnswer = inputField.value.trim().toLowerCase().replace(/\s+/g, " ");

  // Breiter aufgestellte Schlüsselwörter fangen Tippfehler und alternative Formulierungen ab
  const correctKeywords = [
    "andere wächter",
    "andere tür",
    "andere wachter",
    "andere tur",
    "würde der andere",
    "wuerde der andere",
    "wurde der andere",
    "beide wächter",
    "beide wachter",
    "beide türen",
    "welche tür",
    "welche tur",
    "frage einen beliebigen",
    "frage ein wächter",
    "freiheit nennen",
    "freiheit zeigen",
    "sicher bezeichnen",
    "sichere tür",
    "der andere wächter sagen",
    "der andere wachter sagen",
  ];

  const isCorrect =
    userAnswer !== "" && correctKeywords.some((kw) => userAnswer.includes(kw));

  if (isCorrect) {
    inputField.disabled = true;
    cardElement.classList.add("solved");

    if (buttonElement) {
      buttonElement.innerHTML = "✓";
      buttonElement.disabled = true;
    }

    if (tippElement) tippElement.style.display = "none";
    if (feedbackEl) feedbackEl.style.display = "none";
  } else if (userAnswer !== "") {
    inputField.classList.add("shake-input");

    if (tippElement) tippElement.style.display = "block";

    if (feedbackEl) {
      feedbackEl.style.display = "block";
      feedbackEl.style.background = "rgba(239,68,68,0.08)";
      feedbackEl.style.border = "1px solid rgba(239,68,68,0.25)";
      feedbackEl.style.color = "#fca5a5";
      feedbackEl.innerHTML = `
                <strong>Nicht ganz!</strong> Die Lösung: Frage einen <em>beliebigen</em> Wächter: 
                <em>„Welche Tür würde der andere Wächter als sicher bezeichnen?"</em> — 
                und nimm dann die <strong>andere</strong> Tür. Das funktioniert bei beiden Wächtern!
            `;
    }

    setTimeout(() => {
      inputField.classList.remove("shake-input");
    }, 400);
  }
}

function checkNetworkPuzzle() {
  const cardElement = document.getElementById("card-network");
  const buttonElement = document.getElementById("button-network");
  const tippElement = cardElement ? cardElement.querySelector(".tipp") : null;

  if (!cardElement) return;

  const solutions = {
    "p1-r1-c1": "178",
    "p1-r3-c3": "39",
    "p1-r4-c2": "26",
    "p1-r4-c4": "20",
    "p1-r5-c2": "15",
    "p2-r1-c1": "94",
    "p2-r2-c1": "52",
    "p2-r3-c3": "15",
    "p2-r4-c2": "20",
    "p2-r4-c3": "7",
    "p2-r5-c4": "7",
    "p3-r1-c1": "31",
    "p3-r3-c2": "20",
    "p3-r4-c1": "7",
    "p3-r5-c4": "18",
    "p3-r6-c3": "0",
    "code-orange": "94",
    "code-purple": "178",
    "code-green": "31",
  };

  // Wir merken uns die originalen HTML-Farben der Code-Felder, falls sie noch nicht gespeichert wurden
  if (!window._originalFormColors) {
    window._originalFormColors = {
      "code-orange": "#ff9f43",
      "code-purple": "#a55eea",
      "code-green": "#26de81"
    };
  }

  let allCorrect = true;
  let anyFieldIncorrect = false;

  for (const [id, val] of Object.entries(solutions)) {
    const inputField = document.getElementById(id);
    if (inputField) {
      const userAnswer = inputField.value.replace(/\D/g, "");

      if (userAnswer === val) {
        inputField.classList.remove("shake-input");
        
        if (id.startsWith("code-")) {
          // Behält die originale HTML-Farbe bei Erfolg bei
          inputField.style.borderColor = window._originalFormColors[id];
          inputField.style.background = "rgba(16, 185, 129, 0.15)"; // Dezenter grüner Erfolgshintergrund
        } else {
          inputField.style.borderColor = "var(--success)";
        }
      } else {
        allCorrect = false;
        if (inputField.value.trim() !== "") {
          anyFieldIncorrect = true;
          inputField.classList.add("shake-input");
          inputField.style.borderColor = "var(--error)"; // Wird rot bei Fehlern
        }
      }
    }
  }

  if (allCorrect) {
    cardElement.classList.add("solved");
    if (buttonElement) {
      buttonElement.innerHTML = "✓";
      buttonElement.disabled = true;
    }
    if (tippElement) tippElement.style.display = "none";

    for (const id of Object.keys(solutions)) {
      const inputField = document.getElementById(id);
      if (inputField) inputField.disabled = true;
    }

    const solutionEl = document.getElementById("solution-network");
    if (solutionEl) {
      solutionEl.style.display = "block";
    }
  } else {
    if (anyFieldIncorrect && tippElement) tippElement.style.display = "block";
    setTimeout(() => {
      for (const id of Object.keys(solutions)) {
        const inputField = document.getElementById(id);
        if (inputField) {
          inputField.classList.remove("shake-input");
          
          // Wenn der Fehler vorbei ist und das Feld korrigiert/geleert wurde:
          if (id.startsWith("code-")) {
            const currentVal = inputField.value.replace(/\D/g, "");
            if (currentVal === "" || currentVal === solutions[id]) {
              // Setzt exakt die bunte Originalfarbe wieder ein!
              inputField.style.borderColor = window._originalFormColors[id];
              if (currentVal === "") inputField.style.background = "transparent";
            }
          } else {
            if (inputField.value.trim() === "") {
              inputField.style.borderColor = "";
            }
          }
        }
      }
    }, 400);
  }
}

/**
 * Überprüft das interaktive Trio der großen 5-stufigen Zahlenpyramiden (Komplett Leerzeichen-Resistent)
 */
function checkAllLargePyramids() {
  const cardElement = document.getElementById("card-pyramids-multi");
  const tippElement = cardElement ? cardElement.querySelector(".tipp") : null;
  const solutionEl = document.getElementById("solution-pyramids-multi");
  const buttonElement = cardElement
    ? cardElement.querySelector(".input-group-centered button")
    : null;

  const exactSolutions = {
    "p1-l5-1": "310",
    "p1-l4-2": "202",
    "p1-l3-1": "38",
    "p1-l2-3": "52",
    "p1-l1-2": "13",
    "p1-l1-5": "33",
    "p2-l5-1": "187",
    "p2-l3-2": "21",
    "p2-l2-1": "16",
    "p2-l2-4": "30",
    "p2-l1-2": "9",
    "p3-l5-1": "91",
    "p3-l4-1": "56",
    "p3-l4-2": "35",
    "p3-l2-1": "17",
    "p3-l2-3": "8",
    "p3-l2-4": "1",
  };

  let allCorrect = true;
  let anyFieldIncorrect = false;

  for (const [id, targetValue] of Object.entries(exactSolutions)) {
    const inputField = document.getElementById(id);
    if (!inputField) continue;

    // Entfernt radikal alle eingegebenen Leerzeichen oder versehentliche Tippfehler-Buchstaben
    const userAnswer = inputField.value.replace(/\D/g, "");

    if (userAnswer === targetValue) {
      inputField.style.borderColor = "var(--success)";
      inputField.classList.remove("shake-input");
    } else {
      allCorrect = false;
      if (inputField.value.trim() !== "") {
        anyFieldIncorrect = true;
        inputField.classList.add("shake-input");
        inputField.style.borderColor = "var(--error)";
      }
    }
  }

  if (allCorrect) {
    if (cardElement) cardElement.classList.add("solved");
    if (buttonElement) {
      buttonElement.innerHTML = "✓ Alle Pyramiden gelöst";
      buttonElement.disabled = true;
    }
    if (tippElement) tippElement.style.display = "none";
    if (solutionEl) solutionEl.style.display = "block";

    for (const id of Object.keys(exactSolutions)) {
      const inputField = document.getElementById(id);
      if (inputField) {
        inputField.disabled = true;
        inputField.style.borderColor = "var(--success)";
      }
    }
  } else {
    if (anyFieldIncorrect && tippElement) tippElement.style.display = "block";
    setTimeout(() => {
      for (const id of Object.keys(exactSolutions)) {
        const inputField = document.getElementById(id);
        if (inputField) {
          inputField.classList.remove("shake-input");
          if (inputField.value.trim() === "") inputField.style.borderColor = "";
        }
      }
    }, 400);
  }
}

// Globaler Key-Handler für verzögerungsfreie Enter- und Handy-Absende-Aktionen
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const activeElement = document.activeElement;

    if (activeElement && activeElement.tagName === "INPUT") {
      // 1. Großes Pyramiden-Trio (Aufgaben 1-3)
      if (
        activeElement.id.startsWith("p1-l") ||
        activeElement.id.startsWith("p2-l") ||
        activeElement.id.startsWith("p3-l")
      ) {
        event.preventDefault();
        checkAllLargePyramids();
      }
      // 2. Vernetztes Pyramiden-Netzwerk
      else if (
        activeElement.id.startsWith("p1-r") ||
        activeElement.id.startsWith("p2-r") ||
        activeElement.id.startsWith("p3-r") ||
        activeElement.id.startsWith("code-")
      ) {
        event.preventDefault();
        checkNetworkPuzzle();
      }
      // 3. Jedes andere Text-/Zahlenfeld
      else if (activeElement.id.startsWith("input-")) {
        event.preventDefault();
        const button = activeElement.nextElementSibling;
        if (button && button.tagName === "BUTTON" && !button.disabled) {
          button.click();
        }
      }
    }
  }
});
