function poly(coeffs, x) {
  let p = coeffs.map((a, i) => a * x ** i); // Вычисляем новый массив при возведении в степени
  return p.reduce((sum, val) => sum + val, 0); // Складываем все элементы нового массива
}

// ===== Тест =====
console.log(poly([1, 2, 3], 2)); // P(x) = 1 + 2x + 3x^2

// Ожидается: 1 + 4 + 12 = 17
