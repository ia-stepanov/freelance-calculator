// Инпуты во вкладке «Определяем фиксированную стоимость»
const inputMonth = document.getElementById('input-month');
const inputWeek = document.getElementById('input-week');
const inputDay = document.getElementById('input-day');
const inputHourlyRate = document.querySelectorAll('.input-hourly-rate');

// Инпуты во вкладке «1. Простая формула»
const inputApproximateTime = document.getElementById('approximate-time');
const inputSfTotalPrice = document.getElementById('input-sf-total-price');

// Инпуты во вкладке «2. RAP»
const inputRate = document.getElementById('input-rate');
const inputRapTotalPrice = document.getElementById('input-rap-total-price');

// Инпуты во вкладке «3. Формула с коэффициентом правок»
const inputAmountFixed = document.getElementById('input-amount-fixed');
const inputWorkingHours = document.getElementById('input-working-hours');
const inputRangeRisk = document.getElementById('input-range-risk');
const ratioRangeRisk = document.getElementById('ratio-range-risk');
const inputCfTotalPrice = document.getElementById('input-cf-total-price');

// Инициализировать значение диапазона
(function () {
  ratioRangeRisk.value = inputRangeRisk.value;
})();

// Преобразовать строковое значение инпута в число
const countingAvailableMoney = (str) => (str.value ? parseFloat(str.value) : 0);

// Валидировать значение инпута «Стоимость проекта»
function isValidInput(input) {
  if (!input || !isFinite(input) || Math.sign(input) === -1) {
    input = 0;
  }

  let numbFmt = input.toLocaleString('ru-RU');

  return numbFmt;
}

// Высчитать коэффициент правок
function сalcEditRate(input) {
  let amountFixed = countingAvailableMoney(input);

  if (amountFixed === 0 || amountFixed === 1) {
    return (amountFixed = 1);
  } else if (amountFixed > 0 && amountFixed % 3 === 1) {
    return (amountFixed + 2) * 0.5;
  } else if (amountFixed % 3 === 2) {
    return (amountFixed + 1) * 0.5;
  } else if (amountFixed % 3 === 0) {
    return amountFixed * 0.5;
  }
}

// Высчитать почасовую ставку
function handlerHourlyRate(month, week, day) {
  let hourlyRate =
    countingAvailableMoney(month) /
    countingAvailableMoney(week) /
    countingAvailableMoney(day);

  inputHourlyRate.forEach((input) => {
    input.value = `${isValidInput(hourlyRate)} ₽`;
  });
}

// Обработать стоимость проекта по сложной формуле
function handlerComplexFormula(amount, hours, risks) {
  const cfTotalPrice =
    parseInt(inputHourlyRate[0].value.replace(/\s/g, '')) *
    сalcEditRate(amount) *
    countingAvailableMoney(hours) *
    countingAvailableMoney(risks);

  inputCfTotalPrice.value = `${isValidInput(cfTotalPrice)} ₽`;
}

// Рассчитать почасовую ставку
const inputs = document.querySelectorAll('[data-hourly-rate]');
for (input of inputs) {
  input.addEventListener('input', () => {
    handlerHourlyRate(inputMonth, inputWeek, inputDay);
  });
}

// Получить значение из диапазона
ratioRangeRisk.addEventListener('input', (e) => {
  inputRangeRisk.value = e.target.value;
});

// Рассчитать стоимость проекта по простой формуле
inputApproximateTime.addEventListener('input', () => {
  const sfTotalPrice =
    parseInt(inputHourlyRate[0].value.replace(/\s/g, '')) *
    countingAvailableMoney(inputApproximateTime);

  inputSfTotalPrice.value = `${isValidInput(sfTotalPrice)} ₽`;
});

// Рассчитать стоимость проекта по методу RAP
inputRate.addEventListener('input', () => {
  const rate = countingAvailableMoney(inputRate);
  const rateTotalPrice = rate + (rate / 100) * 20;

  inputRapTotalPrice.value = `${isValidInput(rateTotalPrice)} ₽`;
});

// Рассчитать стоимость проекта по сложной формуле
const inputsComplexFormula = document.querySelectorAll('[data-fixed-price]');
for (input of inputsComplexFormula) {
  input.addEventListener('input', () => {
    handlerComplexFormula(inputAmountFixed, inputWorkingHours, inputRangeRisk);
  });
}
