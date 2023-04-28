var GAME = {
    width: 1024,
    height: 512,
}

var canvas = document.getElementById("canvas");
canvas.width = GAME.width;
canvas.height = GAME.height;
var canvasContext = canvas.getContext("2d");

var screen;
var time = 99;
var points = 0;
var bestPoints = 0;

const background_start = new Image();
background_start.src = 'img/background_start.png';

const background_game = new Image();
background_game.src = 'img/background_game.png';

const playButton = new Image();
playButton.src = 'img/playButton.png';

const repeatButton = new Image();
repeatButton.src = 'img/repeatButton.png';

const backButton = new Image();
backButton.src = 'img/backButton.png';

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 3; i++) {
      color += letters[Math.floor(Math.random() * 16)];
      color += 0;
    }
    return color;
}
    
var countBlocksY = 2;
var countBlocksX = 9;

var arrBlocks = [];

for (var y1 = 1; y1 <= countBlocksY; y1++) {
    arrBlocks[y1] = [];
    for (var x1 = 1; x1 <= countBlocksX; x1++) {
        arrBlocks[y1][x1] = {
            posX: x1 * 96,
            posY: y1 * 96 + 160,
            width: 64,
            height: 64,
            color: getRandomColor(),
        }
    }
}

var MainBlock = {
    posX: 448,
    posY: 96,
    width: 128,
    height: 128,
    color: arrBlocks[Math.floor(Math.random() * countBlocksY )+ 1][Math.floor(Math.random() * countBlocksX) + 1].color,
}

function drawBlocks() {
    for (var y1 = 1; y1 <= countBlocksY; y1++) {
        for (var x1 = 1; x1 <= countBlocksX; x1++) {
            canvasContext.fillStyle = arrBlocks[y1][x1].color;
            canvasContext.fillRect(arrBlocks[y1][x1].posX, arrBlocks[y1][x1].posY, arrBlocks[y1][x1].width, arrBlocks[y1][x1].height);
        }
    }
}

function updateBlocks() {
    for (var y1 = 1; y1 <= countBlocksY; y1++) {
        for (var x1 = 1; x1 <= countBlocksX; x1++) {
            arrBlocks[y1][x1].color = getRandomColor();
            canvasContext.fillStyle = arrBlocks[y1][x1].color;
            canvasContext.fillRect(arrBlocks[y1][x1].posX, arrBlocks[y1][x1].posY, arrBlocks[y1][x1].width, arrBlocks[y1][x1].height);
        }
    }
}

function drawMainBlock() {
    canvasContext.fillStyle = MainBlock.color;
    canvasContext.fillRect(MainBlock.posX, MainBlock.posY, MainBlock.width, MainBlock.height);
}

function updateMainBlock() {
    MainBlock.color = arrBlocks[Math.floor(Math.random() * countBlocksY )+ 1][Math.floor(Math.random() * countBlocksX) + 1].color;
    canvasContext.fillStyle = MainBlock.color;
    canvasContext.fillRect(MainBlock.posX, MainBlock.posY, MainBlock.width, MainBlock.height);
}

function end() {
    screen = 'end';
    document.getElementById('time').classList.remove('flashing');
    canvasContext.clearRect(0, 0, GAME.width,  GAME.height);
    canvasContext.drawImage(background_game, -32, -32);
    canvasContext.drawImage(repeatButton, 320, 208);
    canvasContext.drawImage(backButton, 64, 64);
}

function game() {
    screen = 'game';
    time = 99;
    points = 0;
    document.getElementById('points').innerHTML = 'Очков: ' + points;
    document.getElementById('time').style.color = '#fff';
    document.getElementById('canvas').classList.remove('cursorGreen');
    document.getElementById('canvas').classList.add('cursorBlue');
    canvasContext.clearRect(0, 0, GAME.width,  GAME.height);
    canvasContext.drawImage(background_game, -32, -32);
    drawBlocks();
    drawMainBlock();
}

function startScreen() {
    screen = 'start';
    time = 99;
    points = 0;
    document.getElementById('points').innerHTML = 'Очков: ' + points;
    document.getElementById('time').style.color = '#fff';
    document.getElementById('time').innerHTML = 'Времени осталось: ' + Math.floor(time / 10) + '.' + time % 10 + ' сек';
    document.getElementById('canvas').classList.remove('cursorBlue');
    document.getElementById('canvas').classList.add('cursorGreen');
    canvasContext.clearRect(0, 0, GAME.width,  GAME.height);
    canvasContext.drawImage(background_start, -32, -32);
    canvasContext.drawImage(playButton, 320, 208);
}

function initEventsListeners() {
    window.addEventListener("mousedown", onCanvansMouseDown);
}

function onCanvansMouseDown(event) {
    var pt = getCoords(event, canvas);

    if (screen === 'game') {
        for (var y1 = 1; y1 <= countBlocksY; y1++) {
            for (var x1 = 1; x1 <= countBlocksX; x1++) {
                if ((pt.x >= arrBlocks[y1][x1].posX) && (pt.y >= arrBlocks[y1][x1].posY) && (pt.x <= (arrBlocks[y1][x1].posX + arrBlocks[y1][x1].width)) && (pt.y <= (arrBlocks[y1][x1].posY + arrBlocks[y1][x1].height))) {
                    if (arrBlocks[y1][x1].color === MainBlock.color) {
                        updateBlocks();
                        updateMainBlock();
                        points += 1;
                        document.getElementById('points').innerHTML = 'Очков: ' + points;
                        if (bestPoints < points) {
                            bestPoints = points;
                            document.getElementById('bestPoints').innerHTML = 'Ваш рекорд: ' + bestPoints;
                        }
                        time = 99;
                        if (points <= 50) {time -= points;} else {time = 49};
                    } else {
                        time -= 10;
                    }
                }
            }
        }
    }
    
    if (screen === 'end') {
        if ((pt.x >= 320) && (pt.x <= 704) && (pt.y >= 208) && (pt.y <= 304)) {
            game();
        }
        
        if ((pt.x >= 64) && (pt.x <= 160) && (pt.y >= 64) && (pt.y <= 160)) {
            startScreen();
        }
    }

    if (screen === 'start') {
        if ((pt.x >= 320) && (pt.x <= 704) && (pt.y >= 208) && (pt.y <= 304)) {
            game();
        }
    }
}

function countDown() {
    if (screen === 'game') {
        if (time > 0) {
            time -= 1;
            document.getElementById('time').innerHTML = 'Времени осталось: ' + Math.floor(time / 10) + '.' + time % 10 + ' сек';
            document.getElementById('time').style.color = 'rgb(255, ' + (time + 156) + ', ' + (time + 156) + ')';
        } else {
            end();
        }
    }
}

function getCoords(e, canvas) {
    const bbox = canvas.getBoundingClientRect();
    const mx = e.clientX - bbox.left * (canvas.width / bbox.width);
    const my = e.clientY - bbox.top * (canvas.height / bbox.height);
    return { x: mx, y: my };
}

backButton.onload = () => {
    startScreen();
    initEventsListeners();
    setInterval(countDown, 100);
}

function setPoints(ptns) {
    points = ptns;
    document.getElementById('points').innerHTML = 'Очков: ' + points;
    if (bestPoints < points) {
        bestPoints = points;
        document.getElementById('bestPoints').innerHTML = 'Ваш рекорд: ' + bestPoints;
    }
}

function scrn() {
    console.log(screen);
}