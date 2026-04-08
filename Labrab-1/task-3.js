function bidiag(a, b, d) {
  const n = b.length;

  // Инициализация alpha и beta
  const alpha = a.map((val, i) => (i === 0 ? 0 : -val / b[i]));
  const beta = d.map((val, i) => val / b[i]);

  // Параллельная прогонка (метод удвоения)
  for (let k = 1; k < n; k *= 2) {
    for (let i = k; i < n; i++) {
      beta[i] += alpha[i] * beta[i - k];
      alpha[i] *= alpha[i - k];
    }
  }

  return beta;
}

// ===== Тест =====
const a3 = [0, 1, 1, 1];
const b3 = [2, 2, 2, 2];
const d3 = [2, 4, 6, 8];

console.log(bidiag(a3, b3, d3)); 

// Ожидается: [1, 1.5, 2.25, 2.875]