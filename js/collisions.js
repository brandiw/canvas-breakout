// COLLISION DETECTION
function detectCollisions(){
  //Don't let the bumper go off the screen
  if(locations.bumper.x > 0 && keys.left){
    locations.bumper.x -= BUMPER_SPEED;
  }
  else if(locations.bumper.x < CANVAS_WIDTH - BUMPER_WIDTH && keys.right){
    locations.bumper.x += BUMPER_SPEED;
  }

  //Bumper Collision with Ball
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

  //Detect Ball Fell Off Screen (bottom)
  if(locations.ball.y > CANVAS_HEIGHT || noBricksAlive()){
    state = 'gameover';
    clearInterval(gameInterval);
    updateGameState();
  }

  //Brick Collision
  for(var i = 0; i < bricks.length; i++){
    for(var j = 0; j < bricks[i].length; j++){
      if(hasOverlap(bricks[i][j], locations.ball)){
        score = collideBrick(i, j, ballspeed, score);
        break;
      }
    }
  }
}

function hasOverlap(brick, ball){
  if(brick.state == "alive"){
    if(brick.y + BRICK_HEIGHT >= ball.y && brick.y <= ball.y ||
        brick.y + BRICK_HEIGHT >= ball.y + BALL_WIDTH && brick.y <= ball.y + BALL_WIDTH ||
        brick.y + BRICK_HEIGHT >= ball.y - BALL_WIDTH && brick.y <= ball.y - BALL_WIDTH){
      if(ball.x >= brick.x && ball.x <= brick.x + BRICK_WIDTH ||
          ball.x + BALL_WIDTH >= brick.x && ball.x + BALL_WIDTH <= brick.x + BRICK_WIDTH ||
          ball.x - BALL_WIDTH >= brick.x && ball.x - BALL_WIDTH <= brick.x + BRICK_WIDTH){
        return true;
      } //X Match
    } //Y Match
  }

  return false;
}

// COLLISION RESULT
function collideBrick(i, j, ballspeed, score){
  bricks[i][j].state = "destroyed";
  ballspeed.y = -ballspeed.y;
  score += 100;
  updateScore(score);
  return score;
}

// CHECK ALIVE STATE
function noBricksAlive(){
  for(var i = 0; i < BRICK_ROWS; i++){
    for(var j = 0; j < BRICK_COLUMNS; j++){
      if(bricks[i][j].state == "alive"){
        return false;
      }
    }
  }
  return true;
}
