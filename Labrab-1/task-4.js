function invertBidiag(a, b) {
  const n = b.length;

  const solve = (d) => {
    const x = new Array(n);
    x[0] = d[0] / b[0];
    for (let i = 1; i < n; i++) {
      x[i] = (d[i] - a[i] * x[i - 1]) / b[i];
    }
    return x;
  };

  const inv = Array.from({ length: n }, (_, j) => {
    const d = Array(n).fill(0);
    d[j] = 1;
    return solve(d);
  });

  return inv[0].map((_, i) => inv.map(row => row[i])); // транспонирование
}

// Тест
const a = [0, 1, 1];
const b = [2, 2, 2];

console.log("Обратная матрица:");
invertBidiag(a, b).forEach(row =>
  console.log(row.map(x => Math.round(x * 1000) / 1000))
);

// Обратная матрица:
// [ 0.5, 0, 0 ]
// [ -0.25, 0.5, 0 ]
// [ 0.125, -0.25, 0.5 ]