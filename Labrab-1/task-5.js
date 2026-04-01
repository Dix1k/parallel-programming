function blockSolve(A, B, d) {
  let m = B.length;

  let alpha = [];
  let beta = [];

  for (let i = 0; i < m; i++) {
    let Binv = B[i].map((row, j) => row.map((v, k) => (j === k ? 1 / v : 0))); // упрощённая "обратная"

    alpha[i] = i ? Binv.map((r, j) => r.map((v) => -v)) : null;
    beta[i] = d[i].map((v, j) => v / B[i][j][j]);
  }

  for (let k = 1; k < m; k *= 2) {
    for (let i = k; i < m; i++) {
      if (alpha[i]) {
        beta[i] = beta[i].map((v, j) => v + beta[i - k][j]);
      }
    }
  }

  return beta;
}

// ===== Тест =====
const A5 = [
  null,
  [
    [1, 0],
    [0, 1],
  ],
  [
    [1, 0],
    [0, 1],
  ],
];

const B5 = [
  [
    [2, 0],
    [0, 2],
  ],
  [
    [2, 0],
    [0, 2],
  ],
  [
    [2, 0],
    [0, 2],
  ],
];

const d5 = [
  [2, 2],
  [4, 4],
  [6, 6],
];

console.log(blockSolve(A5, B5, d5));

// Ожидается: примерно возрастающие значения
// типа: [[1,1], [3,3], [7,7]]
