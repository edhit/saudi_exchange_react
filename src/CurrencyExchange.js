import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CurrencyExchange = ({ sellCurrency, buyCurrency, onRateChange }) => {
  const [rate, setRate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        let response = await axios.get(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${sellCurrency}.json`);
        let rate = response.data[sellCurrency][buyCurrency];

        if (rate < 1) {
          response = await axios.get(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${buyCurrency}.json`);
          rate = response.data[buyCurrency][sellCurrency];
          rate = `1 ${buyCurrency.toUpperCase()} = ${rate.toFixed(2)} ${sellCurrency.toUpperCase()}`;
        } else {
          rate = `1 ${sellCurrency.toUpperCase()} = ${rate.toFixed(2)} ${buyCurrency.toUpperCase()}`;
        }

        setRate(rate);
        onRateChange(rate);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchRate();
  }, [sellCurrency, buyCurrency, onRateChange]);

  const handleButtonClick = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Показывает сообщение на 3 секунды
  };

  return (
    <div className="text-gray-700 relative">
      <div className="flex items-center space-x-2">
        <p>Курс: {rate ? rate : 'Загрузка...'}</p>
        <button
          className="text-xs bg-gray-200 hover:bg-gray-300 p-1 rounded"
          onClick={handleButtonClick}
        >
          ⓘ
        </button>
      </div>

      {/* Всплывающее сообщение */}
      {showPopup && (
        <div className="absolute bottom-0 right-0 mb-4 mr-4 p-2 bg-blue-100 border border-blue-300 text-blue-800 rounded shadow-md">
          Курс обновляется раз в день
        </div>
      )}
    </div>
  );
};

export default CurrencyExchange;
