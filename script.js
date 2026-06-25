/**
 * IQ-Insel Rätsel-Challenge — script.js (optimiert)
 *
 * Bugfixes:
 *  - Rätsel 10 (Netzwerk-Pyramide): Die farbigen Code-Felder behalten ihre
 *    Farbe beim Prüfen. Der setTimeout-Cleanup überschreibt keine bereits
 *    korrekt markierten Felder mehr.
 *  - Alle Felder-States werden zuverlässig per data-Attribut verwaltet,
 *    nicht mehr über fragile window._originalFormColors-Hacks.
 */

/* ── Hilfsfunktion: Leerzeichen normalisieren ─────────────────────────── */
function normalize(str) {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

/* ── Standard-Rätsel prüfen ──────────────────────────────────────────── */
/**
 * @param {number}          id            Rätsel-ID
 * @param {string|string[]} correctAnswer Korrekte Lösung(en)
 */
function checkAnswer(id, correctAnswer) {
  const inputField = document.getElementById(`input-${id}`);
  const cardElement = document.getElementById(`card-${id}`);
  if (!inputField || !cardElement) return;

  const buttonElement = inputField.nextElementSibling;
  const tippElement = cardElement.querySelector(".tipp");
  const userAnswer = normalize(inputField.value);

  const answers = Array.isArray(correctAnswer)
    ? correctAnswer
    : [correctAnswer];
  const isCorrect =
    userAnswer !== "" && answers.some((ans) => normalize(ans) === userAnswer);

  if (isCorrect) {
    inputField.disabled = true;
    cardElement.classList.add("solved");

    if (buttonElement) {
      buttonElement.innerHTML = "✓";
      buttonElement.disabled = true;
    }
    if (tippElement) tippElement.style.display = "none";

    const solutionEl = document.getElementById(`solution-${id}`);
    if (solutionEl) solutionEl.style.display = "block";
  } else {
    triggerShake(inputField);
    if (tippElement) tippElement.style.display = "block";
  }
}

/* ── Türerrätsel (Rätsel 8) ──────────────────────────────────────────── */
function checkAnswerDoor(id) {
  const inputField = document.getElementById(`input-${id}`);
  const cardElement = document.getElementById(`card-${id}`);
  const feedbackEl = document.getElementById("door-feedback");
  if (!inputField || !cardElement) return;

  const buttonElement = inputField.nextElementSibling;
  const tippElement = cardElement.querySelector(".tipp");
  const userAnswer = normalize(inputField.value);

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
    triggerShake(inputField);
    if (tippElement) tippElement.style.display = "block";

    if (feedbackEl) {
      feedbackEl.style.cssText = `
        display:block; margin-top:16px; padding:14px 18px; border-radius:8px;
        font-size:0.95rem; background:rgba(239,68,68,0.08);
        border:1px solid rgba(239,68,68,0.25); color:#fca5a5;
      `;
      feedbackEl.innerHTML = `
        <strong>Nicht ganz!</strong> Die Lösung: Frage einen <em>beliebigen</em> Wächter:
        <em>„Welche Tür würde der andere Wächter als sicher bezeichnen?"</em> —
        und nimm dann die <strong>andere</strong> Tür. Das funktioniert bei beiden Wächtern!
      `;
    }
  }
}

/* ── Netzwerk-Pyramide (Rätsel 10) ───────────────────────────────────── */
/**
 * Farbige Code-Felder (code-orange, code-purple, code-green) und normale
 * Pyramidenfelder werden getrennt behandelt, damit die Originalfarben
 * der Code-Felder niemals überschrieben werden.
 *
 * Korrekte Felder behalten ihren grünen Rahmen (success) auch nach dem
 * Ablauf der Shake-Animation. Falsche Felder werden nach der Animation
 * wieder auf ihren Ausgangszustand zurückgesetzt.
 */
