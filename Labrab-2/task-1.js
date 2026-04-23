function horner(coefficients, x) {
    // Проверяем, что массив коэффициентов не пустой
    if (coefficients.length === 0) {
        return 0;
    }

    // Начинаем с первого коэффициента (при старшей степени)
    let result = coefficients[0];

    // Последовательно применяем формулу схемы Горнера
    for (let i = 1; i < coefficients.length; i++) {
        result = result * x + coefficients[i];
    }

    return result;
}

// Пример использования
const coefficients = [2, -6, 2, -1]; // 2x³ - 6x² + 2x - 1
const x = 2;
const value = horner(coefficients, x);

console.log(`P(${x}) = ${value}`); // Вывод: P(2) = -5
