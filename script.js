// Константы
const FORM_STORAGE_KEY = 'feedbackFormData';
// Для использования: зарегистрируйтесь на https://formcarry.com и замените YOUR_FORM_ID на ваш ID формы
// Или используйте https://slapform.com - там не требуется регистрация
const FORM_ENDPOINT = 'https://formcarry.com/s/uRmwFwjLNhL';

// Элементы DOM
const openFormBtn = document.getElementById('openFormBtn');
const formPopup = document.getElementById('formPopup');
const closeFormBtn = document.getElementById('closeFormBtn');
const cancelBtn = document.getElementById('cancelBtn');
const feedbackForm = document.getElementById('feedbackForm');
const messageContainer = document.getElementById('messageContainer');

// Флаг для отслеживания, был ли добавлен новый state в историю
let formStatePushed = false;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Восстановление данных из LocalStorage
  restoreFormData();
  
  // Проверка URL при загрузке страницы
  if (window.location.hash === '#form') {
    formStatePushed = false; // Форма открыта через URL, не через pushState
    openForm();
  }
  
  // Обработка кнопки "Назад" в браузере
  window.addEventListener('popstate', (e) => {
    if (window.location.hash !== '#form' && formPopup.classList.contains('active')) {
      formPopup.classList.remove('active');
      document.body.style.overflow = '';
      clearMessage();
    }
    formStatePushed = false;
  });
});

// Открытие формы
function openForm() {
  formPopup.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Изменение URL с помощью History API
  if (window.location.hash !== '#form') {
    history.pushState({ form: true }, '', '#form');
    formStatePushed = true;
  } else {
    formStatePushed = false;
  }
  
  // Восстановление данных из LocalStorage
  restoreFormData();
}

// Закрытие формы
function closeForm() {
  formPopup.classList.remove('active');
  document.body.style.overflow = '';
  
  // Возврат URL обратно только если мы добавили новый state
  if (window.location.hash === '#form' && formStatePushed) {
    history.back();
  } else if (window.location.hash === '#form') {
    // Если форма была открыта через URL, просто убираем hash
    history.replaceState(null, '', window.location.pathname);
  }
  
  formStatePushed = false;
  
  // Очистка сообщений
  clearMessage();
}

// Сохранение данных формы в LocalStorage
function saveFormData() {
  const formData = {
    fullName: document.getElementById('fullName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    organization: document.getElementById('organization').value,
    message: document.getElementById('message').value,
    consent: document.getElementById('consent').checked
  };
  
  localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
}

// Восстановление данных формы из LocalStorage
function restoreFormData() {
  const savedData = localStorage.getItem(FORM_STORAGE_KEY);
  
  if (savedData) {
    try {
      const formData = JSON.parse(savedData);
      
      document.getElementById('fullName').value = formData.fullName || '';
      document.getElementById('email').value = formData.email || '';
      document.getElementById('phone').value = formData.phone || '';
      document.getElementById('organization').value = formData.organization || '';
      document.getElementById('message').value = formData.message || '';
      document.getElementById('consent').checked = formData.consent || false;
    } catch (e) {
      console.error('Ошибка при восстановлении данных:', e);
    }
  }
}

// Очистка данных формы из LocalStorage
function clearFormData() {
  localStorage.removeItem(FORM_STORAGE_KEY);
  
  // Очистка полей формы
  feedbackForm.reset();
}

// Сохранение данных при вводе
feedbackForm.addEventListener('input', (e) => {
  saveFormData();
  // Очистка ошибки при вводе
  if (e.target.classList.contains('error')) {
    e.target.classList.remove('error');
    const errorMsg = e.target.closest('.form-group')?.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
  }
});
feedbackForm.addEventListener('change', (e) => {
  saveFormData();
  // Очистка ошибки при изменении (для чекбокса)
  const formGroup = e.target.closest('.form-group');
  if (formGroup && formGroup.classList.contains('error')) {
    formGroup.classList.remove('error');
    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
  }
});

// Отображение сообщения
function showMessage(text, type = 'success') {
  messageContainer.innerHTML = `<div class="message ${type}">${text}</div>`;
  
  // Автоматическое скрытие сообщения через 5 секунд
  setTimeout(() => {
    clearMessage();
  }, 5000);
}

// Очистка сообщения
function clearMessage() {
  messageContainer.innerHTML = '';
}

// Валидация формы
function validateForm() {
  let isValid = true;
  
  // Очистка предыдущих ошибок
  clearFieldErrors();
  
  // Валидация ФИО
  const fullName = document.getElementById('fullName').value.trim();
  if (!fullName) {
    showFieldError('fullName', 'Поле ФИО обязательно для заполнения');
    isValid = false;
  } else if (fullName.split(/\s+/).length < 2) {
    showFieldError('fullName', 'Введите полное имя (минимум 2 слова)');
    isValid = false;
  }
  
  // Валидация Email
  const email = document.getElementById('email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showFieldError('email', 'Поле Email обязательно для заполнения');
    isValid = false;
  } else if (!emailRegex.test(email)) {
    showFieldError('email', 'Введите корректный email адрес');
    isValid = false;
  }
  
  // Валидация телефона
  const phone = document.getElementById('phone').value.trim();
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phone) {
    showFieldError('phone', 'Поле Телефон обязательно для заполнения');
    isValid = false;
  } else if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
    showFieldError('phone', 'Введите корректный номер телефона');
    isValid = false;
  }
  
  // Валидация сообщения
  const message = document.getElementById('message').value.trim();
  if (!message) {
    showFieldError('message', 'Поле Сообщение обязательно для заполнения');
    isValid = false;
  } else if (message.length < 10) {
    showFieldError('message', 'Сообщение должно содержать минимум 10 символов');
    isValid = false;
  }
  
  // Валидация согласия
  const consent = document.getElementById('consent').checked;
  if (!consent) {
    showFieldError('consent', 'Необходимо согласие с политикой обработки данных');
    isValid = false;
  }
  
  return isValid;
}

