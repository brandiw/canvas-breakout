// GLOBAL VARS
var canvas = null;
var state = 'initial';
var score = 0;
var ballspeed;
var gameInterval, effectInterval;
var bricks = [];
var keys;
var locations;

// DOCUMENT READY
$(document).ready(function(){
  canvas = $('#canvas')[0].getContext("2d");
  updateGameState();
});

// INITIALIZATION FUNCTIONS
function updateGameState(){
  switch(state){
    case 'initial':
      $('#currentScore').addClass('hidden');
      setInitialState();
      flashWelcome("Welcome Player One", 140, 250);
      break;
    case 'game':
      clearInterval(effectInterval);
      $('#currentScore').removeClass('hidden');
      initGame();
      gameInterval = setInterval(gameLoop, GAME_LOOP);
      break;
    case 'scores':
      displayHighScores(canvas);
      break;
    case 'rules':
      displayRules(canvas);
      break;
    case 'paused':
      $('#currentScore').removeClass('hidden');
      console.log('on pause');
      break;
    case 'gameover':
      this.state = 'scores';
      gameOver(score, canvas);
      break;
  }
}

function setInitialState(){
  score = 0;
  ballspeed = BALL_SPEED;
  locations = {bumper: {x: 325, y: 450}, ball: {x: 340, y: 200}};
  keys = {left: false, right: false};
}

function alternateColors(){
  effectInterval = setInterval(function(){
    var red = Math.floor(Math.random() * 255);
    var green = Math.floor(Math.random() * 255);
    var blue = Math.floor(Math.random() * 255);
    var color ="rgba(" + red + ", " + green + ", " + blue + ", 100)";
    drawScreen(canvas, color);
  }, 1500);
}

function flashWelcome(text, x, y) {
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
      alternateColors();
    }
  }, 60);
}

function initGame(){
  initBricks();
  drawPlayer(canvas, locations.ball, locations.bumper);
}

function initBricks(){
  bricks = [];
  for(var i = 0; i < BRICK_ROWS; i++){
    bricks.push([]);
    for(var j = 0; j < BRICK_COLUMNS; j++){
      canvas.fillStyle = BRICK_COLORS[j % BRICK_COLUMNS];
      bricks[i].push({state: "alive", x: i * BRICK_WIDTH + i * BRICK_SPACE, y: j * BRICK_HEIGHT + j * BRICK_SPACE});
      drawRectangle(canvas, i * BRICK_WIDTH + i * BRICK_SPACE, j * BRICK_HEIGHT + j * BRICK_SPACE, BRICK_WIDTH, BRICK_HEIGHT);
    }
  }
}

// KEYBOARD PRESS EVENTS
$(document).keydown(function(e){
  switch(state) {
    case 'initial':
      switch(e.keyCode){
        case 32: //Spacebar
        case 49: //Number 1
          state = 'game';
          updateGameState();
          break;
        case 50:
          state = 'scores';
          updateGameState();
          break;
        case 51:
          state = 'rules';
          updateGameState();
      }
      break
    case 'game':
      switch(e.keyCode){
        case 37: //Left Arrow
          keys.left = true;
          break;
        case 39: //Right Arrow
          keys.right = true;
          break;
      }
      break;
    case 'scores':
    case 'rules':
      if(e.keyCode == 13){
        state = 'initial';
        updateGameState();
      }
      break;
  }

});

$(document).keyup(function(e){
  switch(state){
    case 'initial':
      break;
    case 'game':
      switch(e.keyCode){
        case 37: //Left Arrow
          keys.left = false;
          break;
        case 39: //Right Arrow
          keys.right = false;
          break;
      }
      break;
    case 'paused':
      break;
  }
});

// GAME LOGIC
function gameLoop(){
  //Move stuff
  locations.ball.x += ballspeed.x;
  locations.ball.y += ballspeed.y;

  if(locations.bumper.x > 0 && keys.left){
    locations.bumper.x -= BUMPER_SPEED;
  }
  else if(locations.bumper.x < CANVAS_WIDTH - BUMPER_WIDTH && keys.right){
    locations.bumper.x += BUMPER_SPEED;
  }

  //Detect Collisions
  //Bumper Collision
  if(locations.ball.y > locations.bumper.y - BRICK_SPACE && locations.ball.y <= locations.bumper.y){
    if(locations.ball.x + BALL_WIDTH > locations.bumper.x &&
      locations.ball.x - BALL_WIDTH < locations.bumper.x + BUMPER_WIDTH){
      ballspeed.y = -ballspeed.y;
      if(keys.left){
        ballspeed.x -= 2;
      }
      else if(keys.right){
        ballspeed.x += 2;
      }
    }
  }

  //Wall Collision
  if(locations.ball.x < 0 + BALL_WIDTH || locations.ball.x > CANVAS_WIDTH - BALL_WIDTH){
    ballspeed.x = -ballspeed.x;
  }

  //Ceiling Collision
  if(locations.ball.y < 0 + BALL_WIDTH){
    ballspeed.y = -ballspeed.y;
  }

  //Detect Fell Off Screen
  if(locations.ball.y > CANVAS_HEIGHT || noBricksAlive(bricks)){
    state = 'gameover';
    clearInterval(gameInterval);
    updateGameState();
  }

  //Brick Collision
  for(var i = 0; i < bricks.length; i++){
    for(var j = 0; j < bricks[i].length; j++){
      if(hasOverlap(bricks[i][j], locations.ball)){
        score = collideBrick(bricks, i, j, ballspeed, score);
        break;
      }
    }
  }

  //wipe and redraw stuff
  clearCanvas(canvas);
  drawPlayer(canvas, locations.ball, locations.bumper);

  //Redraw bricks
  reDrawBricks(canvas, bricks);
}
