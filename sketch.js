// Anay 2021, this project took 4 tries at the minimax algorithm and way too much time

var board =
  [
    ['_', '_', '_'],
    ['_', '_', '_'],
    ['_', '_', '_'],
  ];

var cell = 200;
var extraX = 200;
var extraY = 100;

var turn = 1;

const allEqual = arr => arr.every(v => v === arr[0])

var gamestate = 'play';

var font1;

var xWins = 0, yWins = 0;

var games = 1;

var maxDepth = -1;

var bestMoves = [];

var cnv, sel, cnvmargin;

const sleep = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

function preload() {
  font1 = loadFont('StyleScript-Regular.ttf')
}

function setup() {
  cnv = createCanvas(1000, 800);
  cnv.parent('sketch-holder');

  if (games % 2 == 0) {
    turn = 2;
  }

  push();
  sel = createSelect('Depth');
  sel.position(900 + cnv.elt.offsetLeft, 550);
  // sel.parent("sketch-holder");
  sel.option('Unlimited');
  sel.option('1');
  sel.option('2');
  sel.option('3');
  sel.option('4');
  sel.changed(changeDepth);
  pop();
}

function draw() {
  background(0);

  // cnvmargin = window.innerWidth - 1000;
  // cnvmargin = cnvmargin/2;
  // sel.style('marginLeft: ' + cnvmargin + 'pt');
  sel.position(900 + cnv.elt.offsetLeft, 550);

  push();
  // fill('white');
  noFill();
  strokeWeight(5);
  stroke(0, 90, 175);
  rect(extraX, extraY, cell * 3, cell * 3);
  line(400, 100, 400, 700);
  line(600, 100, 600, 700);
  line(200, 300, 800, 300);
  line(200, 500, 800, 500);
  pop();

  yes();

  if (turn % 2 == 0 && gamestate == 'play') {
    // console.log(turn, board);
    // decideMove();
    // moveStuff();
    // bestMove(board, 0, turn);
    whyLife(board, 0, turn);
    turn++
    check();
  }

  // check();

  push();
  fill('pink');
  textSize(25);
  text('Game: ' + games, 850, 25);
  textAlign(CENTER);
  textSize(75);
  if (gamestate == 'play'){
    textFont(font1);
    fill('red');
    text('Tic-Tac-Toe', 500, 75);
  } else {
    // textFont(font1);
    fill('orange');
    text(gamestate, 500, 75);
  }
  pop();

  push();
  noFill();
  if (turn % 2 == 1 && gamestate == 'play') {
    stroke('white');
    strokeWeight(30);
    circle(100, 250, 100);
  } else if (gamestate == 'O won!') {
    stroke('Orange');
    strokeWeight(30);
    circle(100, 250, 100);
  }
  stroke('green');
  strokeWeight(15);
  noFill();
  circle(100, 250, 100);
  noStroke();
  fill('green');
  textSize(150);
  textAlign(CENTER);
  text(yWins, 100, 500);
  pop();

  push();
  if (turn % 2 == 0 && gamestate == 'play') {
    stroke('white');
    strokeWeight(25);
    line(850, 200, 950, 300);
    line(850, 300, 950, 200);
  } else if (gamestate == 'X won!') {
    stroke('Orange');
    strokeWeight(25);
    line(850, 200, 950, 300);
    line(850, 300, 950, 200);
  }
  strokeWeight(15);
  stroke('red');
  line(850, 200, 950, 300);
  line(850, 300, 950, 200);
  noStroke();
  fill('red');
  textSize(150);
  textAlign(CENTER);
  text(xWins, 900, 500);
  fill('orange');
  textSize(25);
  text('AI Depth: ', 855, 565);
  pop();

  // push();
  // fill('white');
  // text(Math.round(mouseX), 10, 15);
  // text(Math.round(mouseY), 35, 15);
  // pop();
}

function changeDepth() {
  var localDepth = sel.value();
  if (localDepth == 'Unlimited') {
    maxDepth = -1;
  } else {
    maxDepth = localDepth;
  }
}

