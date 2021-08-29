// dir array pending moves credit goes to sflanker

const cellSize = 20;
const rows = 30; // rows >= 10
const cols = 30; // cols >= 10
let speed = 14;

const canvasWidth = cols * cellSize;
const canvasHeight = rows * cellSize;

const LEFT = new p5.Vector(-1, 0);
const RIGHT = new p5.Vector(1, 0);
const UP = new p5.Vector(0, -1);
const DOWN = new p5.Vector(0, 1);

const INIT = 1;
const PLAYING = 2;
const PAUSED = 3;
const GAME_OVER = 4;

let phase = INIT;

let snake = [];
let dir;
let apple = [];
let eaten;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  initGameState();
  frameRate(speed);
}

function initGameState() {
  snake = [
    new p5.Vector(cellSize * 4, cellSize * 4),
    new p5.Vector(cellSize * + 4 + cellSize, cellSize * 4),
    new p5.Vector(cellSize * + 4 + cellSize * 2, cellSize * +4),
  ];
  dir = RIGHT;
  eaten = 0;
  apple = [new p5.Vector(4 * cellSize, 6 * cellSize)];
}

function randomApplePosition() {
  apple.pop();
  apple.push(
    new p5.Vector(
      round(random(0, cols - 1)) * cellSize,
      round(random(0, rows - 1)) * cellSize
    )
  );

  for (let i = 0; i <= snake.length - 1; i++) {
    if (apple[0].x === snake[i].x && apple[0].y === snake[i].y) {
      randomApplePosition();
    }
  }
}

// MAIN DRAW LOOP //////////////////////////////////////////

function draw() {
  background("beige");
  drawGrid();
  moveSnake();
  drawApple();
  drawSnake();
  drawSnakeEyes();
  checkApple();
  checkCollisions();
}

// HELPER DRAW FUNCTIONS ///////////////////////////////////

function drawGrid() {
  noStroke();
  for (let i = 0; i < cols; i++) {
    strokeWeight(1);
    line(i * cellSize, 0, i * cellSize, canvasHeight);
  }
  for (let i = 0; i < rows; i++) {
    strokeWeight(1);
    line(0, i * cellSize, canvasWidth, i * cellSize);
  }
}

function drawSnakeEyes() {
  if (dir === RIGHT) {
    fill("#fc0303");
    circle(
      snake[snake.length - 1].x + (cellSize / 4) * 3,
      snake[snake.length - 1].y + cellSize / 4,
      cellSize / 4
    );
    circle(
      snake[snake.length - 1].x + (cellSize / 4) * 3,
      snake[snake.length - 1].y + (cellSize / 4) * 3,
      cellSize / 4
    );
  }
  if (dir === LEFT) {
    fill("#fc0303");
    circle(
      snake[snake.length - 1].x + cellSize / 4,
      snake[snake.length - 1].y + cellSize / 4,
      cellSize / 4
    );
    circle(
      snake[snake.length - 1].x + cellSize / 4,
      snake[snake.length - 1].y + (cellSize / 4) * 3,
      cellSize / 4
    );
  }
  if (dir === UP) {
    fill("#fc0303");
    circle(
      snake[snake.length - 1].x + cellSize / 4,
      snake[snake.length - 1].y + cellSize / 4,
      cellSize / 4
    );
    circle(
      snake[snake.length - 1].x + (cellSize / 4) * 3,
      snake[snake.length - 1].y + cellSize / 4,
      cellSize / 4
    );
  }
  if (dir === DOWN) {
    fill("#fc0303");
    circle(
      snake[snake.length - 1].x + cellSize / 4,
      snake[snake.length - 1].y + (cellSize / 4) * 3,
      cellSize / 4
    );
    circle(
      snake[snake.length - 1].x + (cellSize / 4) * 3,
      snake[snake.length - 1].y + (cellSize / 4) * 3,
      cellSize / 4
    );
  }
}

