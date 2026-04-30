// Вспомогательная функция: следующая степень двойки
function nextPowerOfTwo(n) {
  return Math.pow(2, Math.ceil(Math.log2(n)));
}

// Вспомогательная функция: дополнение матрицы нулями до нужного размера
function resizeMatrix(mat, newR, newC) {
  let resized = Array.from({ length: newR }, (_, i) =>
    Array.from({ length: newC }, (_, j) =>
      i < mat.length && j < mat[0].length ? mat[i][j] : 0
    )
  );
  return resized;
}

// Сложение или вычитание матриц
function add(mat1, mat2, size, sign = 1) {
  let res = Array.from({ length: size }, () => Array(size).fill(0));
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
      res[i][j] = mat1[i][j] + sign * mat2[i][j];
  return res;
}

// Рекурсивная реализация алгоритма Штрассена
function strassen(mat1, mat2) {
  const n = mat1.length;
  const res = Array.from({ length: n }, () => Array(n).fill(0));

  if (n === 1) {
    res[0][0] = mat1[0][0] * mat2[0][0];
    return res;
  }

  const newSize = n / 2;
  const a11 = [], a12 = [], a21 = [], a22 = [];
  const b11 = [], b12 = [], b21 = [], b22 = [];

  for (let i = 0; i < newSize; i++) {
    a11.push(mat1[i].slice(0, newSize));
    a12.push(mat1[i].slice(newSize));
    a21.push(mat1[i + newSize].slice(0, newSize));
    a22.push(mat1[i + newSize].slice(newSize));
    b11.push(mat2[i].slice(0, newSize));
    b12.push(mat2[i].slice(newSize));
    b21.push(mat2[i + newSize].slice(0, newSize));
    b22.push(mat2[i + newSize].slice(newSize));
  }

  const m1 = strassen(add(a11, a22, newSize), add(b11, b22, newSize));
  const m2 = strassen(add(a21, a22, newSize), b11);
  const m3 = strassen(a11, add(b12, b22, newSize, -1));
  const m4 = strassen(a22, add(b21, b11, newSize, -1));
  const m5 = strassen(add(a11, a12, newSize), b22);
  const m6 = strassen(add(a21, a11, newSize, -1), add(b11, b12, newSize));
  const m7 = strassen(add(a12, a22, newSize, -1), add(b21, b22, newSize));

  const c11 = add(add(m1, m4, newSize), add(m7, m5, newSize, -1), newSize);
  const c12 = add(m3, m5, newSize);
  const c21 = add(m2, m4, newSize);
  const c22 = add(add(m1, m3, newSize), add(m6, m2, newSize, -1), newSize);

  for (let i = 0; i < newSize; i++)
    for (let j = 0; j < newSize; j++) {
      res[i][j] = c11[i][j];
      res[i][j + newSize] = c12[i][j];
      res[i + newSize][j] = c21[i][j];
      res[i + newSize][j + newSize] = c22[i][j];
    }

  return res;
}

// Основная функция умножения матриц с использованием алгоритма Штрассена
function multiply(mat1, mat2) {
  const n = mat1.length,
        m = mat1[0].length,
        q = mat2[0].length;

  const size = nextPowerOfTwo(Math.max(n, m, q));

  const aPad = resizeMatrix(mat1, size, size);
  const bPad = resizeMatrix(mat2, size, size);

  const cPad = strassen(aPad, bPad);

  const result = [];
  for (let i = 0; i < n; i++) {
    result.push([]);
    for (let j = 0; j < q; j++)
      result[i][j] = cPad[i][j];
  }

  return result;
}

// Пример использования:
const matA = [[1, 2, 3], [4, 5, 6]];
const matB = [[7, 8], [9, 10], [11, 12]];
const resultMatrix = multiply(matA, matB);
console.log(resultMatrix.map(row => row.join(' ')).join('\n'));