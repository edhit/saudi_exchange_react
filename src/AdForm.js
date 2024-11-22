// src/components/AdForm.js
import React, { useEffect, useRef, useState } from "react";
import CurrencyExchange from "./CurrencyExchange";
import Notification from "./Notification";

const AdForm = () => {
  const [greeting, setGreeting] = useState("");
  const [transactionType, setTransactionType] = useState("Продам");
  const [sellCurrency, setSellCurrency] = useState("sar");
  const [buyCurrency, setBuyCurrency] = useState("rub");
  const [amount, setAmount] = useState("");
  const [rateOption, setRateOption] = useState("noRate");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [, setExchangeRate] = useState(null);
  const [cities, setCities] = useState([]);
  const [comment, setComment] = useState("");
  const [exchangeMethod, setExchangeMethod] = useState([]);
  const [delivery, setDelivery] = useState("none");
  const [checkboxOptions, setCheckboxOptions] = useState([]); // Состояние для чекбоксов

  const [isUrgent, setIsUrgent] = useState(false); // Состояние для кнопки "СРОЧНО"
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false); // копия во все проекты
  const [showTooltip, setShowTooltip] = useState(false); // подсказка
  const [showCopyHint, setShowCopyHint] = useState(false);
  const [highlightCopyButton, setHighlightCopyButton] = useState(false);
  const previewRef = useRef(null);
  const commentRef = useRef(null);
  const [paddingBottom, setPaddingBottom] = useState(0);

  useEffect(() => {
    // Очистка стилей при размонтировании компонента
    return () => {
      setPaddingBottom(0);
    };
  }, []);

  const handleRateChange = (rate) => {
    setExchangeRate(rate);
  };

  const handleCityCheckboxChange = (city) => {
    setCities((prevCities) => {
      if (prevCities.includes(city)) {
        return prevCities.filter((c) => c !== city);
      } else {
        return [...prevCities, city];
      }
    });
  };

  const handleExchangeMethodChange = (method) => {
    setExchangeMethod((prev) => {
      if (prev.includes(method)) {
        return prev.filter((m) => m !== method);
      } else {
        return [...prev, method];
      }
    });
  };

  // Функция для смены валют местами
  const swapCurrencies = () => {
    setSellCurrency(buyCurrency);
    setBuyCurrency(sellCurrency);
  };

  const handleGenerateMessage = () => {
    const messageParts = [];

    // Добавляем приветствие, если выбрано
    if (greeting) {
      messageParts.push(greeting);
    }

    if (sellCurrency && buyCurrency) {
      const amountPart = amount ? `${amount} ` : "";
      const currencies = Object.keys(checkboxOptions)
      let text = buyCurrency.toUpperCase()
      for (let index = 0; index < currencies.length; index++) {
        if (currencies[index] !== buyCurrency)
        text = `${text}, ${currencies[index].toUpperCase()}`
      }

      if (transactionType === "Продам") {
        messageParts.push(
          `Продам ${amountPart}${sellCurrency.toUpperCase()} за ${text}`
        );
      } else if (transactionType === "Куплю") {
        messageParts.push(
          `Куплю ${amountPart}${sellCurrency.toUpperCase()} за ${text}`
        );
      } else if (transactionType === "Меняю") {
        messageParts.push(
          `Меняю ${amountPart}${sellCurrency.toUpperCase()} на ${text}`
        );
      }
    }

    if (cities.length > 0) {
      messageParts.push(`📍 ${cities.join(", ")}`);
    }

    if (rateOption === "customRate") {
      if (pricePerUnit) {
        messageParts.push(`💵 Курс: ${pricePerUnit}`);
      }
    } else if (rateOption === "googleRate") {
      messageParts.push(`💵 Курс Google`);
    } else if (rateOption === "messageMe") {
      messageParts.push(`💵 За курсом в ЛС`);
    }

    if (exchangeMethod.length > 0) {
      messageParts.push(`🔄 ${exchangeMethod.join(", ")}`);
    }

    if (delivery === "free") {
      messageParts.push("🚚 Доставка: бесплатная");
    } else if (delivery !== "none") {
      messageParts.push(`🚚 Доставка: ${delivery} SAR`);
    }

    if (comment) {
      messageParts.push(comment);
    }

    if (isUrgent) {
      messageParts.push('')
      messageParts.push('🚨 Срочно!!!')
    }

    const formattedMessage = messageParts.join("\n");
    setGeneratedMessage(formattedMessage);

    // Показать указатель и подсветить кнопку "Копировать"
    setShowCopyHint(true);
    setShowTooltip(true);
    setHighlightCopyButton(true);

    // Скрыть указатель и подсветку через 3 секунды
    setTimeout(() => {
      setShowCopyHint(false);
      setShowTooltip(false);
      setHighlightCopyButton(false);
    }, 3000);

    // Скролл до конца страницы
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000); // Уведомление исчезает через 3 секунды
  };

  const handleFocus = () => {
    // Определение высоты видимой области и поля textarea
    const textareaHeight = commentRef.current?.offsetHeight || 0;

    // Установка отступа, чтобы поле не скрывалось клавиатурой
    const keyboardHeightEstimate = window.innerHeight * 0.35; // Примерная высота клавиатуры (можно уточнить)
    setPaddingBottom(keyboardHeightEstimate + textareaHeight);

    // Прокрутка к полю
    setTimeout(() => {
      commentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  };

  const handleBlur = () => {
    // Сброс отступа при снятии фокуса с поля ввода
    setPaddingBottom(0);
  };

  const toggleCheckbox = (option) => {
    setCheckboxOptions((prevState) => ({
      ...prevState,
      [option]: !prevState[option],
    }));
  };

  // Функция для переключения "СРОЧНО ОБЪЯВЛЕНИЕ"
  const handleUrgentToggle = () => {
    setIsUrgent((prev) => !prev);
  };

  return (
    <div class="container mx-auto p-4">
      <div style={{ paddingBottom: `${paddingBottom}px` }}>
        <div className="p-4 max-w-md mx-auto bg-white rounded-lg">
          <h1 className="text-xl font-bold mb-4 text-center">
            🇸🇦 Обмен валюты в Саудии
          </h1>

          {/* Чекбокс "СРОЧНО ОБЪЯВЛЕНИЕ" */}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleUrgentToggle}
              className={`px-4 py-2 rounded-lg border-2 w-full ${
                isUrgent
                  ? "bg-red-500 text-white border-red-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300"
              }`}
            >
              🚨 СРОЧНОЕ ОБЪЯВЛЕНИЕ
            </button>
          </div>

          {/* Чекбоксы для приветствия */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Приветствие</label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "السلام عليكم", value: "السلام عليكم" },
                { label: "السلام عليكم ورحمة الله وبركاته", value: "السلام عليكم ورحمة الله وبركاته" },
                { label: "Без приветствия", value: "Без приветствия" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setGreeting(option.value)}
                  className={`px-4 py-2 rounded-lg ${
                    greeting === option.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div class="relative flex items-center mb-6">
            <div class="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Радиокнопки для выбора типа сделки */}
          <div className="flex space-x-2 mb-4">
            {["Продам", "Куплю", "Меняю"].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  value={type}
                  checked={transactionType === type}
                  onChange={() => setTransactionType(type)}
                  className="hidden"
                />
                <span
                  className={`px-6 py-3 text-xl rounded-lg cursor-pointer ${
                    transactionType === type
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {type}
                </span>
              </label>
            ))}
          </div>

          <div className="flex items-center mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Валюта {transactionType === "Куплю" ? "покупки" : "продажи"}
              </label>
              <select
                value={sellCurrency}
                onChange={(e) => setSellCurrency(e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="usd">USD</option>
                <option value="usdt">USDT</option>
                <option value="eur">EUR</option>
                <option value="rub">RUB</option>
                <option value="kzt">KZT</option>
                <option value="uzs">UZS</option>
                <option value="sar">SAR</option>
              </select>
            </div>

            {/* Кнопка для смены валют */}
            <button
              onClick={swapCurrencies}
              className="mx-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-sm flex items-center justify-center"
              aria-label="Поменять валюты местами"
            >
              🔁
            </button>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Валюта {transactionType === "Куплю" ? "продажи" : "покупки"}
              </label>
              <select
                value={buyCurrency}
                onChange={(e) => setBuyCurrency(e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="usd">USD</option>
                <option value="usdt">USDT</option>
                <option value="eur">EUR</option>
                <option value="rub">RUB</option>
                <option value="kzt">KZT</option>
                <option value="uzs">UZS</option>
                <option value="sar">SAR</option>
              </select>
            </div>
          </div>

          <div class="relative flex items-center mb-2">
            <div class="flex-grow border-t border-gray-300"></div>
            <span class="mx-4 text-gray-500">
              или (валюта {transactionType === "Куплю" ? "продажи" : "покупки"})
            </span>
            <div class="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: "USD", value: "usd" },
              { label: "USDT", value: "usdt" },
              { label: "EUR", value: "eur" },
              { label: "RUB", value: "rub" },
              { label: "KZT", value: "kzt" },
              { label: "UZS", value: "usz" },
              { label: "SAR", value: "sar" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => toggleCheckbox(option.value)}
                className={`px-4 py-2 rounded-lg mb-2 ${
                  checkboxOptions[option.value]
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label className="block mb-2 font-semibold">
            Сумма {transactionType === "Куплю" ? "покупки" : "продажи"}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full mb-4 p-2 border rounded"
          />

          <div className="my-4">
            <label className="block mb-2 font-semibold">Курс</label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Не указывать курс", value: "noRate" },
                { label: "Указать курс", value: "customRate" },
                { label: "Курс Google", value: "googleRate" },
                { label: "За курсом в ЛС", value: "messageMe" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setRateOption(option.value)}
                  className={`px-4 py-2 rounded-lg ${
                    rateOption === option.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Поле для указания курса (отображается, если выбрано "указать курс") */}
          {rateOption === "customRate" && (
            <div className="my-4 p-4 border-2 border-blue-500 bg-blue-100 rounded-lg">
              <label className="block text-blue-700 font-bold mb-2">
                Цена за единицу (курс валют)
              </label>
              <CurrencyExchange
                sellCurrency={sellCurrency}
                buyCurrency={buyCurrency}
                onRateChange={handleRateChange}
              />
              <input
                type="number"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                // placeholder={exchangeRate?.toFixed(2) || "Загрузка..."}
                className="block w-full mb-4 p-2 border rounded"
              />
            </div>
          )}

          <label className="block mb-2 font-semibold">Город</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {["Медина", "Мекка", "Джидда", "Эр-Рияд"].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => handleCityCheckboxChange(city)}
                className={`px-4 py-2 rounded-lg ${
                  cities.includes(city)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <label className="block mb-2 font-semibold">Способ обмена</label>
          <div className="flex gap-2 mb-4">
            {["Перевод", "Наличка"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => handleExchangeMethodChange(method)}
                className={`px-4 py-2 rounded-lg ${
                  exchangeMethod.includes(method)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          <label className="block mt-2 font-semibold">Доставка</label>
          <div className="flex flex-wrap gap-2 mt-1">
            <button
              type="button"
              onClick={() => setDelivery("free")}
              className={`px-4 py-2 rounded-lg ${
                delivery === "free"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Бесплатная
            </button>
            <button
              type="button"
              onClick={() => setDelivery("none")}
              className={`px-4 py-2 rounded-lg ${
                delivery === "none"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Без доставки
            </button>
            <button
              type="button"
              onClick={() => setDelivery("")}
              className={`px-4 py-2 rounded-lg ${
                delivery !== "free" && delivery !== "none"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Указать сумму
            </button>
            {delivery !== "free" && delivery !== "none" && (
              <input
                type="number"
                placeholder="Сумма"
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
                className="mt-2 p-2 border rounded w-full"
              />
            )}
          </div>

          <label className="block mt-2 font-semibold">Комментарий</label>
          <textarea
            value={comment}
            ref={commentRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setComment(e.target.value)}
            className="block w-full mb-4 p-2 border rounded"
            placeholder="Подъеду в любое удобное для вас место"
          ></textarea>

          <button
            onClick={handleGenerateMessage}
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 relative"
          >
            Сгенерировать сообщение
            {showTooltip && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-base px-3 py-1 rounded shadow-lg">
                Проверьте сообщение, скопируйте и вставьте в группу телеграмм
              </div>
            )}
          </button>

          {/* Функция ввывода */}
          {generatedMessage && (
            <div className="mt-4" ref={previewRef}>
              <h3 className="font-bold mb-2">Предпросмотр сообщения</h3>
              <div className="p-3 bg-gray-100 rounded border">
                <pre className="whitespace-pre-wrap">{generatedMessage}</pre>
              </div>
              <div className="relative mt-4">
                {showCopyHint && (
                  <div className="absolute text-4xl left-1/2 transform -translate-x-1/2 -top-7 text-sm text-gray-600 animate-bounce-down">
                    👇
                  </div>
                )}
                <button
                  onClick={handleCopyToClipboard}
                  className={`w-full mt-2 px-4 py-2 text-white rounded ${
                    highlightCopyButton ? "bg-green-400" : "bg-green-500"
                  } hover:bg-green-600`}
                >
                  Копировать сообщение
                </button>
              </div>
            </div>
          )}

          {showNotification && (
            <Notification
              message="Сообщение скопировано в буфер обмена"
              duration={3000}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdForm;