function drawSnake() {
  stroke(1);
  if (phase === GAME_OVER) {
    for (let i = 0; i <= snake.length - 1; i++) {
      fill("red");
      square(snake[i].x, snake[i].y, cellSize);
    }
    textSize(cellSize * 1.6);
    text("Game Over! Press r to restart.", 10, 30);
  }

  if (phase === PLAYING) {
    for (let i = 0; i <= snake.length - 1; i++) {
      fill("green");
      square(snake[i].x, snake[i].y, cellSize);
    }
  }
  if (phase === INIT) {
    for (let i = 0; i <= snake.length - 1; i++) {
      fill("green");
      square(snake[i].x, snake[i].y, cellSize);
    }
  }
  if (phase === PAUSED) {
    for (let i = 0; i <= snake.length - 1; i++) {
      fill("gold");
      square(snake[i].x, snake[i].y, cellSize);
    }
  }
  fill("darkblue");
  textSize(20);
  text(eaten, canvasWidth - 47, canvasHeight - 40);
}
function drawApple() {
  stroke(1);
  fill("red");
  square(apple[0].x, apple[0].y, cellSize);
}

// EVENTS //////////////////////////////////////////////////

let pendingMovement = [];
function keyPressed() {
  // discord server: 530329504766361610  discord user: 672554516624703500
  // he had a similar pause code which I used to implement my own similar pause code below.
  if (keyCode === 82) {
    phase = INIT;
  }
  if (keyCode === 32) {
    if (phase === PLAYING) {
      phase = PAUSED;
    } else if (phase === PAUSED) {
      phase = PLAYING;
    } else if (phase === INIT) {
      phase = PLAYING;
    }
  }
  if (phase === PLAYING) {
    if (keyCode === RIGHT_ARROW) {
      // console.log('▶');
      if (dir === LEFT) {
      } else {
        pendingMovement.push(RIGHT);
        dir = RIGHT;
      }
    }
    if (keyCode === LEFT_ARROW) {
      // console.log('◀');
      if (dir === RIGHT) {
      } else {
        pendingMovement.push(LEFT);
        dir = LEFT;
      }
    }
    if (keyCode === UP_ARROW) {
      // console.log('▲');
      if (dir === DOWN) {
      } else {
        pendingMovement.push(UP);
        dir = UP;
      }
    }
    if (keyCode === DOWN_ARROW) {
      // console.log('▼');
      if (dir === UP) {
      } else {
        pendingMovement.push(DOWN);
        dir = DOWN;
      }
    }
  }
}

function mousePressed() {
  if (phase === INIT) {
    phase = PLAYING;
  }
}

// HELPER CHECKS AND UPDATES ///////////////////////////////

function moveSnake() {
  if (phase === INIT) {
    initGameState();
  }
  if (phase === PLAYING) {
    let nextDir = pendingMovement.length > 0 ? pendingMovement.shift() : dir;
    if (nextDir === RIGHT) {
      snake.shift();
      snake.push(
        new p5.Vector(
          snake[snake.length - 1].x + cellSize,
          snake[snake.length - 1].y
        )
      );
    }
    if (nextDir === LEFT) {
      snake.shift();
      snake.push(
        new p5.Vector(
          snake[snake.length - 1].x - cellSize,
          snake[snake.length - 1].y
        )
      );
    }
    if (nextDir === DOWN) {
      snake.shift();
      snake.push(
        new p5.Vector(
          snake[snake.length - 1].x,
          snake[snake.length - 1].y + cellSize
        )
      );
    }
    if (nextDir === UP) {
      snake.shift();
      snake.push(
        new p5.Vector(
          snake[snake.length - 1].x,
          snake[snake.length - 1].y - cellSize
        )
      );
    }
  }
}
function checkCollisions() {
  for (let i = 0; i <= snake.length - 2; i++) {
    if (snake[snake.length - 1].equals(snake[i])) {
      phase = GAME_OVER;
    }
  }
  if (snake[snake.length - 1].x < -0.001) {
    phase = GAME_OVER;
  }
  if (snake[snake.length - 1].y < -0.001) {
    phase = GAME_OVER;
  }
  if (snake[snake.length - 1].x >= canvasWidth) {
    phase = GAME_OVER;
  }
  if (snake[snake.length - 1].y >= canvasHeight) {
    phase = GAME_OVER;
  }
}
function checkApple() {
  if (snake[snake.length - 1].equals(apple[0])) {
    if (dir === RIGHT) {
      snake.unshift(new p5.Vector(snake[0].x - cellSize, snake[0].y));
    } else if (dir === LEFT) {
      snake.unshift(new p5.Vector(snake[0].x + cellSize, snake[0].y));
    } else if (dir === UP) {
      snake.unshift(new p5.Vector(snake[0].x, snake[0].y + cellSize));
    } else if (dir === DOWN) {
      snake.unshift(new p5.Vector(snake[0].x, snake[0].y - cellSize));
    }
    randomApplePosition();
    eaten = eaten + 1;
  }
}
