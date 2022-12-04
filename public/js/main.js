
// SERVER ----------------------------
var secret
var allPlayers = []
var host
if (window.location.protocol == "https:") {
    host = "wss://" + window.location.hostname + ":2222/ws"
} 
else {
    host = "ws://" + window.location.hostname + ":2222/ws"
}

var connected = false
var ws

function createWebcon(nick) {
    ws = new WebSocket(host)
    ws.onopen = function () {
        console.log('Вермя: ' + new Date()  + " Соединение установлено.");
        console.log(JSON.stringify({ 
            event: "auth", 
            data: {
                nick: nick
            } 
        })); 
        ws.send(JSON.stringify({ 
            event: "auth", 
            data: {
                nick: nick
            } 
        }));       
    };
    
    ws.onclose = function (event) {
        if (event.wasClean) {
            console.log('Соединение закрыто чисто');
        } else {
            console.log('Обрыв соединения'); // например, "убит" процесс сервера
        }
        console.log('Вермя: ' + new Date()  +' Код: ' + event.code + ' причина: ' + event.reason);
        connected = false
    };
    
    ws.onmessage = function (event) {
        //console.log('Вермя: ' + new Date()  +" Получены данные " + event.data);
        var data = JSON.parse(event.data)
        if (data["event"] == "auth" ) {
            if (data["status"] == true ) {
                console.log("АВТОИЗАЦИЯ УСПЕШНО");
                character.id = data["id"];
                character.nickname = data["nick"];
                secret = data["secret"];
                
            }
            else 
            {
                console.log("АВТОИЗАЦИЯ ОШИБКА");
            }
        }
        if (data["event"] == "getAll" ) {
            if (data["status"] == true ) {
                allPlayers = data["data"]["players"]
            }
        }
        ws.send(JSON.stringify({ 
            event: "update",
            secret: secret, 
            data: {
                x: character.position.x,
                y: character.position.y,
            } 
        })); 
    };
    
    ws.onerror = function (error) {
        console.log('Вермя: ' + new Date()  +" Ошибка " + error.message);
    };      
    
}
// LOGIN FORM -------------------------

window.onload = e => {
    const form = document.querySelector('#login')
    
    const formHandler = e => {
      e.preventDefault()
      const formData = new FormData( e.target )
      var data = formData      
      character.nickname = data.get("nick")
      createWebcon(data.get("nick"))
      requestAnimationFrame(animationRequest);
      form.remove()      
    }
    
    form.addEventListener('submit', formHandler)
  }
// GAME ----------------------------

const character = {
    position: {
        x: 250,
        y: 100
    },
    nickname: "testNickName",
    id: 1,
    sprite: new Image()
}

character.sprite.src = "https://app.pixelencounter.com/api/basic/monsters/" + character.id + "/png?size=50";

startListenKeys()

// RENDER ----------------------------

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

function drawAllPlayers() {
    allPlayers.forEach(player => drawPlayer(player));
}

function drawPlayer(player) {
    if (player["id"] != character.id) {        
        drawPers(player["x"], player["y"], player["nickname"], player["id"], character.sprite)
    }
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
    drawAllPlayers()
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