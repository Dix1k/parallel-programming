async function evaluateParallel(coefficients, x, numParts = 4) {
    const n = coefficients.length;
    const chunkSize = Math.ceil(n / numParts);

    // Создаём массив промисов (каждый — вычисление части суммы)
    const tasks = Array.from({ length: numParts }, async (_, i) => {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, n);

        let sum = 0;
        let power = n - 1 - start; // максимальная степень в этом блоке
        let xPower = 1;

        // Вычисляем x^power для начала блока (можно оптимизировать)
        for (let k = 0; k < power; k++) {
            xPower *= x;
        }

        for (let j = start; j < end; j++) {
            sum += coefficients[j] * xPower;
            xPower /= x; // уменьшаем степень: x^k -> x^(k-1)
        }

        return sum;
    });

    const results = await Promise.all(tasks);
    return results.reduce((acc, val) => acc + val, 0);
}

// Пример использования
const coeffs = [1, -2, 3, -4]; // x³ - 2x² + 3x - 4
const x = 1.5;
evaluateParallel(coeffs, x).then(console.log); // Вывод: -0.625