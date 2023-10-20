let character = document.querySelector('.character');
let building = document.querySelector('.building');
let step = character.offsetWidth;
//let step = '20%';


let notification = document.getElementById('notification');

let lastMoveTime = 0;
let recentMovements = [];
const CORRECT_SEQUENCE = ['right', 'left', 'right', 'left'];
const MOVE_COOLDOWN = 1000;
let phoneFlipped = false;

// Insert your new code here
let currentLevel = 0; // Starting level
let maxLevel = 3; // Maximum level (0, 1, 2, 3)

// Map levels to y-coordinates
let levelToYCoordinate = {
    0:5,
    1: 30,
    2: 50,
    3: 70,
    4: 90
};
let xCoordinate = '40%'; // Initial x-coordinate
const audio = document.getElementById('background-audio');


function checkUnlockSequence() {
    if (recentMovements.length !== CORRECT_SEQUENCE.length) return false;

    for (let i = 0; i < CORRECT_SEQUENCE.length; i++) {
        if (recentMovements[i] !== CORRECT_SEQUENCE[i]) {
            return false;
        }
    }
    return true;
}

function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}


function fishRemove(){
         
    // Check if the character is over a fish
    const characterRect = character.getBoundingClientRect();
    const fishElements = document.querySelectorAll('.fish');

    fishElements.forEach((fish) => {
        const fishRect = fish.getBoundingClientRect();

        // Check for collision between character and fish
        if (
            characterRect.left < fishRect.right &&
            characterRect.right > fishRect.left &&
            characterRect.top < fishRect.bottom &&
            characterRect.bottom > fishRect.top
        ) {
            // Character and fish are colliding, remove the fish
            fish.style.display = 'none';
        }
    });
    //end code
}
function moveCharacter(direction) {
    let characterLeft = character.offsetLeft;
    let characterTop = character.offsetTop;
    let buildingWidth = building.offsetWidth;
    let buildingHeight = building.offsetHeight;

    let currentTime = new Date().getTime();

    if (currentTime - lastMoveTime < MOVE_COOLDOWN) {
        return; // Exit the function if not enough time has passed
    }

    if (direction === 'right') {
        console.log("Moving right");
        if (characterLeft < buildingWidth - character.offsetWidth && characterTop < buildingHeight - character.offsetHeight) {
            character.style.left = '60%';
            if (characterTop < buildingHeight - character.offsetHeight - step) {
                fishRemove();

                currentLevel+=1;
                character.style.top = levelToYCoordinate[currentLevel ] + '%';
                
            }
        } else if (characterLeft >= buildingWidth - character.offsetWidth) {
            console.log("Right edge reached");
            showNotification("Cannot move further to the right!");
        }
    } else if (direction === 'left') {
        console.log("Moving left");
        if (characterLeft > step && characterTop < buildingHeight - character.offsetHeight) {
            character.style.left = '30%';
            if (characterTop < buildingHeight - character.offsetHeight - step) {
                fishRemove();

                currentLevel+=1;
                character.style.top = levelToYCoordinate[currentLevel ] + '%' ;

            }
        } else if (characterLeft <= step) {
            console.log("Left edge reached");
            showNotification("Cannot move further to the left!");
        }
    }
    recentMovements.push(direction);
    console.log('recent Movements:', recentMovements);

    lastMoveTime = currentTime;



}

function resetCharacter() {
    character.style.left = '35%';
    character.style.top = '5%';
    // character.style.bottom = '0';
    recentMovements = [];
    currentLevel = 0;
    // Show all fish elements
    const fishElements = document.querySelectorAll('.fish');
    fishElements.forEach(fish => {
        fish.style.display = 'block';
    });
}




window.addEventListener('deviceorientation', function(event) {
    audio.play();

    let gamma = event.gamma;
    let beta = event.beta;

    if (gamma > 20) {
        moveCharacter('right');
    } else if (gamma < -20) {
        moveCharacter('left');
    }



    // new code 
    // Calculate the new level based on the direction
    // let newLevel = currentLevel;

    // if (direction === 'left' && currentLevel > 0) {
    //     newLevel = currentLevel - 1;
    //     xCoordinate = '40%'; // When tilting left, set the x-coordinate to '40%'
    // } else if (direction === 'right' && currentLevel < maxLevel) {
    //     newLevel = currentLevel + 1;
    //     xCoordinate = '55%'; // When tilting right, set the x-coordinate to '45%'
    // }

    // // Call moveCharacter with the new level and x-coordinate
    // moveCharacter(newLevel, xCoordinate);

    // // Update the current level
    // currentLevel = newLevel;

        //
    // Check for phone flip
    if (beta > 170 || beta < -170) {
        phoneFlipped = true;
    } else if (phoneFlipped && (beta < 200 && beta > -200)) {
        phoneFlipped = false;
        if (checkUnlockSequence()) {
            showNotification('Phone Unlocked!');
            recentMovements = [];
        } else {
            showNotification('Incorrect sequence. Try again.');
            resetCharacter();
        }
    }
});
