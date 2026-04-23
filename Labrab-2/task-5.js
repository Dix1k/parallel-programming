const math = require('mathjs');

// Определение матриц
const A = math.matrix([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]);
const B = math.matrix([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
]);


// Вычисления
const AT = math.transpose(A);            // A^T
const BT = math.transpose(B);            // B^T
const B_plus_BT = math.add(B, BT);       // B + B1
const result = math.multiply(math.multiply(AT, B_plus_BT), A); // A^T * (B + BT) * A

// Вывод результата
console.log("Результат:");
console.log(math.format(result, { precision: 6 }));