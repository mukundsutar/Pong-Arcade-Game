//board properties
let board;
const widthViewport = window.innerWidth - 30;
const heightViewport = window.innerHeight - 30;
let boardWidth = widthViewport;
let boardHeight = heightViewport;
let context;

//players
let playerWidth = 15;
let playerHeight = 150;
let playerVelocityY = 0;

let player1 = {
    x: 10,
    y: boardHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: playerVelocityY
}

let player2 = {
    x: boardWidth - playerWidth - 10,
    y: boardHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: playerVelocityY
}

//ball
let ballWidth = 20;
let ballHeight = 20;
let ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: 2,
    velocityY: 4
}

let player1Score = 0;
let player2Score = 0;

window.onload = function () {
    board = document.getElementById('board');
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d")     //used for drawing on the board

    //draw initial player 1
    context.fillStyle = "skyblue";
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    requestAnimationFrame(update);

    document.addEventListener("keyup", movePlayer)
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    //draw initial player 1
    context.fillStyle = "#5037C3";
    // player1.y += player1.velocityY;
    let nextPlayer1Y = player1.y + player1.velocityY;
    if (!outOfBounds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
    }
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    //draw player 2
    context.fillStyle = "#37C396";
    // player2.y += player2.velocityY;
    let nextPlayer2Y = player2.y + player2.velocityY;
    if (!outOfBounds(nextPlayer2Y)) {
        player2.y = nextPlayer2Y;
    }
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    //ball
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height)

    //if the ball touches the border walls top or bottom
    if (ball.y <= 0 || (ball.y + ball.height >= boardHeight)) {
        ball.velocityY *= -1;   //inverse or reverse direction
    }

    //bounce the ball back
    if (detectCollision(ball, player1)) {
        if (ball.x <= player1.x + player1.width) { //left side of ball touches right side of player 1 (left paddle)
            ball.velocityX *= -1;   // flip x direction
        }
    }
    else if (detectCollision(ball, player2)) {
        if (ball.x + ballWidth >= player2.x) { //right side of ball touches left side of player 2 (right paddle)
            ball.velocityX *= -1;   // flip x direction
        }
    }

     //game over
     if (ball.x < 0) {
        player2Score++;
        resetGame(2);
    }
    else if (ball.x + ballWidth > boardWidth) {
        player1Score++;
        resetGame(-2);
    }


    //draw score
    context.font = "45px sans-serif";
    context.fillText(player1Score, boardWidth/5, 45);
    context.fillText(player2Score, boardWidth*4/5 - 45, 45);

    //draw dotted line in the middle
    for(let i=10; i<board.height; i +=25){
        //i = starting y position, draw a square every 25 pixel down
        // (x position = half of boardWidth (middle) - 10), i = y position, width = 5, height = 5
        context.fillRect(board.width/2 - 10, i, 5, 5);
    }
}

function outOfBounds(yPosition) {
    return (yPosition < 0 || yPosition + playerHeight > boardHeight)
}

function movePlayer(e) {
    //player1
    if (e.code == "KeyW") {
        player1.velocityY = -4;
    }
    else if (e.code == "KeyS") {
        player1.velocityY = 4;
    }

    //player2
    if (e.code == "ArrowUp") {
        player2.velocityY = -4;
    }
    else if (e.code == "ArrowDown") {
        player2.velocityY = 4;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function resetGame(direction) {
    ball = {
        x : boardWidth/2,
        y : boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX : direction,
        velocityY : 4
    }
}