function gaussMethod(matrix) {
  const n = matrix.length; // размер матрицы (число уравнений)

  // Прямой ход (приведение к треугольному виду)
  for (let i = 0; i < n; i++) {
    // Ищем pivot (главный элемент) в столбце i
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) {
        maxRow = k;
      }
    }

    // Переставляем строки, если нужно
    if (maxRow !== i) {
      [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];
    }

    // Нормализуем строку (делаем pivot = 1)
    const pivot = matrix[i][i];
    for (let j = i; j <= n; j++) {
      matrix[i][j] /= pivot;
    }

    // Обнуляем элементы под pivot
    for (let k = i + 1; k < n; k++) {
      const factor = matrix[k][i];
      for (let j = i; j <= n; j++) {
        matrix[k][j] -= factor * matrix[i][j];
      }
    }
  }

  // Обратный ход (находим решения)
  const solutions = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    solutions[i] = matrix[i][n]; // начальное значение — свободный член
    for (let j = i + 1; j < n; j++) {
      solutions[i] -= matrix[i][j] * solutions[j];
    }
  }

  return solutions;
}

// Пример использования
const system = [
  [2, -1, 1, 8],   // 2x - y + z = 8
  [1,  2, -1, -1], // x + 2y - z = -1
  [3, -1, 2, 14]   // 3x - y + 2z = 14
];

const result = gaussMethod(system);
console.log('Решения:', result.map(val => val.toFixed(2)));
