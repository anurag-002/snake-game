const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, apple, dx, dy, score, gameLoop;
let nextDirection = null; // buffer for queued direction

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
  const key = e.key.toLowerCase(); // handle caps/shift
  const map = {
    w: [0, -1],  // up
    s: [0,  1],  // down
    a: [-1, 0],  // left
    d: [1,  0]   // right
  };

  const dir = map[key];
  if (!dir) return;

  const [ndx, ndy] = dir;

  // prevent instant 180° reverse
  if (ndx === -dx && ndy === -dy) return;

  nextDirection = dir;
}

function gameTick() {
  // Apply next direction if valid
  if (nextDirection) {
    const [ndx, ndy] = nextDirection;
    dx = ndx;
    dy = ndy;
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
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'lime';
  snake.forEach(seg => {
    ctx.fillRect(seg.x * gridSize, seg.y * gridSize, gridSize - 2, gridSize - 2);
  });

  ctx.fillStyle = 'red';
  ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 2, gridSize - 2);
}

// Auto-start the game
startGame();

