const boxes = document.querySelectorAll(".box");
const resetBtn = document.getElementById("reset-btn");
const newBtn = document.getElementById("new-btn");
const msg = document.getElementById("msg");
const msgDisplay = document.getElementById("msg");
const turnDisplay = document.getElementById("turn");
const modeToggle = document.getElementById("mode-toggle");

const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const drawCount = document.getElementById("draws");

const setupDiv = document.getElementById("player-setup");
const mainGame = document.getElementById("main-game");
const startBtn = document.getElementById("start-game");
const playerXInput = document.getElementById("playerX");
const playerOInput = document.getElementById("playerO");

let playerX = "X";
let playerO = "O";

let turnX = true;
let moves = 0;
let scores = {
  X: 0,
  O: 0,
  D: 0,
};

// Load scores from localStorage
window.onload = () => {
  const storedScores = JSON.parse(localStorage.getItem("ticScores"));
  if (storedScores) {
    scores = storedScores;
    updateScoreDisplay();
  }

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
};

// Player name input handler
startBtn.addEventListener("click", () => {
  if (playerXInput.value.trim() && playerOInput.value.trim()) {
    playerX = playerXInput.value.trim();
    playerO = playerOInput.value.trim();
    setupDiv.classList.add("hide");
    mainGame.classList.remove("hide");
    turnDisplay.textContent = `Turn: ${playerX} (X)`;
  } else {
    alert("Enter names for both players.");
  }
});

// Winning combinations
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

boxes.forEach((box) =>
  box.addEventListener("click", () => {
    if (box.innerText !== "") return;

    box.innerText = turnX ? "X" : "O";
    box.disabled = true;
    moves++;

    if (checkWinner()) {
      const winner = turnX ? "X" : "O";
      scores[winner]++;
      msg.textContent = `🎉 ${turnX ? playerX : playerO} wins!`;
      msg.classList.remove("hide");
      disableBoxes();
      updateScoreDisplay();
      saveScores();
    } else if (moves === 9) {
      scores.D++;
      msg.textContent = "It's a draw!";
      msg.classList.remove("hide");
      updateScoreDisplay();
      saveScores();
    } else {
      turnX = !turnX;
      turnDisplay.textContent = `Turn: ${turnX ? playerX : playerO} (${turnX ? "X" : "O"})`;
    }
  })
);

const checkWinner = () => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      boxes[a].innerText &&
      boxes[a].innerText === boxes[b].innerText &&
      boxes[b].innerText === boxes[c].innerText
    ) {
      boxes[a].classList.add("win");
      boxes[b].classList.add("win");
      boxes[c].classList.add("win");
      return true;
    }
  }
  return false;
};

const disableBoxes = () => {
  boxes.forEach((box) => (box.disabled = true));
};

const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
    box.classList.remove("win");
  });
};

const resetBoard = () => {
  turnX = true;
  moves = 0;
  enableBoxes();
  msg.classList.add("hide");
  turnDisplay.textContent = `Turn: ${playerX} (X)`;
};

const newGame = () => {
  resetBoard();
  scores = { X: 0, O: 0, D: 0 };
  updateScoreDisplay();
  saveScores();
};

const updateScoreDisplay = () => {
  scoreX.textContent = `X: ${scores.X}`;
  scoreO.textContent = `O: ${scores.O}`;
  drawCount.textContent = `Draws: ${scores.D}`;
};

const saveScores = () => {
  localStorage.setItem("ticScores", JSON.stringify(scores));
};

resetBtn.addEventListener("click", resetBoard);
newBtn.addEventListener("click", newGame);

// Theme toggle
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
});
