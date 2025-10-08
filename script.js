window.addEventListener('DOMContentLoaded', function () {
  const quantityInput = document.getElementById('quantity');
  const radios = document.getElementsByName('prodOptions');
  const select = document.querySelector("select[name='prodType']");
  const checkDiv = document.getElementById('checkboxes');
  const prodPrice = document.getElementById('prodPrice');

  function getPrices() {
    return {
      base: {
        option1: 300, // Домашняя вечеринка
        option2: 700, // Праздник в кафе
        option3: 1200 // Выезд в аквапарк
      },
      prodTypes: [0, 200, 500],
      prodProperties: {
        prop1: 250, 
        prop2: 400, 
        prop3: 300,  
      }
    };
  }

  function getSelectedRadio() {
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return null;
  }

  function updateFormVisibility(selectedRadio) {
    if (!selectedRadio) {
      select.style.display = 'none';
      checkDiv.style.display = 'none';
      return;
    }

    if (selectedRadio === 'option1') {
      select.style.display = 'none';
      checkDiv.style.display = 'none';
    } else if (selectedRadio === 'option2') {
      select.style.display = 'inline-block';
      checkDiv.style.display = 'none';
    } else if (selectedRadio === 'option3') {
      select.style.display = 'none';
      checkDiv.style.display = 'block';
    }
  }

  function updatePrice() {
    const prices = getPrices();
    const selectedRadio = getSelectedRadio();
    const qty = parseInt(quantityInput.value, 10);

    if (!selectedRadio) {
      prodPrice.textContent = 'Выберите тип услуги';
      return;
    }

    // базовая цена за одного гостя
    let unitPrice = prices.base[selectedRadio] || 0;

    if (selectedRadio === 'option2') {
      const idx = parseInt(select.value, 10) - 1;
      if (!isNaN(idx) && prices.prodTypes[idx] !== undefined) {
        unitPrice += prices.prodTypes[idx];
      }
    }

    if (selectedRadio === 'option3') {
      const checkboxes = checkDiv.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(ch => {
        if (ch.checked) {
          unitPrice += prices.prodProperties[ch.name] || 0;
        }
      });
    }

    if (isNaN(qty) || qty <= 0) {
      prodPrice.textContent = 'Введите количество гостей';
      return;
    }

    const total = unitPrice * qty;
    prodPrice.textContent = `Стоимость: ${total} руб.`;
  }

  select.style.display = 'none';
  checkDiv.style.display = 'none';

  quantityInput.addEventListener('input', updatePrice);

  select.addEventListener('change', updatePrice);

  Array.from(radios).forEach(radio => {
    radio.addEventListener('change', function (e) {
      const val = e.target.value;
      updateFormVisibility(val);
      updatePrice();
    });
  });

  const checkboxes = checkDiv.querySelectorAll('input[type="checkbox"]');
  Array.from(checkboxes).forEach(ch => ch.addEventListener('change', updatePrice));

  updatePrice();
});
