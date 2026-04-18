function solveLinearSystem(A, b) {
    const n = A.length;

    // Создаём расширенную матрицу [A | b]
    const augmented = A.map((row, i) => [...row, b[i]]);

    // Прямой ход метода Гаусса
    for (let col = 0; col < n; col++) {
        // Поиск строки с максимальным элементом в столбце (частичный выбор ведущего)
        let maxRow = col;
        for (let row = col + 1; row < n; row++) {
            if (Math.abs(augmented[row][col]) > Math.abs(augmented[maxRow][col])) {
                maxRow = row;
            }
        }

        // Перестановка строк
        [augmented[col], augmented[maxRow]] = [augmented[maxRow], augmented[col]];

        // Если ведущий элемент нулевой → матрица вырождена
        if (Math.abs(augmented[col][col]) < 1e-10) {
            return null; // Система не имеет единственного решения
        }

        // Обнуляем элементы под ведущим
        for (let row = col + 1; row < n; row++) {
            const factor = augmented[row][col] / augmented[col][col];
            for (let j = col; j <= n; j++) {
                augmented[row][j] -= factor * augmented[col][j];
            }
        }
    }

    // Обратный ход
    const x = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = augmented[i][n]; // правая часть
        for (let j = i + 1; j < n; j++) {
            x[i] -= augmented[i][j] * x[j];
        }
        x[i] /= augmented[i][i];
    }

    return x;
}

// Тест:
const A = [
    [2, 1, -1],
    [-3, -1, 2],
    [-2, 1, 2]
];

const b = [8, -11, -3];

const solution = solveLinearSystem(A, b);
if (solution) {
    console.log("Решение:", solution.map(x => x.toFixed(3)));
} else {
    console.log("Система не имеет единственного решения.");
}

/*
Что делает этот код:
Реализует метод Гаусса с выбором главного элемента по столбцу.
Проверяет вырожденность матрицы.
Возвращает вектор решений или null, если система несовместна или имеет бесконечно много решений.
*/