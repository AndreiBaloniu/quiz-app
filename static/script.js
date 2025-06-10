let current = 0;
let score   = 0;
let wrong   = [];
const userAnswers = Array(TOTAL).fill(null);
let timerStarted = false;

function startTimer(duration, display) {
  if (timerStarted) return;
  timerStarted = true;
  let timer = duration, m, s;
  const tick = setInterval(() => {
    m = parseInt(timer/60, 10);
    s = parseInt(timer%60, 10);
    display.textContent =
      (m < 10 ? "0"+m : m) + ":" + (s < 10 ? "0"+s : s);
    if (--timer < 0) {
      clearInterval(tick);
      showSummary();
    }
  }, 1000);
}

function updateProgress() {
  const pct = Math.round((current / TOTAL) * 100);
  document.getElementById('progressBar').style.width = pct + '%';
}

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

  document.getElementById('prevBtn').disabled = (current === 0);
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = (current === TOTAL - 1 ? 'Trimite' : 'Următoarea');
}

function saveAnswer() {
  const checked = Array.from(
    document.querySelectorAll('input[name="opt"]:checked')
  ).map(el => el.value).sort();
  userAnswers[current] = checked;
}

document.getElementById('nextBtn').addEventListener('click', () => {
  saveAnswer();
  const q       = questions[current];
  const correct = q.correct.slice().sort();
  const your    = userAnswers[current] || [];
  if (JSON.stringify(your) === JSON.stringify(correct)) {
    score++;
  } else {
    wrong.push({ index: current, your, correct });
  }
  current++;
  if (current >= TOTAL) {
    showSummary();
  } else {
    showQuestion();
  }
});

document.getElementById('prevBtn').addEventListener('click', () => {
  saveAnswer();
  if (current > 0) current--;
  showQuestion();
});

function showSummary() {
  const c = document.querySelector('.container');
  c.innerHTML = `<h2>Rezultate</h2>
                 <p>Scor: ${score}/${TOTAL}</p>`;
  if (wrong.length) {
    let list = '<h3>Răspunsuri greșite:</h3><ul>';
    wrong.forEach(w => {
      const q = questions[w.index];
      const yourTexts = w.your.length
        ? w.your.map(l => `(${l}) ${q.options[l]}`).join(', ')
        : '<em>niciun răspuns</em>';
      const correctTexts = w.correct
        .map(l => `(${l}) ${q.options[l]}`).join(', ');
      list += `<li>
                 <strong>${q.question}</strong><br>
                 <strong>Răspunsul tău:</strong> ${yourTexts}<br>
                 <strong>Răspuns corect:</strong> ${correctTexts}
               </li>`;
    });
    list += '</ul>';
    c.innerHTML += list;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showQuestion();
  if (TIMED === true && DURATION_MIN) {
    const display = document.getElementById('timer');
    startTimer(60 * DURATION_MIN, display);
  }
});
