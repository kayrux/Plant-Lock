const character = document.getElementById("character");
const fishesContainer = document.getElementById("fishes-container");
const sequence = document.getElementById("sequence");
const bottomOffsetPerLevel = 20;
const initialCharacterBottom = 5;
const log = document.getElementById("log");
const numRows = 4;
let canMove = true;
let unlocked = false;
let ignoreSensorEvents = false;
let awaitingStartCmd = true;
let phoneFlipped = false;
let initialized = false;

const CORRECT_SEQUENCE = ["right", "left", "right", "left"];
let currentSequence = [];

// location: [position, row]
let currentCharacterLocation = ["middle", 0];
const audio = document.getElementById("background-audio");
const gammaElement = document.getElementById("gamma");

log.innerHTML = "Tilt phone towards you to start";

function initialize() {
  initialized = true;
  log.innerHTML = "Tilt left or right";
  for (let i = 4; i >= 1; i--) {
    console.log(i);
    const row = document.createElement("div");
    row.classList.add("fish-row");
    row.id = "row-" + i;
    addFishToRow(row, i);
    fishesContainer.appendChild(row);
  }
}

function reset() {
  initialized = false;
  awaitingStartCmd = true;
  log.innerHTML = "Tilt phone towards you to start";
  fishesContainer.innerHTML = "";
  currentSequence = [];
  canMove = true;
  currentCharacterLocation = ["middle", 0];
  character.style.bottom = initialCharacterBottom + "%";
  character.style.left = "50%";
  // initialize();

  // Give user a chance to see the sequence they entered before ignoreSensorEvents
  setTimeout(() => {
    sequence.innerHTML = "";
    ignoreSensorEvents = false;
  }, 1000);
}

function addFishToRow(rowElement, rowIndex) {
  const leftFish = document.createElement("div");
  leftFish.id = "fish-" + 2 * rowIndex;
  leftFish.classList.add("fish", "left-fish", "nemo");
  console.log("Adding " + leftFish.id);

  const rightFish = document.createElement("div");
  rightFish.id = "fish-" + (2 * rowIndex - 1);
  rightFish.classList.add("fish", "right-fish", "dory");
  console.log("Adding " + rightFish.id);

  rowElement.appendChild(leftFish);
  rowElement.appendChild(rightFish);
}

function moveCharacter(direction) {
  log.innerHTML = "";

  if (!canMove) return;

  let bottomOffset =
    (currentCharacterLocation[1] + 1) * bottomOffsetPerLevel +
    initialCharacterBottom +
    "%";
  character.style.bottom = bottomOffset;
  if (direction == "left") {
    character.style.left = "10%";
    currentCharacterLocation[0] = "left";
    currentSequence.push("left");
  } else {
    character.style.left = "85%";
    currentCharacterLocation[0] = "right";
    currentSequence.push("right");
  }

  currentCharacterLocation[1] += 1;

  // Prevent movement for a period of time
  canMove = false;
  setTimeout(() => {
    removeFish(direction);
    canMove = true;
    if (currentCharacterLocation[1] == 4) {
      setTimeout(() => {
        checkPasscode();
      }, 500);
    }
  }, 1000);
}

function checkPasscode() {
  let isCorrectPasscode = true;
  ignoreSensorEvents = true;

  for (let i = 0; i < 4; i++) {
    if (currentSequence[i] != CORRECT_SEQUENCE[i]) {
      isCorrectPasscode = false;
    }
  }
  if (isCorrectPasscode) {
    unlock();
  } else {
    log.innerHTML = "Incorrect passcode";
    reset();
  }
}

function unlock() {
  setTimeout(() => {
    log.innerHTML = "UNLOCKED";
    fishesContainer.innerHTML = "";
    sequence.innerHTML = "";
    character.style.display = "none";
    unlocked = true;
  }, 500);
}

function removeFish() {
  if (unlocked || ignoreSensorEvents) return;
  let fishIndex = currentCharacterLocation[1] * 2;

  if (currentCharacterLocation[0] == "right") {
    fishIndex -= 1;
    let miniDory = document.createElement("div");
    miniDory.classList.add("mini-dory");
    sequence.appendChild(miniDory);
  } else if (currentCharacterLocation[0] == "left") {
    let miniNemo = document.createElement("div");
    miniNemo.classList.add("mini-nemo");
    sequence.appendChild(miniNemo);
  }

  const fish = document.getElementById("fish-" + fishIndex);
  fish.classList.add("ring");
  setTimeout(() => {
    fish.style.backgroundImage = "none";
    fish.classList.remove("ring");
  }, 500);
}

window.addEventListener("deviceorientation", function (event) {
  if (unlocked || ignoreSensorEvents) return;
  audio.play();
  gammaElement.innerHTML = event.beta + "<br/>" + event.gamma;
  let gamma = event.gamma;
  let beta = event.beta;

  if (beta >= 100 && awaitingStartCmd && !initialized) {
    initialize();
    this.setTimeout(() => {
      awaitingStartCmd = false;
    }, 1000);
  }
  if (awaitingStartCmd == true) return;

  if (gamma > 20) {
    moveCharacter("right");
  } else if (gamma < -20) {
    moveCharacter("left");
  }
});
