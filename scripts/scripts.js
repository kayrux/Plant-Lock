let character = document.querySelector('.character');
let building = document.querySelector('.building');
let step = character.offsetWidth;
let notification = document.getElementById('notification'); 

let lastMoveTime = 0;
let recentMovements = [];
const CORRECT_SEQUENCE = ['right', 'left', 'right', 'left', 'right']; 
const MOVE_COOLDOWN = 1000;
let phoneFlipped = false;

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

function moveCharacter(direction) {
    let characterLeft = character.offsetLeft;
    let characterTop = character.offsetTop;
    let buildingWidth = building.offsetWidth;

    let currentTime = new Date().getTime();

    if (currentTime - lastMoveTime < MOVE_COOLDOWN) {
        return; // Exit the function if not enough time has passed
    }

    if (direction === 'right') {
        console.log("Moving right");
        if (characterLeft < buildingWidth - character.offsetWidth && characterTop > 0) {
            character.style.left = characterLeft + step + 'px';
            if (characterTop > step) {
                character.style.top = characterTop - step + 'px';
            }
        } else if (characterLeft >= buildingWidth - character.offsetWidth) {
            console.log("Right edge reached");
            showNotification("Cannot move further to the right!");
        }
    } else if (direction === 'left') {
        if (characterLeft > step && characterTop > 0) {
            character.style.left = characterLeft - step + 'px';
            if (characterTop > step) {
                character.style.top = characterTop - step + 'px';
            }
        } else if (characterLeft <= step) {
            console.log("Left edge reached");
            showNotification("Cannot move further to the left!");
        }
    }
    recentMovements.push(direction);
    lastMoveTime = currentTime;
}

function resetCharacter() {
    character.style.left = '50%'; 
    character.style.top = 'auto'; 
    character.style.bottom = '0'; 
    recentMovements = [];
}

window.addEventListener('deviceorientation', function(event) {
    let gamma = event.gamma; 
    let beta = event.beta;

    if (gamma > 20) {
        moveCharacter('right');
    } else if (gamma < -20) { 
        moveCharacter('left');
    }

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

