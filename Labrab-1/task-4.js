function bidiag(a, b, d) {
  const n = b.length;
  let x = new Array(n);
  let alpha = new Array(n);
  let beta = new Array(n);

  alpha[0] = 0;
  beta[0] = d[0] / b[0];

  for (let i = 1; i < n; i++) {
    alpha[i] = a[i] / b[i - 1];
    beta[i] = (d[i] - alpha[i] * beta[i - 1]) / b[i];
  }

  x[n - 1] = beta[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    x[i] = beta[i] - alpha[i + 1] * x[i + 1];
  }

  return x;
}

// Функция обращения двухдиагональной матрицы
function invertBidiag(a, b) {
  const n = b.length;
  let inv = [];

  for (let j = 0; j < n; j++) {
    // создаём единичный вектор для j-го столбца
    let d = Array(n).fill(0);
    d[j] = 1;

    // решаем систему, получаем j-й столбец обратной матрицы
    inv.push(bidiag(a, b, d));
  }

  // транспонируем массив, чтобы получить правильную матрицу n x n
  return inv[0].map((_, i) => inv.map((col) => col[i]));
}

// ===== Тест =====
const a = [0, 1, 1]; // поддиагональ
const b = [2, 2, 2]; // главная диагональ

const invMatrix = invertBidiag(a, b);

console.log("Обратная матрица:");
invMatrix.forEach((row) =>
  console.log(row.map((x) => Math.round(x * 1000) / 1000)),
);
