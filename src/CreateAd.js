import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateAd = () => {
    const [sellCurrency, setSellCurrency] = useState('usd');
    const [buyCurrency, setBuyCurrency] = useState('rub');
    const [exchangeRate, setExchangeRate] = useState(null);
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState('');
    const [comment, setComment] = useState('');
    const [ads, setAds] = useState([]);

    const currencies = ['usdt', 'rub', 'kzt', 'usd', 'uzs'];

    useEffect(() => {
        fetchExchangeRate();
    }, [sellCurrency, buyCurrency]);

    const fetchExchangeRate = async () => {
        try {
            const fromCurrency = sellCurrency === 'usdt' ? 'usd' : sellCurrency;
            const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
            setExchangeRate(response.data.rates[buyCurrency.toUpperCase()]);
        } catch (error) {
            console.error('Ошибка получения курса:', error);
        }
    };

    const handleSubmit = () => {
        // Добавление нового объявления
        setAds([...ads, { id: Date.now(), sellCurrency, buyCurrency, amount, price, comment, exchangeRate }]);
        clearForm();
    };

    const clearForm = () => {
        setSellCurrency('usd');
        setBuyCurrency('rub');
        setAmount('');
        setPrice('');
        setComment('');
    };

    const handleDelete = (id) => {
        setAds(ads.filter(ad => ad.id !== id));
    };

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold">Создать объявление</h2>
            </div>
            <div>
                <label className="block text-sm font-medium">Продаю валюту:</label>
                <select 
                    className="w-full p-2 border rounded" 
                    value={sellCurrency} 
                    onChange={(e) => setSellCurrency(e.target.value)}
                >
                    {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency.toUpperCase()}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium">Покупаю валюту:</label>
                <select 
                    className="w-full p-2 border rounded" 
                    value={buyCurrency} 
                    onChange={(e) => setBuyCurrency(e.target.value)}
                >
                    {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency.toUpperCase()}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium">Курс обмена на exchangeRate:</label>
                <p className="p-2 border rounded bg-gray-100">{exchangeRate ? `${exchangeRate} ${buyCurrency.toUpperCase()}` : 'Загрузка...'}</p>
            </div>

            <div>
                <label className="block text-sm font-medium">Сумма:</label>
                <input 
                    type="number" 
                    className="w-full p-2 border rounded" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Цена за единицу:</label>
                <input 
                    type="number" 
                    className="w-full p-2 border rounded" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Комментарий:</label>
                <textarea 
                    className="w-full p-2 border rounded" 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>

            <button 
                onClick={handleSubmit} 
                className="w-full p-2 bg-blue-500 text-white rounded"
            >
                Отправить объявление
            </button>

            {/* Список объявлений пользователя */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold">Ваши объявления</h2>
                <div className="space-y-4 mt-4">
                    {ads.map(ad => (
                        <div key={ad.id} className="p-4 border rounded-lg bg-gray-100">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold">{ad.sellCurrency} → {ad.buyCurrency}</h3>
                                <p className="text-blue-500 font-bold">{ad.rate} {ad.buyCurrency}</p>
                            </div>
                            <p><span className="font-medium">Сумма:</span> {ad.amount}</p>
                            <p><span className="font-medium">Цена за единицу:</span> {ad.price} {ad.sellCurrency}</p>
                            <p className="text-sm text-gray-600"><span className="font-medium">Комментарий:</span> {ad.comment}</p>
                            <div className="flex justify-end mt-2">
                                <button 
                                    onClick={() => handleDelete(ad.id)} 
                                    className="text-red-500 font-medium hover:underline"
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreateAd;
