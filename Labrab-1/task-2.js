function solveTridiagonalThomas(a, b, c, d) {
  const n = b.length;
  const cPrime = new Array(n);
  const dPrime = new Array(n);

  // Прямой ход: мы последовательно упрощаем систему, избавляясь от зависимости от прошлых переменных.
  cPrime[0] = c[0] / b[0];
  dPrime[0] = d[0] / b[0];

  for (let i = 1; i < n; i++) {
    const denom = b[i] - a[i] * cPrime[i - 1];
    cPrime[i] = i < n - 1 ? c[i] / denom : 0;
    dPrime[i] = (d[i] - a[i] * dPrime[i - 1]) / denom;
  }

  // Обратный ход: идя с конца подставляем одно в другое — и получаем все значения
  const x = new Array(n);
  x[n - 1] = dPrime[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    x[i] = dPrime[i] - cPrime[i] * x[i + 1];
  }

  return x;
}

// ===== Тест =====
const a2 = [0, -1, -1, -1];
const b2 = [2, 2, 2, 2];
const c2 = [-1, -1, -1, 0];
const d2 = [1, 0, 0, 1];

console.log(solveTridiagonalThomas(a2, b2, c2, d2).map(x => Math.round(x * 1e10) / 1e10));

// Ожидается: [1, 1, 1, 1]

/* 
Итог:
Метод Томаса — это умный способ быстро решить систему, где каждая переменная связана только с соседями.
Он делает:
Прямой ход — идёт вперёд, выражает каждую переменную через следующую.
Обратный ход — идёт назад, подставляет и находит настоящие значения.

Код эффективный: работает за время O(n) — очень быстро даже для больших систем.
*/