/**
 * Решение системы линейных алгебраических уравнений методом Жордана-Гаусса
 * @param {number[][]} A - Матрица коэффициентов (n x n)
 * @param {number[]} b - Вектор правых частей (n)
 * @returns {number[]|null} - Вектор решений или null, если система не имеет единственного решения
 */
function solveJordanGauss(A, b) {
    // Проверка входных данных
    const n = A.length;
    if (n === 0) return null;
    if (A.some(row => row.length !== n)) return null;
    if (b.length !== n) return null;

    // Создаем расширенную матрицу [A|b]
    const augmented = A.map((row, i) => [...row, b[i]]);

    // Прямой ход: приведение к диагональному виду
    for (let col = 0; col < n; col++) {
        // Поиск главного элемента (максимального по модулю в текущем столбце)
        let maxRow = col;
        let maxVal = Math.abs(augmented[col][col]);
        
        for (let row = col + 1; row < n; row++) {
            const absVal = Math.abs(augmented[row][col]);
            if (absVal > maxVal) {
                maxVal = absVal;
                maxRow = row;
            }
        }

        // Если главный элемент близок к нулю, система не имеет единственного решения
        if (maxVal < 1e-10) {
            console.log("Система не имеет единственного решения (вырожденная матрица)");
            return null;
        }

        // Меняем строки местами, если нужно
        if (maxRow !== col) {
            [augmented[col], augmented[maxRow]] = [augmented[maxRow], augmented[col]];
        }

        // Нормализуем текущую строку (делим на диагональный элемент)
        const pivot = augmented[col][col];
        for (let j = col; j <= n; j++) {
            augmented[col][j] /= pivot;
        }

        // Обнуляем все остальные строки в текущем столбце
        for (let row = 0; row < n; row++) {
            if (row !== col && Math.abs(augmented[row][col]) > 1e-12) {
                const factor = augmented[row][col];
                for (let j = col; j <= n; j++) {
                    augmented[row][j] -= factor * augmented[col][j];
                }
            }
        }
    }

    // Извлекаем решение (последний столбец расширенной матрицы)
    const solution = augmented.map(row => row[n]);
    
    // Округляем результат для устранения погрешностей
    return solution.map(val => Math.abs(val) < 1e-10 ? 0 : val);
}

// Пример использования:
// Решим систему:
// 2x +  y -  z =  8
// -3x -  y + 2z = -11
// -2x +  y + 2z = -3

const A = [
    [2,  1, -1],
    [-3, -1, 2],
    [-2, 1,  2]
];

const b = [8, -11, -3];

const result = solveJordanGauss(A, b);

if (result) {
    console.log("Решение системы:");
    result.forEach((x, i) => {
        console.log(`x${i + 1} = ${x.toFixed(6)}`);
    });
    
    // Проверка:
    console.log("\nПроверка:");
    for (let i = 0; i < A.length; i++) {
        let sum = 0;
        for (let j = 0; j < A[i].length; j++) {
            sum += A[i][j] * result[j];
        }
        console.log(`${A[i].join("x + ")}x = ${sum} (должно быть ${b[i]})`);
    }
} else {
    console.log("Система несовместна или имеет бесконечно много решений");
}