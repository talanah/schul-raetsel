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
    // Sucht den Tipp-Bereich innerhalb dieser Rätsel-Karte
    const tippElement = cardElement.querySelector('.tipp');

    // Eingabe säubern: Leerzeichen entfernen, Kleinschreibung erzwingen
    const userAnswer = inputField.value.trim().toLowerCase();
    const cleanCorrect = correctAnswer.trim().toLowerCase();

    if (userAnswer === cleanCorrect && userAnswer !== "") {
        // Erfolg: Karte sperren und grün markieren
        inputField.disabled = true;
        cardElement.classList.add('solved');
        
        if (buttonElement) {
            buttonElement.innerHTML = "✓";
            buttonElement.disabled = true;
        }
        
        // Tipp bei Erfolg ausblenden (falls er vorher sichtbar war)
        if (tippElement) {
            tippElement.style.display = "none";
        }
    } else {
        // Fehler: Schütteleffekt triggern
        inputField.classList.add('shake-input');
        
        // Tipp nur bei falscher Antwort anzeigen
        if (tippElement) {
            tippElement.style.display = "block";
        }
        
        // Animation nach Ablauf der Zeit wieder entfernen
        setTimeout(() => {
            inputField.classList.remove('shake-input');
        }, 400);
    }
}