function mousePressed() {
  // check();

  if (gamestate == 'play') {
    var mX = mouseX;
    var mY = mouseY;
    var X = Math.round((mX - 100) / 200) - 1;
    var Y = Math.round((mY - 200) / 200);
    // console.log(Math.round((mX-100)/200));
    // console.log(X, Y);

    // board[Y].splice(X, 1, 'Xg');

    if (inRange(X, 0, 2) && inRange(Y, 0, 2)) {
      if (board[Y][X] != 'X' && board[Y][X] != 'O') {
        turn++ // this is wierd normally i would change it after doing the turn
        if (turn % 2 == 1) { // if i change turn after the actual turn this would be  turn % 2 == 0
          // board[Y].splice(X, 1, 'X');
        }
        else if (turn % 2 == 0){ // if i change turn after the actual turn this would be  turn % 2 == 1
          board[Y].splice(X, 1, 'O');
        }
      }
    }
    check();
  } else {
    board =
      [
        ['_', '_', '_'],
        ['_', '_', '_'],
        ['_', '_', '_'],
      ];
    if (games % 2 == 0) {
      turn = 2;
      t2 = 'yes';
    } else {
      turn = 1;
      t2 = 'no';
    }
    gamestate = 'play';
    loop();
  }

  // console.log(board);
}

function inRange(x, min, max) {
  return ((x - min) * (x - max) <= 0);
}

async function yes() {
  check(); // we should not have to check here if we check before comp makes move and before player
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (board[i][j] == 'O') {
        // console.log(j, i)
        // console.log(j * cell + 300, i * cell + 200)
        push();
        stroke('green');
        strokeWeight(15);
        noFill();
        circle(j * cell + 300, i * cell + 200, 100);
        pop();
      } else if (board[i][j] == 'X') {
        push();
        stroke('red');
        strokeWeight(15);
        // console.log(j, i);
        line(j * cell + 250, i * cell + 150, j * cell + 350, i * cell + 250);
        line(j * cell + 250, i * cell + 250, j * cell + 350, i * cell + 150);
        pop();
      }
    }
  }

  if (gamestate != 'play' && gamestate != 'start') {
    if (gamestate == 'O won!') {
      yWins++
      noLoop();
    } else if (gamestate == 'X won!') {
      xWins++
      noLoop();
    } else {
      noLoop();
    }
    games++
    // console.log(board);
    // background(0);
    sel.position(900 + cnv.elt.offsetLeft, 550);
    push();
    textAlign(CENTER);
    textSize(250);
    fill('Orange');
    // text(gamestate, 500, 500);
    textSize(25);
    text('Press R or Left Click to restart!', 500, 750);
    pop();
  }
}

function keyPressed() {
  // console.log(keyCode);
  if (keyCode == 82) {
    board =
      [
        ['_', '_', '_'],
        ['_', '_', '_'],
        ['_', '_', '_'],
      ];
    if (games % 2 == 0) {
      turn = 2;
    } else {
      turn = 1;
    }
    gamestate = 'play';
    loop();
  } else if (keyCode == 70) {
    check();
    sel.position(900 + cnv.elt.offsetLeft, 550);
  }
}

function check() {
  var columns = [
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],
  ];
  var diagonals = [
    [board[0][0], board[1][1], board[2][2]],
    [board[2][0], board[1][1], board[0][2]],
  ]
  // console.log(columns);

  for (var i = 0; i < 3; i++) {
    if (allEqual(columns[i]) && columns[i][1] != '_') {
      console.log(columns[i][1] + ' won! (column)');
      gamestate = columns[i][1] + ' won!';
    } else if (allEqual(board[i]) && board[i][1] != '_') {
      console.log(board[i][1] + ' won! (row)');
      gamestate = board[i][1] + ' won!';
    }
  }
  for (var i = 0; i < 2; i++) {
    if (allEqual(diagonals[i]) && diagonals[i][1] != '_') {
      console.log(diagonals[i][1] + ' won! (diagonal)');
      gamestate = diagonals[i][1] + ' won!';
    }
  }

  var idk = 0;
  for (var i = 0; i < 3; i++) {
    if (board[i].includes('_') == false && gamestate == 'play') {
      // console.log(board[i].includes('_'));
      // console.log(idk, i);
      idk++
      // console.log(idk, i);
    }
    if (idk == 3) {
      console.log('Tie!')
      gamestate = 'Tie!';
    }
  }
}

