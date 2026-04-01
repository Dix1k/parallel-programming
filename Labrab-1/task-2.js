function solveTridiagonalThomas(a, b, c, d) {
  const n = b.length;
  let cPrime = new Array(n);
  let dPrime = new Array(n);

  cPrime[0] = c[0] / b[0];
  dPrime[0] = d[0] / b[0];

  for (let i = 1; i < n; i++) {
    let denom = b[i] - a[i] * cPrime[i - 1];
    cPrime[i] = i < n - 1 ? c[i] / denom : 0;
    dPrime[i] = (d[i] - a[i] * dPrime[i - 1]) / denom;
  }

  let x = new Array(n);
  x[n - 1] = dPrime[n - 1];

  for (let i = n - 2; i >= 0; i--) {
    x[i] = dPrime[i] - cPrime[i] * x[i + 1];
  }

  return x;
}

// ===== Тест =====
const a2 = [0, -1, -1, -1]; // поддиагональ
const b2 = [2, 2, 2, 2]; // главная
const c2 = [-1, -1, -1, 0]; // наддиагональ
const d2 = [1, 0, 0, 1];

const result = solveTridiagonalThomas(a2, b2, c2, d2);

console.log(result.map((x) => Math.round(x * 1e10) / 1e10));

// Ожидается: [1, 1, 1, 1]
