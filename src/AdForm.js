// src/components/AdForm.js
import React, { useState } from "react";
import CurrencyExchange from "./CurrencyExchange";

const AdForm = () => {
  const [sellCurrency, setSellCurrency] = useState("usd");
  const [buyCurrency, setBuyCurrency] = useState("rub");
  const [amount, setAmount] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [cities, setCities] = useState([]);
  const [comment, setComment] = useState("");
  const [exchangeMethod, setExchangeMethod] = useState([]);
  const [delivery, setDelivery] = useState("free");

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

  const handleSubmit = () => {
    const messageParts = [];

    // Основное сообщение с валютой и суммой
    if (sellCurrency && buyCurrency) {
      const amountPart = amount ? ` (${amount})` : "";
      messageParts.push(
        `Продам ${sellCurrency.toUpperCase()}${amountPart} за ваши ${buyCurrency.toUpperCase()}`
      );
    }

    // Геолокация
    if (cities.length > 0) {
      messageParts.push(`📍 ${cities.join(", ")}`);
    }

    // Курс
    if (pricePerUnit) {
      messageParts.push(`💵 Курс: ${pricePerUnit || exchangeRate.toFixed(2)}`);
    }

    // Доставка
    if (delivery !== "free") {
      messageParts.push(`🚚 Доставка: ${delivery} SAR`);
    } else {
      messageParts.push("🚚 Доставка: бесплатная");
    }

    // Комментарий (без заголовка)
    if (comment) {
      messageParts.push(comment);
    }

    const formattedMessage = messageParts.join("\n");
    const telegramUrl = `tg://msg_url?url=t.me/jdjdndjdjddnsnajoalancnc&text=${encodeURIComponent(
      formattedMessage
    )}`;
    alert(telegramUrl);
    window.open(telegramUrl, "_blank");
  };

  return (
    <div class="container mx-auto p-4">
      <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4 text-center">
          Создать объявление
        </h1>

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

        <CurrencyExchange
          sellCurrency={sellCurrency}
          buyCurrency={buyCurrency}
          onRateChange={handleRateChange}
        />

        <label className="block mb-2">Сумма продажи:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="block w-full mb-4 p-2 border rounded"
        />

        <label className="block mb-2">Цена за единицу (курс валют):</label>
        <input
          type="number"
          value={pricePerUnit}
          onChange={(e) => setPricePerUnit(e.target.value)}
          placeholder={exchangeRate?.toFixed(2) || "Загрузка..."}
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

        <label className="block mb-2">Доставка:</label>
        <div className="flex space-x-4 mb-4">
          <label>
            <input
              type="radio"
              name="delivery"
              value="free"
              checked={delivery === "free"}
              onChange={() => setDelivery("free")}
            />{" "}
            Бесплатная
          </label>
          <label>
            <input
              type="radio"
              name="delivery"
              value="paid"
              onChange={() => setDelivery("")}
            />{" "}
            Указать сумму
          </label>
          {delivery !== "free" && (
            <input
              type="number"
              placeholder="Сумма"
              value={delivery}
              onChange={(e) => setDelivery(e.target.value)}
              className="block w-full p-2 border rounded"
            />
          )}
        </div>

        <label className="block mb-2">Комментарий:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="block w-full mb-4 p-2 border rounded"
          placeholder="Ваш комментарий"
        ></textarea>

        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-blue-600 text-white rounded-lg"
        >
          Опубликовать
        </button>
      </div>
    </div>
  );
};

export default AdForm;
