function blockSolve(A, B, d) {
  const m = B.length;

  // Функция для умножения матрицы на вектор
  function matrixVectorMultiply(matrix, vector) {
    return matrix.map(row =>
      row.reduce((sum, val, j) => sum + val * vector[j], 0)
    );
  }

  // Функция для обращения диагональной матрицы (возвращает вектор-диагональ)
  function invertDiagonalMatrix(matrix) {
    return matrix.map((row, i) => 1 / row[i]);
  }

  // Функция для поэлементного вычитания векторов
  function vectorSubtract(v1, v2) {
    return v1.map((val, i) => val - v2[i]);
  }

  // Прямой ход: последовательное вычисление x[i]
  const x = new Array(m);

  // Первый блок: x[0] = B[0]^(-1) * d[0]
  const B0Inv = invertDiagonalMatrix(B[0]);
  x[0] = d[0].map((val, i) => val * B0Inv[i]);

  // Остальные блоки: x[i] = B[i]^(-1) * (d[i] - A[i] * x[i-1])
  for (let i = 1; i < m; i++) {
    // Вычисляем A[i] * x[i-1]
    const Ax = matrixVectorMultiply(A[i], x[i - 1]);

    // d[i] - A[i] * x[i-1]
    const rhs = vectorSubtract(d[i], Ax);

    // B[i]^(-1)
    const BiInv = invertDiagonalMatrix(B[i]);

    // x[i] = B[i]^(-1) * rhs
    x[i] = rhs.map((val, j) => val * BiInv[j]);
  }

  return x;
}

// Тест
const A5 = [null, [[1, 0], [0, 1]], [[1, 0], [0, 1]]];
const B5 = [[[2, 0], [0, 2]], [[2, 0], [0, 2]], [[2, 0], [0, 2]]];
const d5 = [[2, 2], [4, 4], [6, 6]];

console.log("Решение системы:");
const result = blockSolve(A5, B5, d5);
result.forEach((x, i) => {
  console.log(`x[${i}] = [${x.map(val => val.toFixed(2)).join(', ')}]`);
});
