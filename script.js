const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, apple, dx, dy, score, gameLoop;
let nextDirection = null;

document.addEventListener('keydown', handleKey);
document.getElementById('restartBtn').addEventListener('click', startGame);

function startGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 }
  ];
  dx = 1;
  dy = 0;
  score = 0;
  nextDirection = null;
  document.getElementById('score').textContent = score;
  placeApple();

  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(gameTick, 150);
}

function handleKey(e) {
  const dir = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
  if (!dir) return;
  const [ndx, ndy] = dir;
  if (ndx === -dx && ndy === -dy) return;
  nextDirection = dir;
}

function gameTick() {
  if (nextDirection) {
    [dx, dy] = nextDirection;
    nextDirection = null;
  }

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  const hitWall = head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount;
  const hitSelf = snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y);

  if (hitWall || hitSelf) {
    clearInterval(gameLoop);
    alert("Game Over! Score: " + score);
    return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score++;
    document.getElementById('score').textContent = score;
    placeApple();
  } else {
    snake.pop();
  }

  drawGame();
}

function placeApple() {
  apple = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

function drawGame() {
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#66ff66';
  snake.forEach(seg => {
    ctx.beginPath();
    ctx.roundRect(seg.x * gridSize, seg.y * gridSize, gridSize - 2, gridSize - 2, 6);
    ctx.fill();
  });

  ctx.fillStyle = 'tomato';
  ctx.beginPath();
  ctx.roundRect(apple.x * gridSize, apple.y * gridSize, gridSize - 2, gridSize - 2, 6);
  ctx.fill();
}

// Polyfill for rounded rectangle drawing
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  this.beginPath();
  this.moveTo(x + r, y);
  this.lineTo(x + w - r, y);
  this.quadraticCurveTo(x + w, y, x + w, y + r);
  this.lineTo(x + w, y + h - r);
  this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  this.lineTo(x + r, y + h);
  this.quadraticCurveTo(x, y + h, x, y + h - r);
  this.lineTo(x, y + r);
  this.quadraticCurveTo(x, y, x + r, y);
  this.closePath();
  this.fill();
};

startGame();
