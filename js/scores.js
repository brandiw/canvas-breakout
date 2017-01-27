function gameOver(score, canvas){
  var scores = getHighScores();

  if(scores.length < SCORE_SLOTS || scores[SCORE_SLOTS - 1].score < score){
    //Add initials prompt
    swal({
      title: "New High Score!",
      text: "Please enter your initials:",
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      inputPlaceholder: "Write something"
    },
    function(inputValue){
      if (!inputValue) return false;

      if (inputValue.length < 3 || inputValue.length > 25) {
        swal.showInputError("You need to write between 3 and 25 letters!");
        return false;
      }

      addNewScore(inputValue, score, scores);

      swal("Nice!", "Thanks, " + inputValue + ", ");
      swal({
        title: "Nice!",
        text: "Thanks " + inputValue + ", your victory has been recorded!!",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: "Sweet! Let's see how I did!",
        closeOnConfirm: true
      },
      function(){
        displayHighScores(canvas);
      });
    });
  }
  else{
    swal({
        title: "Nice Try!",
        text: "You didn't get a high score... better luck next time!",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: "Oh well!",
        closeOnConfirm: true
      },
      function(){
        displayHighScores(canvas);
      });
  }
}

function getHighScores(){
  var scores;
  if(localStorage.breakoutScores){
    scores = JSON.parse(localStorage.breakoutScores)
  }

  if(!scores){
    scores = [];
  }

  return scores;
}

function addNewScore(name, score, allScores){
  allScores.push({name: name, score: score});
  allScores.sort(function(a, b){
    return b.score > a.score;
  });

  allScores = allScores.slice(0, SCORE_SLOTS);
  localStorage.breakoutScores = JSON.stringify(allScores);
}

function displayHighScores(canvas){
  $('#currentScore').addClass('hidden');
  var scores = getHighScores();
  clearCanvas(canvas);
  canvas.font = '24px PressStart';
  canvas.fillStyle = '#fff';
  canvas.fillText("HIGH SCORES", 165, 75);

  canvas.font = '18px PressStart';
  for(var i = 0; i < scores.length; i++){
    canvas.fillText((i + 1) + ". " + scores[i].name + " - " + scores[i].score, 190, 150 + 50 * i);
  }

  canvas.font = '16px PressStart';
  canvas.fillText("Press enter to return to main screen", 50, 450);
}
