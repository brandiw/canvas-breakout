// COLLISION DETECTION
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
