import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { load } from 'cheerio';

// https://cors.bridged.cc/

const CurrencyExchange = ({ sellCurrency, buyCurrency, onRateChange }) => {
  const [exchangeRate, setExchangeRate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getExchangeRate = async () => {
      try {
        if (sellCurrency === "USDT") {
          sellCurrency = "USD"
        }

        if (buyCurrency === "USDT") {
          buyCurrency = "USD"
        }

        const url = `https://api.allorigins.win/get?url=https://www.google.com/search?q=${sellCurrency}+to+${buyCurrency}`;
        const { data } = await axios.get(url);
        const $ = load(data);

        // Получаем курс
        const rate = $('span[data-precision]').first().text();
        
        // Проверяем курс на меньше нуля
        if (rate) {
          const parsedRate = parseFloat(rate.replace(',', '.')); // Конвертируем строку в число

          if (parsedRate < 0) {
            // Если курс меньше нуля, получаем курс от buyCurrency к sellCurrency
            const reverseUrl = `https://api.allorigins.win/get?url=https://www.google.com/search?q=${buyCurrency}+to+${sellCurrency}`;
            const reverseData = await axios.get(reverseUrl);
            const reverse$ = load(reverseData.data);
            const reverseRate = reverse$('span[data-precision]').first().text();

            if (reverseRate) {
              const parsedReverseRate = parseFloat(reverseRate.replace(',', '.'));
              setExchangeRate(parsedReverseRate);
              onRateChange(parsedReverseRate);
            } else {
              setError('Ошибка: курс не найден.');
            }
          } else {
            setExchangeRate(parsedRate);
            onRateChange(parsedRate);
          }
        } else {
          setError('Ошибка: курс не найден.');
        }
      } catch (err) {
        console.error('Ошибка при получении данных:', err);
        setError('Ошибка при получении данных');
      }
    };

    getExchangeRate();
  }, [sellCurrency, buyCurrency]);

  return (
    <div className="currency-exchange-container">
      {error && <p className="text-red-500">{error}</p>}
      {exchangeRate && (
        <div className="exchange-rate-card">
          <p className="exchange-rate-title">
            Курс {sellCurrency} к {buyCurrency}
          </p>
          <p className="exchange-rate-value">
            <strong>{exchangeRate}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrencyExchange;
