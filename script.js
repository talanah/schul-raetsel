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
    const cleanCorrect = correctAnswer.trim().toLowerCase();

    if (userAnswer === cleanCorrect && userAnswer !== "") {
        // Erfolg
        inputField.disabled = true;
        cardElement.classList.add('solved');
        
        if (buttonElement) {
            buttonElement.innerHTML = "✓";
            buttonElement.disabled = true;
        }
        
        if (tippElement) {
            tippElement.style.display = "none";
        }

        // Streichholzrätsel: Lösung einblenden
        const solutionEl = document.getElementById(`solution-${id}`);
        if (solutionEl) {
            solutionEl.style.display = "block";
        }

    } else {
        // Fehler: Schütteleffekt
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