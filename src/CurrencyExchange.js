// src/components/CurrencyExchange.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CurrencyExchange = ({ sellCurrency, buyCurrency, onRateChange }) => {
  const [rate, setRate] = useState(null);

  useEffect(() => {
    const fetchRate = async () => {
      const baseCurrency = sellCurrency === 'usdt' ? 'usd' : sellCurrency;
      
      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        let rate = response.data.rates[(buyCurrency === 'usdt' ? 'usd' : buyCurrency).toUpperCase()];

        if (rate < 1) {
          rate = 1 / rate;
          rate = `1 ${buyCurrency.toUpperCase()} = ${rate.toFixed(2)} ${sellCurrency.toUpperCase()}`
        } else {
          rate = `1 ${sellCurrency.toUpperCase()} = ${rate.toFixed(2)} ${buyCurrency.toUpperCase()}`
        }

        setRate(rate);
        onRateChange(rate);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };
    fetchRate();
  }, [sellCurrency, buyCurrency, onRateChange]);

  return (
    <div className="text-gray-700">
      <p>Курс: {rate ? rate : 'Загрузка...'}</p>
    </div>
  );
};

export default CurrencyExchange;
