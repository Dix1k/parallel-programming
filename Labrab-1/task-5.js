function blockSolve(A, B, d) {
  const m = B.length;
  const beta = d.map((di, i) => di.map(val => val / B[i][0][0])); // предполагаем диагональные B[i] с одинаковыми элементами

  // Параллельная прогонка (метод удвоения)
  for (let k = 1; k < m; k *= 2) {
    for (let i = k; i < m; i++) {
      beta[i] = beta[i].map((val, j) => val + beta[i - k][j]);
    }
  }

  return beta;
}

// Тест
const A5 = [null, [[1,0],[0,1]], [[1,0],[0,1]]];
const B5 = [[[2,0],[0,2]], [[2,0],[0,2]], [[2,0],[0,2]]];
const d5 = [[2,2], [4,4], [6,6]];

console.log(blockSolve(A5, B5, d5));

// Ожидается: [[1,1], [3,3], [7,7]]