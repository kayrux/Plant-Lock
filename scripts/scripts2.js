const character = document.getElementById("character");
const fishesContainer = document.getElementById("fishes-container");
const bottomOffsetPerLevel = 20;
const initialCharacterBottom = 5;
const log = document.getElementById("log");
const numRows = 4;
let canMove = true;

// location: [position, row]
currentCharacterLocation = ["middle", 0];

initialize();
const gammaElement = document.getElementById("gamma");

function initialize() {
  for (let i = 4; i >= 1; i--) {
    console.log(i);
    const row = document.createElement("div");
    row.classList.add("fish-row");
    row.id = "row-" + i;
    addFishToRow(row, i);
    fishesContainer.appendChild(row);
  }

  // setInterval(() => {
  //   moveCharacter("right");
  // }, 1000);
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
  if (!canMove) return;

  let bottomOffset =
    (currentCharacterLocation[1] + 1) * bottomOffsetPerLevel +
    initialCharacterBottom +
    "%";
  character.style.bottom = bottomOffset;
  if (direction == "left") {
    character.style.left = "10%";
    currentCharacterLocation[0] = "left";
  } else {
    character.style.left = "85%";
    currentCharacterLocation[0] = "right";
  }

  currentCharacterLocation[1] += 1;

  // Prevent movement for a period of time
  canMove = false;
  setTimeout(() => {
    removeFish();
    canMove = true;
  }, 1000);
}

function removeFish() {
  let fishIndex = currentCharacterLocation[1] * 2;

  if (currentCharacterLocation[0] == "right") {
    fishIndex -= 1;
  }

  const fish = document.getElementById("fish-" + fishIndex);
  fish.style.backgroundImage = "none";
}

window.addEventListener("deviceorientation", function (event) {
  console.log(event);
  gammaElement.innerHTML = event.gamma;
  let gamma = event.gamma;
  let beta = event.beta;

  if (gamma > 20) {
    moveCharacter("right");
  } else if (gamma < -20) {
    moveCharacter("left");
  }
});
