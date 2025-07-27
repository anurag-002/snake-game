const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20;
const tiles = canvas.width / tileSize;

let score = 0;
let snake = [
  { x: 10 * tileSize, y: 10 * tileSize }
];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let speed = 4;
let apple = randomApple();
let moveProgress = 0;
let lastTime = 0;

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' && direction.y === 0) nextDirection = { x: 0, y: -1 };
  if (e.key === 'ArrowDown' && direction.y === 0) nextDirection = { x: 0, y: 1 };
  if (e.key === 'ArrowLeft' && direction.x === 0) nextDirection = { x: -1, y: 0 };
  if (e.key === 'ArrowRight' && direction.x === 0) nextDirection = { x: 1, y: 0 };
});

function randomApple() {
  return {
    x: Math.floor(Math.random() * tiles) * tileSize,
    y: Math.floor(Math.random() * tiles) * tileSize
  };
}

function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  moveProgress += delta * (speed / 60);

  if (moveProgress >= tileSize) {
    moveProgress = 0;
    direction = nextDirection;

    const newHead = {
      x: snake[0].x + direction.x * tileSize,
      y: snake[0].y + direction.y * tileSize
    };

    if (
      newHead.x < 0 || newHead.x >= canvas.width ||
      newHead.y < 0 || newHead.y >= canvas.height ||
      snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
    ) {
      alert("Game Over! Score: " + score);
      document.location.reload();
      return;
    }

    snake.unshift(newHead);

    if (newHead.x === apple.x && newHead.y === apple.y) {
      score++;
      document.getElementById('score').textContent = score;
      apple = randomApple();
    } else {
      snake.pop();
    }
  }

  draw();
  requestAnimationFrame(gameLoop);
}

function draw() {
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const offsetX = direction.x * moveProgress;
  const offsetY = direction.y * moveProgress;

  ctx.fillStyle = 'lime';
  for (let i = snake.length - 1; i >= 0; i--) {
    const seg = snake[i];
    let drawX = seg.x;
    let drawY = seg.y;

    if (i === 0) {
      drawX += offsetX;
      drawY += offsetY;
    }

    ctx.fillRect(drawX, drawY, tileSize - 2, tileSize - 2);
  }

  ctx.fillStyle = 'red';
  ctx.fillRect(apple.x, apple.y, tileSize - 2, tileSize - 2);
}

requestAnimationFrame(gameLoop);
