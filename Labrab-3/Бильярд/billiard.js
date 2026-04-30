const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const FPS = 60;
const RADIUS = 10;
const FRICTION = 0.995;

let balls = [];
let cueBall = null;
let mouse = { x: 0, y: 0, down: false };

// Координаты луз (4 штуки по углам)
const pockets = [
  { x: RADIUS, y: RADIUS },
  { x: canvas.width - RADIUS, y: RADIUS },
  { x: canvas.width - RADIUS, y: canvas.height - RADIUS },
  { x: RADIUS, y: canvas.height - RADIUS }
];

class Ball {
  constructor(x, y, r, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.vx = 0;
    this.vy = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    if (Math.abs(this.vx) < 0.1 && Math.abs(this.vy) < 0.1) {
      this.vx = this.vy = 0;
    } else {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= FRICTION;
      this.vy *= FRICTION;
    }

    // Отскок от бортов
    if (this.x - this.r < RADIUS || this.x + this.r > canvas.width - RADIUS) this.vx *= -1;
    if (this.y - this.r < RADIUS || this.y + this.r > canvas.height - RADIUS) this.vy *= -1;

    // Удержание в пределах стола
    this.x = Math.max(this.r + RADIUS, Math.min(this.x, canvas.width - this.r - RADIUS));
    this.y = Math.max(this.r + RADIUS, Math.min(this.y, canvas.height - this.r - RADIUS));
  }
}

function initBalls() {
  balls = [];
  const colors = ['white', 'yellow', 'red', 'blue', 'orange', 'green', 'brown'];
  for (let i = 0; i < colors.length; i++) {
    let x = canvas.width / 2 + (i - colors.length / 2) * (RADIUS * 2.5);
    let y = canvas.height / 2;
    balls.push(new Ball(x, y, RADIUS, colors[i]));
  }
  cueBall = balls[0];
}

function checkCollisions() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      let dx = balls[j].x - balls[i].x;
      let dy = balls[j].y - balls[i].y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < balls[i].r + balls[j].r) {
        let angle = Math.atan2(dy, dx);
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);
        let vx1n = balls[i].vx * cos + balls[i].vy * sin;
        let vy1n = -balls[i].vx * sin + balls[i].vy * cos;
        let vx2n = balls[j].vx * cos + balls[j].vy * sin;
        let vy2n = -balls[j].vx * sin + balls[j].vy * cos;

        // Обмен нормальными скоростями
        let tempVxN = vx1n;
        vx1n = vx2n;
        vx2n = tempVxN;

        // Обратное преобразование
        balls[i].vx = vx1n * cos - vy1n * sin;
        balls[i].vy = vx1n * sin + vy1n * cos;
        balls[j].vx = vx2n * cos - vy2n * sin;
        balls[j].vy = vx2n * sin + vy2n * cos;

        // Раздвигаем шары
        let overlap = (balls[i].r + balls[j].r - dist) / 2;
        let moveX = overlap * cos;
        let moveY = overlap * sin;
        balls[i].x -= moveX;
        balls[i].y -= moveY;
        balls[j].x += moveX;
        balls[j].y += moveY;
      }
    }
  }
}

function checkPockets() {
  // Проверяем попадание в лунки
  for (let i = balls.length - 1; i >= 0; i--) {
    const ball = balls[i];
    for (let pocket of pockets) {
      const dx = ball.x - pocket.x;
      const dy = ball.y - pocket.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < pocket.x / 2) { // попадание в лунку
        if (ball === cueBall) {
          initBalls(); // Перезапуск игры
          return; // Выходим, чтобы не проверять другие шары
        } else {
          balls.splice(i, 1); // Удаляем шар
          break; // Переходим к следующему шару
        }
      }
    }
  }
}

function drawTable() {
  ctx.fillStyle = '#006400';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Рисуем лунки
  ctx.fillStyle = '#000';
  for (let pocket of pockets) {
    ctx.beginPath();
    ctx.arc(pocket.x, pocket.y, RADIUS * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function loop() {
  drawTable();

  for (let ball of balls) ball.update();

  checkCollisions();

  checkPockets(); // Проверка попадания в лунки

  for (let ball of balls) ball.draw();

  requestAnimationFrame(loop);
}

canvas.addEventListener('mousedown', e => {
  mouse.down = true;
});
canvas.addEventListener('mouseup', e => {
  if (!mouse.down) return;

  let dx = mouse.x - cueBall.x;
  let dy = mouse.y - cueBall.y;
  let dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > cueBall.r) {
    let power = Math.min(15, dist / canvas.width * FPS);
    cueBall.vy += (dy / dist) * power;
    cueBall.vx += (dx / dist) * power;
  }
});
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left; // Исправлено!
  mouse.y = e.clientY - rect.top;   // Исправлено!
});
canvas.addEventListener('mouseleave', () => { mouse.down = false; });

initBalls();
loop();