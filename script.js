const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let apple = { x: 15, y: 15 };
let dx = 1, dy = 0; // <-- Snake starts moving right
let score = 0;
let gameLoop;

document.addEventListener('keydown', handleKey);

function handleKey(e) {
  if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
  else if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
  else if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
  else if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
}

function gameTick() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount || snake.some(seg => seg.x === head.x && seg.y === head.y)) {
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

gameLoop = setInterval(gameTick, 150);
