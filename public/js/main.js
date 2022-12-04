var host
if (window.location.protocol == "https:") {
    host = "wss://" + window.location.host + "/ws"
} 
else {
    host = "ws://" + window.location.host + "/ws"
}

var id = Math.floor(Math.random() * 999999);

var canvas = document.getElementById("canvas");
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

function drawPers(x,y, nickname, id) {
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');
        const img = new Image()
        img.src = "https://app.pixelencounter.com/api/basic/monsters/" + id + "/png?size=50";
        img.onload = () => {
            ctx.drawImage(img, x-25, y-25);
            ctx.font = "18px arial";
            ctx.textAlign = "center"
            ctx.fillText(nickname, x, y-28);
        }
    }
}

drawPers(100, 100, "levshx", Math.floor(Math.random() * 999999))


drawPers(250, 100, "grizzly", Math.floor(Math.random() * 999999))