function checkBoard(bd1) {
  var columns = [
    [bd1[0][0], bd1[1][0], bd1[2][0]],
    [bd1[0][1], bd1[1][1], bd1[2][1]],
    [bd1[0][2], bd1[1][2], bd1[2][2]],
  ];
  var diagonals = [
    [bd1[0][0], bd1[1][1], bd1[2][2]],
    [bd1[2][0], bd1[1][1], bd1[0][2]],
  ]
  // console.log(columns);

  for (var i = 0; i < 3; i++) {
    if (allEqual(columns[i]) && columns[i][1] != '_') {
      if (columns[i][1] == 'X') {
        return 'X';
      } else {
        return 'O';
      }
    } else if (allEqual(bd1[i]) && bd1[i][1] != '_') {
      if (bd1[i][1] == 'X') {
        return 'X';
      } else {
        return 'O';
      }
    }
  }
  for (var i = 0; i < 2; i++) {
    if (allEqual(diagonals[i]) && diagonals[i][1] != '_') {
      if (diagonals[i][1] == 'X') {
        return 'X';
      } else {
        return 'O';
      }
    }
  }

  var idk = 0;
  for (var i = 0; i < 3; i++) {
    if (bd1[i].includes('_') == false && gamestate == 'play') {
      idk++
    }
    if (idk == 3) {
      return 'Tie';
    }
  }

  return 'no';
}

function bestMove(bd, depth, tn) { // not the best eh... not impossible to beat and wierd but works ig as an easy ai

  // var bed = bd;

  // console.log('start', board[0]);
  // console.log(depth, bed, board);
  // console.log(depth, bed[2][1] = 'O');
  // console.log(bd[1][1] = 'X');
  // console.log(bd);
  // console.log(bd[1].splice(1, 1, 'X'));

  if (checkBoard(bd) != 'no' || depth == maxDepth) {
    // console.log('checkboard', depth, board[1]);
    if (checkBoard(bd) == 'X') {
      return 100 - depth;
    } else {
      return -100 + depth;
    }
  }

  if (tn % 2 == 0) {
    best = -100;

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (bd[i][j] == '_') {

          // console.log('1', board[0], board[1], board[2]);
          var b1 = bd;
          b1[i].splice(j, 1, 'X');
          // console.log('2', board[0], board[1], board[2]);

          // value = bestMove(bd[i].splice(j, 1, 'X'), depth + 1, tn + 1);
          // value = bestMove(bd[i][j] = 'X', depth + 1, tn + 1);
          value = bestMove(b1, depth + 1, tn + 1);

          b1[i].splice(j, 1, '_');

          if (value > best) {
            bestMoves = [i, j] //i is y axis j is x axis
          }

          best = Math.max(best, value);
        }
      }
    }

    if (depth == 0) { // it never reaches the splice before the board changes

      // b2 = board;
      // b2[bestMoves[0]].splice(bestMoves[1], 1, 'X');
      // console.log(b2, board);
      // console.log('why');
      console.log(board, bestMoves);
      board[bestMoves[0]].splice(bestMoves[1], 1, 'X');
      // console.log(board, bestMoves);
    }
  }

  if (tn % 2 == 1) {
    best = 100;

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (bd[i][j] == '_') {

          // console.log(board[0], board[1], board[2]);
          var b1 = bd;
          b1[i].splice(j, 1, 'O');

          // value = bestMove(bd[i].splice(j, 1, 'O'), depth + 1, tn + 1);
          // value = bestMove(bd[i][j] = 'O', depth + 1, tn + 1);
          value = bestMove(b1, depth + 1, tn + 1);

          b1[i].splice(j, 1, '_');

          if (value < best) {
            bestMoves = [i, j] //i is y axis j is x axis
            // console.log(bestMoves);
          }

          best = Math.min(best, value);
        }
      }
    }

    if (depth == 0) {
      // console.log('why2');
      console.log(board, bestMoves);
      board[bestMoves[0]].splice(bestMoves[1], 1, 'X');
      // console.log(board);
    }
  }
}

function decideMove() {

  best = -100;

  var move = [];

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {

      if (board[i][j] == '_') {

        bd = Array.from(board);
        // console.log(bd[0], bd[1], bd[2], board[0], board[1], board[2]);
        bd[i].splice(j, 1, 'X');

        var score = minimax(bd, 0, turn);

        bd[i].splice(j, 1, '_');

        if (score > best) {
          best = score;
          move = [i, j];
        }
      }
    }
  }

  console.log(board, move);
  board[move[0]].splice(move[1], 1, 'X');
}

