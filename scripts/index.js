"use strict";

const Players = {
  CPU: "cpu",
  USER: "user",
};

class SimonGame {
  constructor(colors) {
    this.colors = colors;
    this.player = Players.CPU;
    this.round = 0;
    this.machineCombination = [];
    this.userCombination = [];
  }

  getRandomColor() {
    const min = 0,
      max = this.colors.length;

    const randomInt = Math.floor(Math.random() * (max - min)) + min;

    return this.colors[randomInt];
  }

  startGame() {
    this.round = 0;
    this.machineCombination = [];
    this.userCombination = [];
    this.changePlayer(Players.CPU);

    this.playsCPU();

    return this;
  }

  generateColor() {
    this.machineCombination.push(this.getRandomColor());
  }

  playsCPU() {
    this.round++;
    this.userCombination = [];
    this.generateColor();
  }

  changePlayer(player) {
    this.player = player;
  }

  play(color) {
    const userPosition = this.userCombination.length;
    this.userCombination.push(color);
    if (
      this.userCombination[userPosition] !==
      this.machineCombination[userPosition]
    ) {
      this.startGame();
      return -1;
    }
    // Si la combinaciones tienen el mismo número de elementos, entonces juega el CPU
    if (this.userCombination.length === this.machineCombination.length) {
      this.playsCPU();
      return 0;
    }

    return 1;
  }
}

const game = new SimonGame(["red", "blue", "green", "yellow"]);

/* UI */

function shineColor(color, ttl = 1000) {
  const selectedColor = Array.from(colorButtons).find(
    (element) => element.id === color
  );
  selectedColor.classList.toggle("active");
  audio.play();
  setTimeout(() => {
    selectedColor.classList.toggle("active");
  }, ttl);
}

function shineCombination(combination) {
  game.changePlayer(Players.CPU);

  let counter = 0;
  let shineInterval = setInterval(() => {
    shineColor(combination[counter]);

    counter++;

    if (combination.length === counter) {
      clearInterval(shineInterval);
      game.changePlayer(Players.USER);
    }
  }, 1500);
}

function updateScore() {
  if (game.round > 0) {
    score.innerHTML = game.round - 1;
  } else {
    score.innerHTML = 0;
  }
}
/* HANDLERS */
function startGameHandler(ev) {
  ev.preventDefault();
  game.startGame();
  shineCombination(game.machineCombination);
  startButton.classList.add("inactive");
}

function colorButtonHandler(ev) {
  ev.preventDefault();

  if (game.player === Players.USER) {
    const result = game.play(ev.currentTarget.id);
    shineColor(ev.currentTarget.id, 300);
    if (result === -1) {
      alert("Lo siento, has perdido");
      updateScore();
      startButton.classList.remove("inactive");
    }
    if (result === 0) {
      shineCombination(game.machineCombination);
      updateScore();
    }
  }
}

/* BUSQUEDA UI */
const startButton = document.querySelector("#start-game");
startButton.addEventListener("click", startGameHandler);
const colorButtons = document.querySelectorAll(".js-btn-color");
colorButtons.forEach((element) =>
  element.addEventListener("click", colorButtonHandler)
);
const audio = document.querySelector(".js-audio");
const score = document.querySelector(".js-score");
updateScore();
