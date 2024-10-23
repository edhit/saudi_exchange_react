import React, { useState, useEffect } from 'react';
import CurrencyExchange from './CurrencyExchange'; // Импортируйте ваш новый компонент
import axios from 'axios'; // Используем axios для отправки данных на сервер

const tg = window.Telegram.WebApp;

const App = () => {
  const [loading, setLoading] = useState(true);
  const [sellCurrency, setSellCurrency] = useState('RUB');
  const [buyCurrency, setBuyCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [username, setUsername] = useState('');

  const currencies = ['RUB', 'USD', 'KZT', 'USDT'];

  useEffect(() => {
    tg?.ready();
    setTimeout(() => setLoading(false), 2000); // Загрузка на 2 секунды

    // Получаем username из Telegram WebApp
    if (tg?.initDataUnsafe?.user) {
      setUsername(tg.initDataUnsafe.user.username);
    }
  }, []);

  const handleSubmit = () => {
    const adData = {
      sellCurrency,
      buyCurrency,
      amount,
      price,
      description,
      exchangeRate,
      username, // Добавляем username из Telegram
    };

    console.log(adData);

    // Отправка данных в Telegram (как было ранее)
    tg?.sendData(JSON.stringify(adData));
    
    // Отправка данных на сервер
    axios.post('https://your-server-url.com/api/create-ad', adData)
      .then((response) => {
        console.log('Данные успешно отправлены на сервер:', response.data);
        alert('Объявление создано!');
      })
      .catch((error) => {
        console.error('Ошибка при отправке данных на сервер:', error);
        alert('Ошибка при создании объявления.');
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-telegramGray">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-telegramBlue text-lg">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-telegramGray min-h-screen p-4">
      <div className="bg-white shadow-lg rounded-lg p-4 max-w-md mx-auto">
        <h2 className="text-telegramBlue text-lg font-semibold mb-4">Создать объявление</h2>
        
        <div className="mb-3">
          <label className="block text-sm mb-1">Я хочу продать:</label>
          <select
            value={sellCurrency}
            onChange={(e) => setSellCurrency(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Я хочу купить:</label>
          <select
            value={buyCurrency}
            onChange={(e) => setBuyCurrency(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {currencies
              .filter(currency => currency !== sellCurrency)
              .map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
          </select>
        </div>

        {/* Компонент для отображения курса валют */}
        <CurrencyExchange 
          sellCurrency={sellCurrency} 
          buyCurrency={buyCurrency} 
          onRateChange={setExchangeRate} 
        />

        <div className="mb-3">
          <label className="block text-sm mb-1">Количество для продажи:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Введите количество"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Цена за единицу:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Введите цену"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Описание:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Дополнительная информация..."
          ></textarea>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-telegramBlue text-white w-full rounded px-3 py-2"
        >
          Опубликовать объявление
        </button>
      </div>
    </div>
  );
};

export default App;
