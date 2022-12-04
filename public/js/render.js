var keyboard = {
    A: false,
    D: false,
    W: false,
    S: false,
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawPers(x,y, nickname, id, sprite) {
    ctx.drawImage(sprite, x-25, y-25);            
    ctx.font = "18px arial";
    ctx.textAlign = "center"
    ctx.fillText(nickname, x, y-28);
}

function startListenKeys() {
    document.addEventListener('keydown', function(event) {
        if (event.code == 'KeyA') {
          keyboard.A = true;
        }
        if (event.code == 'KeyD') {
            keyboard.D = true;
        }
        if (event.code == 'KeyW') {
            keyboard.W = true;
        }
          if (event.code == 'KeyS') {
            keyboard.S = true;
        }
    });
    
     document.addEventListener('keyup', function(event) {
        if (event.code == 'KeyA') {
            keyboard.A = false;
        }
        if (event.code == 'KeyD') {
            keyboard.D = false;
        }
        if (event.code == 'KeyW') {
            keyboard.W = false;
        }
        if (event.code == 'KeyS') {
            keyboard.S = false;
        }
    }); 
}

function render() {
   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPers(character.position.x, character.position.y, character.nickname, character.id, character.sprite)
  
}

function calculate() {
    if (keyboard.A) {
        character.position.x -= 5
    }
    if (keyboard.D) {
        character.position.x += 5
    }
    if (keyboard.W) {
        character.position.y -= 5
    }
    if (keyboard.S) {
        character.position.y += 5
    }
        
}

function animationRequest() {
    calculate();
    render();
    requestAnimationFrame(animationRequest);
}

requestAnimationFrame(animationRequest);