function checkNetworkPuzzle() {
  const cardElement = document.getElementById("card-network");
  const buttonElement = document.getElementById("button-network");
  const tippElement = cardElement ? cardElement.querySelector(".tipp") : null;
  if (!cardElement) return;

  /* Lösungsschlüssel -------------------------------------------------- */
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
    /* Finale Code-Felder */
    "code-orange": "94",
    "code-purple": "178",
    "code-green": "31",
  };

  /* Originale Rahmenfarben der Code-Felder (aus HTML-Inline-Styles) ---- */
  const codeColors = {
    "code-orange": "#ff9f43",
    "code-purple": "#a55eea",
    "code-green": "#26de81",
  };

  let allCorrect = true;
  let anyWrongFilled = false;
  const wrongFields = []; // Felder, die nach dem Shake zurückgesetzt werden

  for (const [id, expected] of Object.entries(solutions)) {
    const field = document.getElementById(id);
    if (!field) continue;

    const userVal = field.value.replace(/\D/g, "");
    const isCodeField = id.startsWith("code-");

    if (userVal === expected) {
      /* ✓ Korrekt: grünen Rahmen setzen (und bei Code-Felder Textfarbe beibehalten) */
      field.classList.remove("shake-input");

      if (isCodeField) {
        field.style.borderColor = "var(--success)";
        field.style.background = "rgba(16, 185, 129, 0.12)";
        /* Textfarbe bleibt die originale Code-Farbe */
        field.style.color = codeColors[id];
      } else {
        field.style.borderColor = "var(--success)";
      }
    } else {
      /* ✗ Falsch oder leer */
      allCorrect = false;

      if (field.value.trim() !== "") {
        anyWrongFilled = true;
        field.classList.add("shake-input");
        field.style.borderColor = "var(--error)";
        wrongFields.push({ field, id, isCodeField });
      }
    }
  }

  /* Shake-Klassen nach 400 ms entfernen; nur falsche/leere Felder zurücksetzen */
  if (wrongFields.length > 0) {
    setTimeout(() => {
      for (const { field, id, isCodeField } of wrongFields) {
        field.classList.remove("shake-input");

        /* Nur zurücksetzen, wenn der Wert immer noch falsch ist */
        const currentVal = field.value.replace(/\D/g, "");
        if (currentVal !== solutions[id]) {
          if (isCodeField) {
            /* Originalfarbe aus HTML wiederherstellen */
            field.style.borderColor = codeColors[id];
            if (currentVal === "") field.style.background = "transparent";
          } else {
            /* Normales Feld: nur leere Felder zurücksetzen */
            if (field.value.trim() === "") field.style.borderColor = "";
          }
        }
      }
    }, 400);
  }

  /* Alle richtig → Rätsel als gelöst markieren */
  if (allCorrect) {
    cardElement.classList.add("solved");
    if (buttonElement) {
      buttonElement.innerHTML = "✓";
      buttonElement.disabled = true;
    }
    if (tippElement) tippElement.style.display = "none";

    for (const id of Object.keys(solutions)) {
      const field = document.getElementById(id);
      if (field) field.disabled = true;
    }

    const solutionEl = document.getElementById("solution-network");
    if (solutionEl) solutionEl.style.display = "block";
  } else {
    if (anyWrongFilled && tippElement) tippElement.style.display = "block";
  }
}

/* ── Pyramiden-Trio (Rätsel 9) ───────────────────────────────────────── */
function checkAllLargePyramids() {
  const cardElement = document.getElementById("card-pyramids-multi");
  const tippElement = cardElement ? cardElement.querySelector(".tipp") : null;
  const solutionEl = document.getElementById("solution-pyramids-multi");
  const buttonElement = cardElement
    ? cardElement.querySelector(".input-group-centered button, button")
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
  let anyWrongFilled = false;
  const wrongFields = [];

  for (const [id, expected] of Object.entries(exactSolutions)) {
    const field = document.getElementById(id);
    if (!field) continue;

    const userVal = field.value.replace(/\D/g, "");

    if (userVal === expected) {
      field.style.borderColor = "var(--success)";
      field.classList.remove("shake-input");
    } else {
      allCorrect = false;
      if (field.value.trim() !== "") {
        anyWrongFilled = true;
        field.classList.add("shake-input");
        field.style.borderColor = "var(--error)";
        wrongFields.push({ field, id });
      }
    }
  }

  if (wrongFields.length > 0) {
    setTimeout(() => {
      for (const { field, id } of wrongFields) {
        field.classList.remove("shake-input");
        if (field.value.trim() === "") field.style.borderColor = "";
      }
    }, 400);
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
      const field = document.getElementById(id);
      if (field) {
        field.disabled = true;
        field.style.borderColor = "var(--success)";
      }
    }
  } else {
    if (anyWrongFilled && tippElement) tippElement.style.display = "block";
  }
}

/* ── Shake-Hilfsfunktion ─────────────────────────────────────────────── */
function triggerShake(el) {
  el.classList.remove("shake-input");
  /* Mini-Reflow, damit die Animation neu startet */
  void el.offsetWidth;
  el.classList.add("shake-input");
  setTimeout(() => el.classList.remove("shake-input"), 400);
}

/* ── Globaler Enter-Handler ──────────────────────────────────────────── */
document.addEventListener("keydown", function (event) {
  if (event.key !== "Enter") return;

  const active = document.activeElement;
  if (!active || active.tagName !== "INPUT") return;

  const id = active.id;

  if (id.startsWith("p1-l") || id.startsWith("p2-l") || id.startsWith("p3-l")) {
    event.preventDefault();
    checkAllLargePyramids();
  } else if (
    id.startsWith("p1-r") ||
    id.startsWith("p2-r") ||
    id.startsWith("p3-r") ||
    id.startsWith("code-")
  ) {
    event.preventDefault();
    checkNetworkPuzzle();
  } else if (id.startsWith("input-")) {
    event.preventDefault();
    const btn = active.nextElementSibling;
    if (btn && btn.tagName === "BUTTON" && !btn.disabled) btn.click();
  }
});
