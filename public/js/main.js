

var host
if (window.location.protocol == "https:") {
    host = "wss://" + window.location.host + "/ws"
} 
else {
    host = "ws://" + window.location.host + "/ws"
}

var id = Math.floor(Math.random() * 999999);

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

var ws = new WebSocket(host)
var con = false
ws.onopen = function () {
    console.log('Вермя: ' + new Date()  + " Соединение установлено.");
};

ws.onclose = function (event) {
    if (event.wasClean) {
        console.log('Соединение закрыто чисто');
    } else {
        console.log('Обрыв соединения'); // например, "убит" процесс сервера
    }
    console.log('Вермя: ' + new Date()  +' Код: ' + event.code + ' причина: ' + event.reason);
    con = true
};

ws.onmessage = function (event) {
    console.log('Вермя: ' + new Date()  +" Получены данные " + event.data);
};

ws.onerror = function (error) {
    console.log('Вермя: ' + new Date()  +" Ошибка " + error.message);
};      

function drawPers(x,y, nickname, id, sprite) {
    ctx.drawImage(sprite, x-25, y-25);            
    ctx.font = "18px arial";
    ctx.textAlign = "center"
    ctx.fillText(nickname, x, y-28);
}


var character = {
    position: {
        x: 250,
        y: 100
    },
    nickname: "testNickName",
    id: 1,
    sprite: new Image()
}

character.sprite.src = "https://app.pixelencounter.com/api/basic/monsters/" + id + "/png?size=50";

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