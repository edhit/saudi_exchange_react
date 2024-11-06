// src/components/AdForm.js
import React, { useEffect, useRef, useState } from "react";
import CurrencyExchange from "./CurrencyExchange";
import Notification from "./Notification";

const AdForm = () => {
  const [greeting, setGreeting] = useState('');
  const [sellCurrency, setSellCurrency] = useState("usd");
  const [buyCurrency, setBuyCurrency] = useState("rub");
  const [amount, setAmount] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [, setExchangeRate] = useState(null);
  const [cities, setCities] = useState([]);
  const [comment, setComment] = useState("");
  const [exchangeMethod, setExchangeMethod] = useState([]);
  const [delivery, setDelivery] = useState("none");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false); // копия во все проекты
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

  const handleGenerateMessage = () => {
    const messageParts = [];

    // Добавляем приветствие, если выбрано
    if (greeting) {
      messageParts.push(greeting);
    }

    if (sellCurrency && buyCurrency) {
      const amountPart = amount ? `${amount} ` : '';
      messageParts.push(`Продам ${amountPart}${sellCurrency.toUpperCase()} за ваши ${buyCurrency.toUpperCase()}`);
    }

    if (cities.length > 0) {
      messageParts.push(`📍 ${cities.join(', ')}`);
    }

    if (pricePerUnit) {
      messageParts.push(`💵 Курс: ${pricePerUnit}`);
    }

    if (exchangeMethod.length > 0) {
      messageParts.push(`🔄 Обмен: ${exchangeMethod.join(', ')}`);
    }

    if (delivery === 'free') {
      messageParts.push('🚚 Доставка: бесплатная');
    } else if (delivery !== 'none') {
      messageParts.push(`🚚 Доставка: ${delivery} SAR`);
    }

    if (comment) {
      messageParts.push(comment);
    }

    const formattedMessage = messageParts.join('\n');
    setGeneratedMessage(formattedMessage);

    // Скролл до конца страницы
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      commentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  const handleBlur = () => {
    // Сброс отступа при снятии фокуса с поля ввода
    setPaddingBottom(0);
  };

  return (
    <div class="container mx-auto p-4">
      <div  style={{ paddingBottom: `${paddingBottom}px` }}>
      <div className="p-4 max-w-md mx-auto bg-white rounded-lg">
        <h1 className="text-xl font-bold mb-4 text-center">🇸🇦 Обмен валюты в Саудии</h1>

      {/* Чекбоксы для приветствия */}
      <div className="mb-4">
        <label className="block font-bold mb-2">Приветствие:</label>
        <label className="flex items-center">
          <input
            type="radio"
            name="greeting"
            value="السلام عليكم"
            onChange={(e) => setGreeting(e.target.value)}
            className="mr-2"
          />
          السلام عليكم
        </label>
        <label className="flex items-center mt-2">
          <input
            type="radio"
            name="greeting"
            value="السلام عليكم ورحمة الله وبركاته"
            onChange={(e) => setGreeting(e.target.value)}
            className="mr-2"
          />
          السلام عليكم ورحمة الله وبركاته
        </label>
        <label className="flex items-center mt-2">
          <input
            type="radio"
            name="greeting"
            value=""
            onChange={(e) => setGreeting('')}
            className="mr-2"
            defaultChecked
          />
          Без приветствия
        </label>
      </div>

        <label className="block mb-2">Вы продаете:</label>
        <select
          value={sellCurrency}
          onChange={(e) => setSellCurrency(e.target.value)}
          className="block w-full mb-4 p-2 border rounded"
        >
          <option value="usd">USD</option>
          <option value="usdt">USDT</option>
          <option value="rub">RUB</option>
          <option value="kzt">KZT</option>
          <option value="uzs">UZS</option>
          <option value="sar">SAR</option>
        </select>

        <label className="block mb-2">Вы покупаете:</label>
        <select
          value={buyCurrency}
          onChange={(e) => setBuyCurrency(e.target.value)}
          className="block w-full mb-4 p-2 border rounded"
        >
          <option value="usd">USD</option>
          <option value="usdt">USDT</option>
          <option value="rub">RUB</option>
          <option value="kzt">KZT</option>
          <option value="uzs">UZS</option>
          <option value="sar">SAR</option>
        </select>

        <label className="block mb-2">Сумма продажи:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="block w-full mb-4 p-2 border rounded"
        />

        <label className="block mb-2">Цена за единицу (курс валют):</label>
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

        <label className="block mb-2">Выбор города:</label>
        <div className="mb-4 space-y-2">
          {["Медина", "Мекка", "Джидда", "Эр-Рияд"].map((city) => (
            <label key={city} className="flex items-center">
              <input
                type="checkbox"
                value={city}
                onChange={() => handleCityCheckboxChange(city)}
                className="mr-2"
              />
              {city}
            </label>
          ))}
        </div>

        <label className="block mb-2">Способ обмена:</label>
        <div className="flex space-x-4 mb-4">
          <label>
            <input
              type="checkbox"
              onChange={() => handleExchangeMethodChange("Перевод")}
            />{" "}
            Перевод
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => handleExchangeMethodChange("Наличка")}
            />{" "}
            Наличка
          </label>
        </div>

        <label className="block mt-2">Доставка:</label>
        <div className="flex flex-col mt-1">
          <label>
            <input
              type="radio"
              name="delivery"
              value="free"
              checked={delivery === "free"}
              onChange={() => setDelivery("free")}
              className="mr-2"
            />
            Бесплатная
          </label>
          <label className="mt-2">
            <input
              type="radio"
              name="delivery"
              value="none"
              checked={delivery === "none"}
              onChange={() => setDelivery("none")}
              className="mr-2"
            />
            Без доставки
          </label>
          <label className="mt-2 flex items-start">
            <input
              type="radio"
              name="delivery"
              value="custom"
              checked={delivery !== "free" && delivery !== "none"}
              onChange={() => setDelivery("")}
              className="mr-2"
            />
            <span className="flex flex-col">
              <span>Указать сумму:</span>
              {delivery !== "free" && delivery !== "none" && (
                <input
                  type="number"
                  placeholder="Сумма"
                  value={
                    delivery !== "free" && delivery !== "none" ? delivery : ""
                  }
                  onChange={(e) => setDelivery(e.target.value)}
                  className="mt-1 border p-1 rounded w-full"
                />
              )}
              {delivery !== "free" && delivery !== "none" && (
                <span className="mt-1 text-sm text-gray-500">SAR</span>
              )}
            </span>
          </label>
        </div>

        <label className="block mb-2">Комментарий:</label>
        <textarea
          value={comment}
          ref={commentRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => setComment(e.target.value)}
          className="block w-full mb-4 p-2 border rounded"
          placeholder="Ваш комментарий"
        ></textarea>

        <button
          onClick={handleGenerateMessage}
          className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Сгенерировать сообщение
        </button>

        {/* Функция ввывода */}
        {generatedMessage && (
          <div className="mt-4" ref={previewRef}>
            <h3 className="font-bold mb-2">Предпросмотр сообщения:</h3>
            <div className="p-3 bg-gray-100 rounded border">
              <pre className="whitespace-pre-wrap">{generatedMessage}</pre>
            </div>
            <button
              onClick={handleCopyToClipboard}
              className="w-full mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Копировать сообщение
            </button>
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
