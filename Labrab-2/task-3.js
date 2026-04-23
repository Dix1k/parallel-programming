function solveUpperBiDiagonal(diagonal, subDiagonal, b) {
    const n = diagonal.length;
    const x = [...b]; // копируем b, чтобы не менять оригинал

    // Обратная подстановка
    for (let i = n - 1; i >= 0; i--) {
        if (diagonal[i] === 0) {
            throw new Error(`Нулевой элемент на диагонали: d[${i}] = 0`);
        }

        if (i === n - 1) {
            x[i] = b[i] / diagonal[i];
        } else {
            x[i] = (b[i] - subDiagonal[i] * x[i + 1]) / diagonal[i];
        }
    }

    return x;
}

// Пример: матрица A и вектор b
const diagonal = [2, 3, 1];     // главная диагональ
const subDiagonal = [1, 2];     // наддиагональ
const b = [4, 12, 3];           // правая часть

// Решаем систему
const solution = solveUpperBiDiagonal(diagonal, subDiagonal, b);

console.log("Решение x:", solution.map(x => x.toFixed(2)).join(', '));
// Ожидаемый результат: 1.00, 2.00, 3.00