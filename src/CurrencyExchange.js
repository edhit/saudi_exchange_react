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
        const rate = response.data.rates[buyCurrency.toUpperCase()];
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
      <p>Курс: {rate ? rate.toFixed(2) : 'Загрузка...'}</p>
    </div>
  );
};

export default CurrencyExchange;
