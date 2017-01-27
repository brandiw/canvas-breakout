// GENERAL CANVAS HELPERS
function drawRectangle(canvas, x, y, width, height){
  canvas.beginPath();
  canvas.rect(x, y, width, height);
  canvas.closePath();
  canvas.fill();
}

function drawCircle(canvas, x, y, radius){
  canvas.beginPath();
  canvas.arc(x, y, radius, 0, Math.PI * 2, true);
  canvas.closePath();
  canvas.fill();
}

function clearCanvas(canvas){
  canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// INITIAL STATE
function fadeOut(canvas, text, x, y) {
    var alpha = 1.0;   // full opacity
    var textInterval = setInterval(function () {
      clearCanvas(canvas);
      canvas.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
      canvas.font = "24px 'PressStart'";
      canvas.fillText(text, x, y);
      alpha = alpha - 0.06;
      if (alpha < 0) {
        clearInterval(textInterval);
        drawScreen(canvas, "#fff");
      }
    }, 60);
}

function drawScreen(canvas, color){
  if(state == 'initial'){
    clearCanvas(canvas);
    canvas.font = '24px PressStart';
    canvas.fillStyle = color;
    canvas.fillText("Canvas Breakout", 165, 75);

    canvas.font = '20px PressStart';
    canvas.fillText("1. New Game", 190, 150);
    canvas.fillText("2. High Scores", 190, 225);
    canvas.fillText("3. How to Play", 190, 300);

    canvas.font = '16px PressStart';
    canvas.fillText("Press Spacebar to Start", 165, 450);
  }
}

function displayRules(canvas){
  clearCanvas(canvas);
  canvas.font = '22px PressStart';
  canvas.fillStyle = '#fff';
  canvas.fillText("How to Play Canvas Breakout", 50, 75);

  canvas.font = '16px PressStart';
  canvas.fillText("Press left and right arrows to move", 70, 150);
  canvas.fillText("Try to hit the bricks with the ball", 70, 200);
  canvas.fillText("Don't fall down!", 70, 250);

  canvas.font = '14px PressStart';
  canvas.fillText("Press enter to return", 165, 450);
}

// GAME STATE
function drawPlayer(canvas, ball, bumper){
  //Set up ball and bumper
  canvas.fillStyle = "#fff";
  drawRectangle(canvas, bumper.x, bumper.y, BUMPER_WIDTH, 5);
  drawCircle(canvas, ball.x, ball.y, BALL_WIDTH);
}

function reDrawBricks(canvas, bricks){
  for(var i = 0; i < BRICK_ROWS; i++){
    for(var j = 0; j < BRICK_COLUMNS; j++){
      canvas.fillStyle = BRICK_COLORS[j % BRICK_COLUMNS];
      if(bricks[i][j].state == "alive"){
        drawRectangle(canvas, i * BRICK_WIDTH + i * BRICK_SPACE, j * BRICK_HEIGHT + j * BRICK_SPACE, BRICK_WIDTH, BRICK_HEIGHT);
      }
    }
  }
}

function updateScore(newScore){
  $('#currentScoreDisplay').empty().append(newScore);
}
