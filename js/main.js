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
      flashWelcome("Welcome Player One", 140, 250);
      break;
    case 'game':
      clearInterval(effectInterval);
      initGame();
      gameInterval = setInterval(gameLoop, GAME_LOOP);
      break;
    case 'scores':
      displayHighScores();
      break;
    case 'rules':
      displayRules();
      break;
    case 'paused':
      clearInterval(gameInterval);
      break;
    case 'gameover':
      this.state = 'scores';
      gameOver();
      break;
  }
}

function initGame(){
  //Initial values
  score = 0;
  ballspeed = {x: BALL_SPEED.x, y: BALL_SPEED.y};
  locations = {bumper: {x: 325, y: 450}, ball: {x: 340, y: 200}};
  keys = {left: false, right: false};

  //Set score to 0
  updateScore(score);
  $('#currentScore').removeClass('hidden');

  //Draw initial state
  initBricks();
  drawPlayer(locations.ball, locations.bumper);
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
        case 13: //Enter key
        case 32: //Spacebar
        case 49: //Number 1
          state = 'game';
          updateGameState();
          break;
        case 50: //Number 2
          state = 'scores';
          updateGameState();
          break;
        case 51: //Number 3
          state = 'rules';
          updateGameState();
          break;
      }
      break;
    case 'game':
      switch(e.keyCode){
        case 32: //Spacebar
          state = 'paused';
          updateGameState();
          break;
        case 37: //Left Arrow
          keys.left = true;
          break;
        case 39: //Right Arrow
          keys.right = true;
          break;
      }
      break;
    case 'paused':
      switch(e.keyCode){
        case 32: //Spacebar
          state = 'game';
          gameInterval = setInterval(gameLoop, GAME_LOOP);
          break;
      }
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
  }
});

// GAME LOGIC
function gameLoop(){
  //Move the ball by the speed it is going
  locations.ball.x += ballspeed.x;
  locations.ball.y += ballspeed.y;

  //Perform Collision Detections
  detectCollisions();

  //wipe and redraw stuff
  clearCanvas();
  drawPlayer(locations.ball, locations.bumper);
  reDrawBricks();
}
