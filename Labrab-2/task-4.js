async function solveBiDiagonalParallel(diagonal, superDiagonal, b, numParts = 2) {
    const n = diagonal.length;

    // Проверки
    if (superDiagonal.length !== n - 1) {
        throw new Error("Длина наддиагонали должна быть n-1");
    }
    if (b.length !== n) {
        throw new Error("Размер вектора b должен быть равен n");
    }

    const chunkSize = Math.max(1, Math.floor(n / numParts));
    const blocks = [];

    // Разбиваем на блоки [start, end)
    for (let i = 0; i < numParts; i++) {
        const start = i * chunkSize;
        const end = i === numParts - 1 ? n : Math.min(start + chunkSize, n);
        blocks.push({ start, end });
    }

    // Массив для результата
    const x = new Array(n);

    // Создаём промисы: каждый блок будет решаться "параллельно", но с учётом зависимости от следующего
    const tasks = blocks.reverse().map(async (block, idx) => {
        const { start, end } = block;

        // Начинаем с конца блока и идём назад
        for (let i = end - 1; i >= start; i--) {
            if (i === n - 1) {
                x[i] = b[i] / diagonal[i];
            } else {
                // Зависим от x[i+1] — если ещё не вычислено, ждём
                while (x[i + 1] === undefined) {
                    await new Promise(resolve => setTimeout(resolve, 0)); // эмуляция ожидания
                }
                x[i] = (b[i] - superDiagonal[i] * x[i + 1]) / diagonal[i];
            }
        }
    });

    // Запускаем все блоки "параллельно"
    await Promise.all(tasks);

    return x;
}

// === Пример использования ===
const diagonal = [2, 3, 1];           // главная диагональ
const superDiagonal = [1, 2];         // наддиагональ
const b = [4, 12, 3];                 // правая часть

solveBiDiagonalParallel(diagonal, superDiagonal, b)
    .then(solution => {
        console.log("Решение x:", solution.map(x => x.toFixed(2)).join(', '));
        // Ожидается: 1.00, 2.00, 3.00
    })
    .catch(err => console.error("Ошибка:", err.message));