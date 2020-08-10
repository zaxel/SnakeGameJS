//setting up canvas
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let canvasRows = canvas.height/15;
let canvasColumns = canvas.width/15;

let x = canvas.width/2;
let y = 255;

//pixels snake move per frame
let snakeStep = 15;
let dx = snakeStep;
let dy = -snakeStep;

//fps/snake speed
let fps = 3;
let speed = 1;

//if snake moving horisontaly 
let move = 0;
let snakeMovingX;   

//snake settings
let snakeSectionX = (canvas.width) / 2;
let snakeColor = "#0095DD";
// let snakeSectionStatuse = 0;
// let isSectionDraw = 0;


//food setup
let foodX = 30;
let foodY = 30;
let foodColor = "red";

//if button pressed 
let rightPressed = true;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

//score 
let score = 0;
let scoreFactor = 10;

//drawing snake section
function drawSnakeSection(x, y){
    ctx.beginPath();
    ctx.rect(x, y, 15, 15);
    ctx.fillStyle = snakeColor;
    ctx.fill();
    ctx.clearRect(x+6, y+6, 3, 3);
    ctx.closePath();
}

//drawing snake food
function drawSnakeFood(){
    ctx.beginPath();
    ctx.rect(foodX, foodY, 15, 15);
    ctx.fillStyle = foodColor;
    ctx.fill();
    ctx.clearRect(foodX+6, foodY+6, 3, 3);
    ctx.closePath();
}

//checking if buttons pressed
document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
    if((e.key == "Right" || e.key == "ArrowRight") && !leftPressed) {
        rightPressed = true;
        leftPressed = false;
        upPressed = false;
        downPressed = false;
    }
    else if((e.key == "Left" || e.key == "ArrowLeft") && !rightPressed) {
        leftPressed = true;
        rightPressed = false;
        upPressed = false;
        downPressed = false;
    }
    else if((e.key == "Up" || e.key == "ArrowUp") && !downPressed) {
        upPressed = true;
        rightPressed = false;
        leftPressed = false;
        downPressed = false;
    }
    else if((e.key == "Down" || e.key == "ArrowDown") && !upPressed) {
        downPressed = true;
        rightPressed = false;
        leftPressed = false;
        upPressed = false;
    }
}


//empty canvas sections
let snake = [];
for(let c=0; c<canvasColumns; c++){
    snake[c] = [];
    for(let r=0; r<canvasRows; r++){
        snake[c][r] = {x: 0, y: 0, snakeSectionStatuse: 0, isSectionDraw: 0, stepN: 0}
        
    }
}

//setting up canvas sections
for(let c=0; c<canvasColumns; c++){
    for(let r=0; r<canvasRows; r++){
        snakeSectionX = (c*15);
        snakeSectionY = (r*15);
        snake[c][r].x = snakeSectionX;
        snake[c][r].y = snakeSectionY;
    }
}

function snakeMoveDravingCalc() {
  if (downPressed || rightPressed) {
    for (let c = 0; c < canvasColumns; c++) {
      for (let r = 0; r < canvasRows; r++) {

        if (snake[c][r].snakeSectionStatuse == 1) {
          snake[c][r].snakeSectionStatuse = 0;
          if (snake[c][r].isSectionDraw == 0) {
            move++;

            snake[c][r].isSectionDraw = 1;
            snake[c][r].stepN = move;
            if(!ifSnakeCollideFood(c, r)) {
                removeSectionFromDrawing();
                
                
            }else{

                newPieceFoodDrawing();
                score++;
            }
          } else {
            gameOver();
          }
          if (downPressed) {
            snakeToDown(c, r);
            return;
          } else if (rightPressed) {
            snakeToRight(c, r);
            return;
          }
        }
      }
    }
  }
  if(leftPressed || upPressed){
      for(let c=canvasColumns-1; c >= 0; c--){
          for(let r=canvasRows-1; r>=0; r--){
            if (snake[c][r].snakeSectionStatuse == 1){
                snake[c][r].snakeSectionStatuse = 0;
                if (snake[c][r].isSectionDraw == 0) {
                    move++;

                    snake[c][r].isSectionDraw = 1;
                    snake[c][r].stepN = move;
                    
                    if(!ifSnakeCollideFood(c, r)) {
                        // alert("You are the champ");
                        removeSectionFromDrawing();
                        
                    }else{
                        newPieceFoodDrawing();
                        score++;
                    }
                  } else {
                    gameOver();
                  }
                  if(leftPressed){
                    snakeToLeft(c, r);
                    return;
                  }else if(upPressed){
                    snakeToTop(c, r);
                    return;
                  }
                }
          }
      }
  }
}

