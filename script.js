let timer;
let timeLeft = 30;
let score = 0;
let correctAnswerIndex = 0;
let difficulty = "easy";

function startGame() {
  score = 0;
  timeLeft = 30;
  document.getElementById("finalMessage").style.display = "none";
  document.getElementById("ranking").innerHTML = "";
  document.getElementById("score").textContent = "Pontuação: 0";
  document.getElementById("timer").textContent = "Tempo: 30";
  difficulty = document.getElementById("difficulty").value;
  generateQuestion();
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = "Tempo: " + timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function restartGame() {
  clearInterval(timer);
  startGame();
}

function generateQuestion() {
  let min, max;
  if (difficulty === "easy") {
    min = 1; max = 10;
  } else if (difficulty === "medium") {
    min = 10; max = 50;
  } else {
    min = 50; max = 100;
  }

  const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
  const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  const operators = ["+", "-", "*", "/"];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let correctAnswer;
  switch (operator) {
    case "+": correctAnswer = num1 + num2; break;
    case "-": correctAnswer = num1 - num2; break;
    case "*": correctAnswer = num1 * num2; break;
    case "/": correctAnswer = parseFloat((num1 / num2).toFixed(2)); break;
  }

  let answers = [correctAnswer];
  while (answers.length < 4) {
    let wrong = correctAnswer + Math.floor(Math.random() * 10) - 5;
    wrong = parseFloat(wrong.toFixed(2));
    if (!answers.includes(wrong)) answers.push(wrong);
  }
  answers = answers.sort(() => Math.random() - 0.5);
  correctAnswerIndex = answers.indexOf(correctAnswer);
  document.getElementById("question").textContent = `${num1} ${operator} ${num2}`;
  document.querySelectorAll(".answer").forEach((btn, i) => {
    btn.textContent = answers[i];
  });
}

function checkAnswer(index) {
  const sound = index === correctAnswerIndex ? "sound-correct" : "sound-wrong";
  document.getElementById(sound).play();
  if (index === correctAnswerIndex) {
    score++;
    document.getElementById("score").textContent = "Pontuação: " + score;
  }
  generateQuestion();
}

function endGame() {
  document.getElementById("sound-end").play();
  document.getElementById("finalMessage").style.display = "block";
  document.getElementById("finalMessage").innerHTML = `⏱️ Tempo esgotado!<br>🎯 Pontuação final: <strong>${score}</strong>`;
  updateRanking(score);
}

function updateRanking(newScore) {
  const difficultyKey = "ranking_" + difficulty;
  const ranking = JSON.parse(localStorage.getItem(difficultyKey)) || [];
  ranking.push(newScore);
  ranking.sort((a, b) => b - a);
  if (ranking.length > 5) ranking.pop();
  localStorage.setItem(difficultyKey, JSON.stringify(ranking));
  showRanking(ranking);
}

function showRanking(ranking) {
  let html = "<h3>🏆 Ranking:</h3><ol>";
  ranking.forEach(p => {
    html += `<li>${p} pontos</li>`;
  });
  html += "</ol>";
  document.getElementById("ranking").innerHTML = html;
}