// Отображение ошибки поля
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const formGroup = field.closest('.form-group');
  
  // Добавляем класс ошибки
  if (field.type === 'checkbox') {
    formGroup.classList.add('error');
  } else {
    field.classList.add('error');
  }
  
  // Создаем или обновляем сообщение об ошибке
  let errorElement = formGroup.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    formGroup.appendChild(errorElement);
  }
  errorElement.textContent = message;
}

// Очистка ошибок полей
function clearFieldErrors() {
  const errorFields = feedbackForm.querySelectorAll('.error');
  errorFields.forEach(field => field.classList.remove('error'));
  
  const errorGroups = feedbackForm.querySelectorAll('.form-group.error');
  errorGroups.forEach(group => group.classList.remove('error'));
  
  const errorMessages = feedbackForm.querySelectorAll('.error-message');
  errorMessages.forEach(msg => msg.remove());
}

// Обработка отправки формы
feedbackForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Валидация формы
  if (!validateForm()) {
    showMessage('Пожалуйста, исправьте ошибки в форме', 'error');
    return;
  }
  
  const submitBtn = feedbackForm.querySelector('.submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';
  
  clearMessage();
  clearFieldErrors();
  
  // Сбор данных формы
  const formData = new FormData(feedbackForm);
  
  try {
    // Отправка данных на сервер (FormData для совместимости с formcarry.com)
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    });
    
    // Получаем текст ответа для проверки
    const responseText = await response.text();
    let responseData = null;
    
    // Пытаемся распарсить как JSON
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      // Если не JSON, это нормально для некоторых сервисов
    }
    
    // Проверка успешности ответа
    // formcarry.com возвращает статус 200 и { code: 200 } при успехе
    // или { code: 4xx/5xx } при ошибке
    if (response.ok) {
      // Проверяем, есть ли ошибка в теле ответа
      if (responseData && responseData.code && responseData.code !== 200) {
        // Ошибка в ответе
        throw new Error(responseData.message || 'Ошибка при отправке формы');
      }
      
      // Успешная отправка
      showMessage('Спасибо! Ваше сообщение успешно отправлено.', 'success');
      
      // Очистка данных формы
      clearFormData();
      
      // Закрытие формы через 2 секунды
      setTimeout(() => {
        closeForm();
      }, 2000);
    } else {
      // HTTP ошибка
      let errorMessage = 'Ошибка при отправке формы';
      if (responseData && responseData.message) {
        errorMessage = responseData.message;
      } else {
        errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    // Ошибка сети или другая ошибка
    console.error('Ошибка:', error);
    const errorText = error.message || 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.';
    showMessage(errorText, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить';
  }
});

// Обработчики событий
openFormBtn.addEventListener('click', openForm);
closeFormBtn.addEventListener('click', closeForm);
cancelBtn.addEventListener('click', closeForm);

// Закрытие по клику вне формы
formPopup.addEventListener('click', (e) => {
  if (e.target === formPopup) {
    closeForm();
  }
});

// Закрытие по клавише Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && formPopup.classList.contains('active')) {
    closeForm();
  }
});