function removeSectionFromDrawing(){
    let minValue = snake[0][0].stepN;

    //looking for the first step of snake
    for (let c = 0; c < canvasColumns; c++) {
        for (let r = 0; r < canvasRows; r++){
            // console.log(snake[c][r].stepN);
            if(minValue>snake[c][r].stepN && snake[c][r].stepN>0){
                minValue = snake[c][r].stepN;
            } 
        }
    }
    
    for (let c = 0; c < canvasColumns; c++) {
        for (let r = 0; r < canvasRows; r++){
            // console.log(snake[c][r].stepN);
            if(snake[c][r].stepN == minValue){
                snake[c][r].isSectionDraw = 0;
                snake[c][r].stepN = move;
                // console.log(snake[c][r].stepN);
            } 
        }
    }
}


//snake speed
function speedIncrease(){
    if((canvasRows*canvasColumns/2)< score && speed == 4){
        speed++;
        fps+=3;
    }
    else if((canvasRows*canvasColumns/4)< score && speed == 3){
        speed++;
        fps+=3;
    }
    else if((canvasRows*canvasColumns/8)< score && speed == 2){
        speed++;
        fps+=3;
    }
    else if((canvasRows*canvasColumns/16)< score && speed == 1){
        speed++;
        fps+=3;
    }
    
}

//snake starting section
snake[3][3].snakeSectionStatuse = 1;

function snekeMove(){
    for(let c=0; c<canvasColumns; c++){
        for(let r=0; r<canvasRows; r++){
            if(snake[c][r].isSectionDraw == 1)
            {
                drawSnakeSection(snake[c][r].x, snake[c][r].y);
            }
        }
    }
}

//add mark to next section on bottom
function snakeToDown(c, r){
    if (r < canvasRows - 1) {
        snake[c][r + 1].snakeSectionStatuse = 1;
    } else {
    snake[c][0].snakeSectionStatuse = 1;
    }
}
//add mark to next section on right
function snakeToRight(c, r){
    if (c < canvasColumns - 1) {
    snake[c + 1][r].snakeSectionStatuse = 1;
    } else {
    snake[0][r].snakeSectionStatuse = 1;
    }
}
//add mark to prev section on left
function snakeToLeft(c, r){
    if (c > 0) {
    snake[c - 1][r].snakeSectionStatuse = 1;
    } else {
    snake[canvasColumns-1][r].snakeSectionStatuse = 1;
    }
}
//add mark to next section on top
function snakeToTop(c, r){
    if (r > 0) {
    snake[c][r-1].snakeSectionStatuse = 1;
    } else {
    snake[c][canvasRows-1].snakeSectionStatuse = 1;
    }
}

//checking if first section of snake colliding with food
function ifSnakeCollideFood(c, r){
   return snake[c][r].x == foodX && snake[c][r].x < foodX+15 && snake[c][r].y == foodY && snake[c][r].y < foodY+15;
}

//drawing randomly new piece of food
function newPieceFoodDrawing(){
    for (;;){
        let foodXRandom = Math.floor(Math.floor(Math.random() * (canvas.width - 15 + 1))/15)*15;
        let foodYRandom = Math.floor(Math.floor(Math.random() * (canvas.height - 15 + 1))/15)*15;
        if(foodXRandom!=foodX || foodYRandom!=foodY){
            if(snake[foodXRandom/15][foodYRandom/15].isSectionDraw != 1){
                foodX = foodXRandom;
                foodY = foodYRandom;
                console.log(foodXRandom, foodYRandom);
                console.log(foodX, foodY);
                return;
            }
        }
    }
}


function gameOver(){
    alert("You Loose! \n Your score is: " + score*scoreFactor);
    document.location.reload();
}

function youWon(){
    if(score == (canvasColumns*canvasRows)-1){
        alert("YOU WIN, CONGRATULATIONS! \n Your score is: " + score*scoreFactor);
        document.location.reload();
    }
}

//score drawing
function scoreDrawing(){
    document.getElementById("score").innerHTML = score*scoreFactor; 
}

//speed drawing
function speedDrawing(){
    document.getElementById("speed").innerHTML = speed; 
}

//drawing all game components
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // drawSnakeSection();
    

    
    snakeMoveDravingCalc();
    snekeMove();
    speedIncrease();
    drawSnakeFood();
    scoreDrawing();
    speedDrawing();
    youWon();
   
    
    //checking if snake touching right wall
    if(x + dx > canvas.width) {
        x = 0;
    }
    //checking if snake touching left wall
    if(x < 0) {
        x = canvas.width - 15;
    }
    //checking if snake touching top wall
    if(y + dy > canvas.height) {
        y = 0;
    }
    //checking if snake touching bottom wall
    if(y < 0) {
        y = canvas.height - 15;
    }
    
    setTimeout(function(){ //throttle requestAnimationFrame to 20fps
        requestAnimationFrame(draw)
    }, 1000/fps);

    
}

draw();