function minimax(localBoard, depth, localTurn) {

  if (checkBoard(localBoard) != 'no' || depth == maxDepth) {
    // console.log('checkboard', depth, board[1]);
    if (checkBoard(localBoard) == 'X') {
      return 100 - depth;
    } else {
      return -100 + depth;
    }
  } 

  if (localTurn % 2 == 0) {
    var bestScore = -100;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {

        if (board[i][j] == '_') {

          var bd = Array.from(localBoard);
          // console.log(depth, bd[0], bd[1], bd[2], board[0], board[1], board[2]);

          bd[i].splice(j, 1, 'X');

          localScore = minimax(bd, depth + 1, localTurn + 1);

          board[i].splice(j, 1, '_');

          bestScore = max(bestScore, localScore);
        }
      }
    }

    return bestScore;
  }

  if (localTurn % 2 == 1) {
    var bestScore = 100;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {

        if (board[i][j] == '_') {

          var bd = Array.from(localBoard);
          // console.log(depth, bd[0], bd[1], bd[2], board[0], board[1], board[2]);

          bd[i].splice(j, 1, 'O');

          localScore = minimax(bd, depth + 1, localTurn + 1);

          board[i].splice(j, 1, '_');

          bestScore = min(bestScore, localScore);
        }
      }
    }

    return bestScore;
  }
}

function moveStuff() {
  var bestScore = -Infinity;
  var move;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j ++) {
      if (board[i][j] == '_') {
        board[i][j] = 'X';
        var score = minimaxTry2(board, 0, turn);
        board[i][j] = '_';
        if (score > bestScore) {
          bestScore = score;
          move = [i, j];
        }
      }
    }
  }
  board[move[0]][move[1]] = 'X';
}

function minimaxTry2(localBoard, depth, localTurn) {

  if (checkBoard(localBoard) != 'no' || depth == maxDepth) {
    // console.log('checkboard', depth, board[1]);
    if (checkBoard(localBoard) == 'X') {
      return 100 - depth;
    } else {
      return -100 + depth;
    }
  }

  if (localTurn % 2 == 0) {
    var bestScore = -Infinity;

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j ++) {
        if (board[i][j] == '_') {
          board[i][j] = 'X';
          var score = minimaxTry2(board, depth + 1, localTurn + 1);
          board[i][j] = '_';
          bestScore = max(score, bestScore);
        }
      }
    }

    return bestScore;
  }
  else {
    var bestScore = Infinity;

    for (var i = 0; i < 3; i++){
      for (var j = 0; j < 3; j ++) {
        if (board[i][j] == '_') {
          board[i][j] = 'O';
          var score = minimaxTry2(board, depth + 1, localTurn + 1);
          board[i][j] = '_';
          bestScore = min(score, bestScore);
        }
      }
    }

    return bestScore;
  }
}

function whyLife(localBoard, depth, localTurn) { // remake the alialaa or whatever version idk

  // if (checkBoard(localBoard) != 'no' && depth == maxDepth) { // this does not work for some reason
  //   // console.log('checkboard', depth, board[1]);
  //   console.log(depth, localBoard[0], localBoard[1], localBoard[2])
  //   if (checkBoard(localBoard) == 'X') {
  //     return 100 - depth;
  //   } else if (checkBoard(localBoard) == 'O') {
  //     return -100 + depth;
  //   } else {
  //     return 0;
  //   }
  // }

  if (checkBoard(localBoard) != 'no' || depth == maxDepth) {
    // console.log('checkboard', depth, board[1]);
    if (checkBoard(localBoard) == 'X') {
      return 100 - depth;
    } else if (checkBoard(localBoard) == 'Tie') {
      return 0 + depth;
    } else if (checkBoard(localBoard) == 'O') {
      return -100 + depth;
    } else {
      return 0 - depth;
    }
  } 

  if (localTurn % 2 == 0) {
    var best = -101;

    for (var i = 0; i < 3; i++){
      for (var j = 0; j < 3; j ++) {
        if (localBoard[i][j] == '_') {
          
          var b1 = Array.from(localBoard);
          b1[i].splice(j, 1, 'X');
          
          var score = whyLife(b1, depth + 1, localTurn + 1);

          // console.log(depth, b1[0], b1[1], b1[2]);

          b1[i].splice(j, 1, '_');

          // console.log(depth, score, best);
          if (score > best && depth == 0) {
            // console.log('yue');
            stuff = [i, j]; // y, x or array[i].splice(j, 1, 'replacement');
            // console.log(stuff);
          }

          best = Math.max(best, score);
        }
      }
    }

    if (depth == 0) {
      // console.log(board, stuff);
      board[stuff[0]].splice(stuff[1], 1, 'X');
    }

    return best;
  }

  if (localTurn % 2 == 1) {
    var best = 101;

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (localBoard[i][j] == '_') {

          var b2 = Array.from(localBoard);
          b2[i].splice(j, 1, 'O');

          var score = whyLife(b2, depth + 1, localTurn + 1);

          b2[i].splice(j, 1, '_');

          if (score < best && depth == 0) {
            move = [i, j];
          }

          best = Math.min(best, score);
        }
      }
    }

    return best;
  }
}
