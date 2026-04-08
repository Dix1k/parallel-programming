function multiplyMatrices(matrixA, matrixB) {
    const n = matrixA.length;

    // Проверка, что матрицы квадратные и одного размера
    if (!matrixA.every(row => row.length === n) || !matrixB.every(row => row.length === n)) {
        throw new Error("Матрицы должны быть квадратными и одинакового размера");
    }

    // Создаем результирующую матрицу заполненную нулями
    const result = Array(n).fill().map(() => Array(n).fill(0));

    // Перемножаем матрицы
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < n; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }

    return result;
}

// Тестовый запуск
function runTest() {
    // Пример двух квадратных матриц 3x3
    const matrixA = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];

    const matrixB = [
        [9, 8, 7],
        [6, 5, 4],
        [3, 2, 1]
    ];

    console.log("Матрица A:");
    console.log(matrixA);

    console.log("Матрица B:");
    console.log(matrixB);

    const result = multiplyMatrices(matrixA, matrixB);

    console.log("Результат перемножения A × B:");
    console.log(result);
}

// Запуск теста
runTest();

/*
Результат перемножения A × B:
[
  [30, 24, 18],
  [84, 69, 54],
  [138, 114, 90]
]

Функция multiplyMatrices принимает две квадратные матрицы и возвращает их произведение.
Добавлена проверка на корректность размеров.
В runTest() демонстрируется работа функции на примере матриц 3×3.
Код сам выполняется при запуске — достаточно сохранить как .js и запустить через Node.js или в браузере.
*/