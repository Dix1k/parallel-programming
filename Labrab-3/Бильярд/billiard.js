const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let score = 0;
let lastScore = 0;

const RADIUS = 10;
const FRICTION = 0.99;
const RESTITUTION = 0.98; // потеря энергии при столкновении
const POCKET_RADIUS = 22;

let balls = [];
let cueBall;
let mouse = { x: 0, y: 0, down: false };

const pockets = [
  { x: 0, y: 0 },
  { x: canvas.width, y: 0 },
  { x: canvas.width, y: canvas.height },
  { x: 0, y: canvas.height }
];

class Ball {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.r = RADIUS;
    this.color = color;
    this.vx = 0;
    this.vy = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    this.vx *= FRICTION;
    this.vy *= FRICTION;

    if (Math.abs(this.vx) < 0.05) this.vx = 0;
    if (Math.abs(this.vy) < 0.05) this.vy = 0;

    // борта
    if (this.x - this.r < 0 || this.x + this.r > canvas.width) {
      this.vx *= -RESTITUTION;
      this.x = Math.max(this.r, Math.min(canvas.width - this.r, this.x));
    }

    if (this.y - this.r < 0 || this.y + this.r > canvas.height) {
      this.vy *= -RESTITUTION;
      this.y = Math.max(this.r, Math.min(canvas.height - this.r, this.y));
    }
  }
}

function initBalls() {
  balls = [];

  cueBall = new Ball(150, canvas.height / 2, 'white');
  balls.push(cueBall);

  // пирамида
  let colors = ['red','yellow','blue','orange','green','brown'];
  let startX = canvas.width - 200;
  let startY = canvas.height / 2;

  let index = 0;
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i <= row; i++) {
      balls.push(new Ball(
        startX + row * RADIUS * 2,
        startY + (i - row / 2) * RADIUS * 2,
        colors[index++ % colors.length]
      ));
    }
  }
}

function resolveCollision(b1, b2) {
  let dx = b2.x - b1.x;
  let dy = b2.y - b1.y;
  let dist = Math.hypot(dx, dy);

  if (dist === 0) return;

  if (dist < b1.r + b2.r) {
    let nx = dx / dist;
    let ny = dy / dist;

    let p = 2 * (
      b1.vx * nx + b1.vy * ny -
      b2.vx * nx - b2.vy * ny
    ) / 2;

    b1.vx -= p * nx * RESTITUTION;
    b1.vy -= p * ny * RESTITUTION;
    b2.vx += p * nx * RESTITUTION;
    b2.vy += p * ny * RESTITUTION;

    // раздвигаем
    let overlap = b1.r + b2.r - dist;
    b1.x -= overlap * nx / 2;
    b1.y -= overlap * ny / 2;
    b2.x += overlap * nx / 2;
    b2.y += overlap * ny / 2;
  }
}

function checkCollisions() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      resolveCollision(balls[i], balls[j]);
    }
  }
}

function checkPockets() {
  for (let i = balls.length - 1; i >= 0; i--) {
    let b = balls[i];

    for (let p of pockets) {
      let dx = b.x - p.x;
      let dy = b.y - p.y;
      let dist = Math.hypot(dx, dy);

      // учитываем радиус шара
      if (dist < POCKET_RADIUS + b.r * 0.5) {

        if (b === cueBall) {
          endGame();
          return;
        } else {
          balls.splice(i, 1);
          score++;

          if (balls.length === 1) {
            endGame();
            return;
          }

          break;
        }
      }
    }
  }
}

function endGame() {
  lastScore = score;

  setTimeout(() => {
    alert(`Игра окончена! Счёт: ${lastScore}`);
    score = 0;
    initBalls();
  }, 100);
}

function allStopped() {
  return balls.every(b => b.vx === 0 && b.vy === 0);
}

function drawAim() {
  if (!mouse.down || !allStopped()) return;

  ctx.beginPath();
  ctx.moveTo(cueBall.x, cueBall.y);
  ctx.lineTo(mouse.x, mouse.y);
  ctx.strokeStyle = 'white';
  ctx.stroke();
}

function drawTable() {
  ctx.fillStyle = '#0a5f2c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  for (let p of pockets) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, POCKET_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }
}

function loop() {
  drawTable();

  balls.forEach(b => b.update());

  checkCollisions();
  checkPockets();

  balls.forEach(b => b.draw());

  drawAim();

  requestAnimationFrame(loop);
}

// управление
canvas.addEventListener('mousedown', () => mouse.down = true);

canvas.addEventListener('mouseup', () => {
  if (!mouse.down || !allStopped()) return;

  let dx = cueBall.x - mouse.x;
  let dy = cueBall.y - mouse.y;
  let dist = Math.hypot(dx, dy);

  let power = Math.min(20, dist * 0.1);

  cueBall.vx = (dx / dist) * power;
  cueBall.vy = (dy / dist) * power;

  mouse.down = false;
});

canvas.addEventListener('mousemove', e => {
  let rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

function drawTable() {
  ctx.fillStyle = '#0a5f2c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  for (let p of pockets) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, POCKET_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }

  // ТЕКУЩИЙ СЧЁТ
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText(`Счёт: ${score}`, 10, 20);

  // ПРОШЛЫЙ СЧЁТ
  ctx.fillText(`Прошлый: ${lastScore}`, 10, 40);
}

initBalls();
loop();