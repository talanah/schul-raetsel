/**
 * Überprüft die Antwort eines Rätsels
 * @param {number} id - Die ID des Rätsels
 * @param {string} correctAnswer - Die korrekte Lösung
 */
function checkAnswer(id, correctAnswer) {
    const inputField = document.getElementById(`input-${id}`);
    const cardElement = document.getElementById(`card-${id}`);

    if (!inputField || !cardElement) return;

    const buttonElement = inputField.nextElementSibling;
    const tippElement = cardElement.querySelector('.tipp');

    const userAnswer = inputField.value.trim().toLowerCase();

    const answers = Array.isArray(correctAnswer)
        ? correctAnswer
        : [correctAnswer];

    const isCorrect = userAnswer !== "" && answers.some(ans =>
        ans.trim().toLowerCase() === userAnswer
    );

    if (isCorrect) {
        inputField.disabled = true;
        cardElement.classList.add('solved');

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
        inputField.classList.add('shake-input');

        if (tippElement) {
            tippElement.style.display = "block";
        }

        setTimeout(() => {
            inputField.classList.remove('shake-input');
        }, 400);
    }
}

/**
 * Türerrätsel: Akzeptiert mehrere sinngemäß korrekte Antworten
 * @param {number} id - Die ID des Rätsels
 */
function checkAnswerDoor(id) {
    const inputField = document.getElementById(`input-${id}`);
    const cardElement = document.getElementById(`card-${id}`);
    const feedbackEl = document.getElementById('door-feedback');

    if (!inputField || !cardElement) return;

    const buttonElement = inputField.nextElementSibling;
    const tippElement = cardElement.querySelector('.tipp');
    const userAnswer = inputField.value.trim().toLowerCase();

    // Schlüsselwörter, die auf die richtige Antwort hinweisen
    const correctKeywords = [
        'andere wächter', 'andere tür', 'andere wachter',
        'würde der andere', 'wuerde der andere',
        'beide wächter', 'beide wachter',
        'welche tür würde', 'welche tur wurde',
        'welche tür würde der andere',
        'frage einen beliebigen',
        'freiheit nennen',
        'sicher bezeichnen',
        'der andere wächter sagen',
        'der andere wachter sagen'
    ];

    const isCorrect = userAnswer !== "" && correctKeywords.some(kw => userAnswer.includes(kw));

    if (isCorrect) {
        inputField.disabled = true;
        cardElement.classList.add('solved');
        
        if (buttonElement) {
            buttonElement.innerHTML = "✓";
            buttonElement.disabled = true;
        }

        if (tippElement) tippElement.style.display = "none";
        if (feedbackEl) feedbackEl.style.display = "none";

    } else if (userAnswer !== "") {
        // Zeige Hinweis zur richtigen Frage
        inputField.classList.add('shake-input');
        
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
            inputField.classList.remove('shake-input');
        }, 400);
    }
}

/**
 * Pyramiden-Netzwerk: Prüft alle mathematischen Zwischenschritte und die Farbcodes
 */
function checkNetworkPuzzle() {
    const cardElement = document.getElementById('card-network');
    const buttonElement = document.getElementById('button-network');
    const tippElement = cardElement ? cardElement.querySelector('.tipp') : null;

    if (!cardElement) return;

    // Mathematisch korrekte Lösungen für jedes einzelne Feld
    const solutions = {
        // Top Pyramid (p1)
        'p1-r1-c1': '178',
        'p1-r3-c3': '39',
        'p1-r4-c2': '26',
        'p1-r4-c4': '20',
        'p1-r5-c2': '15',

        // Left Pyramid (p2)
        'p2-r1-c1': '94',
        'p2-r2-c1': '52',
        'p2-r3-c3': '15',
        'p2-r4-c2': '20',
        'p2-r4-c3': '7',
        'p2-r5-c4': '7',

        // Right Pyramid (p3)
        'p3-r1-c1': '31',
        'p3-r3-c2': '20',
        'p3-r4-c1': '7',
        'p3-r5-c4': '18',
        'p3-r6-c3': '0',

        // Finale Code-Felder oben
        'code-orange': '94',
        'code-purple': '178',
        'code-green': '31'
    };

    let allCorrect = true;
    let anyFieldIncorrect = false;

    // 1. Durchlauf: Validierung aller Felder
    for (const [id, val] of Object.entries(solutions)) {
        const inputField = document.getElementById(id);
        if (inputField) {
            const userAnswer = inputField.value.trim();
            
            if (userAnswer === val) {
                // Bei richtigem Wert bleibt das Feld sauber (oder du vergibst optional einen grünen Rand)
                inputField.classList.remove('shake-input');
            } else {
                allCorrect = false;
                // Shake-Animation triggern, falls das Feld nicht leer ist
                if (userAnswer !== "") {
                    anyFieldIncorrect = true;
                    inputField.classList.add('shake-input');
                }
            }
        }
    }

    // 2. Zustand anpassen analog zu deinen bestehenden Rätseln
    if (allCorrect) {
        cardElement.classList.add('solved');
        
        if (buttonElement) {
            buttonElement.innerHTML = "✓";
            buttonElement.disabled = true;
        }

        if (tippElement) {
            tippElement.style.display = "none";
        }

        // Alle Inputs einfrieren
        for (const id of Object.keys(solutions)) {
            const inputField = document.getElementById(id);
            if (inputField) inputField.disabled = true;
        }

        const solutionEl = document.getElementById('solution-network');
        if (solutionEl) {
            solutionEl.style.display = "block";
        }

    } else {
        // Falls Fehler vorlagen, die Shake-Klasse nach 400ms wie gewohnt entfernen
        if (anyFieldIncorrect && tippElement) {
            tippElement.style.display = "block";
        }

        setTimeout(() => {
            for (const id of Object.keys(solutions)) {
                const inputField = document.getElementById(id);
                if (inputField) inputField.classList.remove('shake-input');
            }
        }, 400);
    }
}