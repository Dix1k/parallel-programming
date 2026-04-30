function transpose(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    // Создаем новую матрицу, меняя строки и столбцы местами
    const result = [];
    for (let i = 0; i < cols; i++) {
        result[i] = [];
        for (let j = 0; j < rows; j++) {
            result[i][j] = matrix[j][i];
        }
    }
    return result;
}

function add(a, b) {
    const rows = a.length;
    const cols = a[0].length;
    const result = [];
    for (let i = 0; i < rows; i++) {
        result[i] = [];
        for (let j = 0; j < cols; j++) {
            result[i][j] = a[i][j] + b[i][j];
        }
    }
    return result;
}

function multiply(a, b) {
    const rowsA = a.length;
    const colsA = a[0].length;
    const colsB = b[0].length;
    
    // Инициализируем матрицу-результат нулями
    const result = Array.from({ length: rowsA }, () => Array(colsB).fill(0));
    
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return result;
}

// --- Основная логика ---

// Определение матриц
const A = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];
const B = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
];

// Вычисления по шагам
const AT = transpose(A);            // A^T
const BT = transpose(B);            // B^T
const B_plus_BT = add(B, BT);       // B + B^T

// Итоговый результат: A^T * (B + B^T) * A
const intermediateResult = multiply(AT, B_plus_BT);
const finalResult = multiply(intermediateResult, A);

// --- Вывод результата в консоль ---
console.log("Результат:");
finalResult.forEach(row => {
    // Форматируем числа до 6 знаков после запятой и выводим строку матрицы
    console.log(row.map(val => val.toFixed(6)).join(' '));
});