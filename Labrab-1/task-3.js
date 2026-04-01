function bidiag(a, b, d) {
  let n = b.length;

  let alpha = a.map((v, i) => (i ? -v / b[i] : 0));
  let beta = d.map((v, i) => v / b[i]);

  for (let k = 1; k < n; k *= 2) {
    for (let i = k; i < n; i++) {
      beta[i] = alpha[i] * beta[i - k] + beta[i];
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
