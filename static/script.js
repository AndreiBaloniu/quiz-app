let current = 0;
let score   = 0;
let wrong   = [];
const userAnswers = Array(TOTAL).fill(null);
let timerStarted = false;

// Timerul de 25 min (dacă TIMED), pornește o singură dată
function startTimer(duration, display) {
  if (timerStarted) return;
  timerStarted = true;
  let timer = duration, m, s;
  const tick = setInterval(() => {
    m = parseInt(timer/60, 10);
    s = parseInt(timer%60, 10);
    display.textContent =
      (m<10?"0"+m:m) + ":" + (s<10?"0"+s:s);
    if (--timer < 0) {
      clearInterval(tick);
      showSummary();
    }
  }, 1000);
}

// Actualizează bara de progres
function updateProgress() {
  const pct = Math.round((current / TOTAL) * 100);
  document.getElementById('progressBar').style.width = pct + '%';
}

// Afișează întrebarea curentă
function showQuestion() {
  updateProgress();
  const q = questions[current];
  const quizDiv = document.getElementById('quiz');
  let html = `<div class="question">
                <strong>Întrebarea ${current+1}/${TOTAL}:</strong><br>
                ${q.question}
              </div><div class="options">`;
  for (let key in q.options) {
    const checked = userAnswers[current] && userAnswers[current].includes(key)
                      ? 'checked' : '';
    html += `<label>
               <input type="checkbox" name="opt" value="${key}" ${checked}>
               (${key}) ${q.options[key]}
             </label>`;
  }
  html += `</div>`;
  quizDiv.innerHTML = html;

  // butoanele de navigare
  document.getElementById('prevBtn').disabled = (current === 0);
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = (current === TOTAL-1 ? 'Trimite' : 'Următoarea');
}

// Salvează răspunsurile curente
function saveAnswer() {
  const checked = Array.from(
    document.querySelectorAll('input[name="opt"]:checked')
  ).map(el=>el.value).sort();
  userAnswers[current] = checked;
}

// Next / Submit
document.getElementById('nextBtn').addEventListener('click', () => {
  saveAnswer();
  const q       = questions[current];
  const correct = q.correct.slice().sort();
  const your    = userAnswers[current] || [];
  if (JSON.stringify(your) === JSON.stringify(correct)) {
    score++;
  } else {
    wrong.push({question: q.question, your, correct});
  }
  current++;
  if (current >= TOTAL) {
    showSummary();
  } else {
    showQuestion();
  }
});

// Prev
document.getElementById('prevBtn').addEventListener('click', () => {
  saveAnswer();
  if (current > 0) current--;
  showQuestion();
});

// Rezumat la final
function showSummary() {
  const c = document.querySelector('.container');
  c.innerHTML = `<h2>Rezultate</h2>
                 <p>Scor: ${score}/${TOTAL}</p>`;
  if (wrong.length) {
    let list = '<h3>Răspunsuri greșite:</h3><ul>';
    wrong.forEach(w => {
      list += `<li>
        <strong>${w.question}</strong><br>
        Răspuns tău: ${w.your.join(', ') || '<em>niciunul</em>'}<br>
        Corect: ${w.correct.join(', ')}
      </li>`;
    });
    list += '</ul>';
    c.innerHTML += list;
  }
}

// Initializare când DOM-ul e gata
document.addEventListener('DOMContentLoaded', () => {
  showQuestion();
  if (TIMED === true && DURATION_MIN) {
    const display = document.getElementById('timer');
    startTimer(60 * DURATION_MIN, display);
  }
});
