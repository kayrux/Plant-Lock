let character = document.querySelector('.character');
let building = document.querySelector('.building');
let step = character.offsetWidth;
let notification = document.getElementById('notification'); 

let recentMovements = [];
const CORRECT_SEQUENCE = ['right', 'left', 'right', 'left', 'right']; 

function checkUnlockSequence() {
    if (recentMovements.length !== CORRECT_SEQUENCE.length) return false;

    for (let i = 0; i < CORRECT_SEQUENCE.length; i++) {
        if (recentMovements[i] !== CORRECT_SEQUENCE[i]) {
            return false;
        }
    }
    return true;
}

function isShake(x, y, z) {
    let accelerationChange = Math.abs(x + y + z);
    return accelerationChange > SHAKE_THRESHOLD;
}

window.addEventListener('devicemotion', function(event) {
    if (isShake(event.accelerationIncludingGravity.x, event.accelerationIncludingGravity.y, event.accelerationIncludingGravity.z)) {
        if (checkUnlockSequence()) {
            alert('Phone Unlocked!');
            recentMovements = [];
        } else {
            alert('Incorrect sequence. Try again.');
            recentMovements = []; 
        }
    }
});

function showNotification() {
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000); 
}

function moveCharacter(direction) {
    let characterLeft = character.offsetLeft;
    let characterTop = character.offsetTop;
    let buildingWidth = building.offsetWidth;

    if (direction === 'right') {
        console.log("Moving right");
        if (characterLeft < buildingWidth - character.offsetWidth && characterTop > 0) {
            character.style.left = characterLeft + step + 'px';
            if (characterTop > step) {
                character.style.top = characterTop - step + 'px';
            }
        } else if (characterLeft >= buildingWidth - character.offsetWidth) {
            console.log("Right edge reached");
            showNotification();
        }
    } else if (direction === 'left') {
        if (characterLeft > step && characterTop > 0) {
            character.style.left = characterLeft - step + 'px';
            if (characterTop > step) {
                character.style.top = characterTop - step + 'px';
            }
        } else if (characterLeft <= step) {
            console.log("Left edge reached");
            showNotification();
        }
    }
    recentMovements.push(direction);
}

window.addEventListener('deviceorientation', function(event) {
    let gamma = event.gamma; 

    if (gamma > 10) {
        moveCharacter('right');
    } else if (gamma < -10) { 
        moveCharacter('left');
    }
});
