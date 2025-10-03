document.addEventListener("DOMContentLoaded", function () {
  const quantityInput = document.getElementById("quantity");
  const productSelect = document.getElementById("product");
  const result = document.getElementById("result");
  const calcBtn = document.getElementById("calcBtn");

  calcBtn.addEventListener("click", function () {
    const quantityStr = quantityInput.value.trim();

    if (!/^\d+$/.test(quantityStr)) {
      alert("Ошибка: введите корректное количество (только цифры).");
      return;
    }

    const quantity = parseInt(quantityStr, 10);
    const price = parseInt(productSelect.value, 10);
    const total = price * quantity;

    result.textContent = "Стоимость заказа: " + total + " руб.";
  });
});
