import React from 'react';

const ViewAds = () => {
    // Пример данных объявлений
    const ads = [
        { 
            id: 1, 
            sellCurrency: 'USD', 
            buyCurrency: 'RUB', 
            rate: '75.5', 
            amount: '100', 
            price: '75.5', 
            comment: 'Обмен без комиссии', 
            telegramId: 'username1' 
        },
        {
            id: 2, 
            sellCurrency: 'USDT', 
            buyCurrency: 'KZT', 
            rate: '450', 
            amount: '500', 
            price: '450', 
            comment: 'Преимущество - быстрое завершение сделки!', 
            telegramId: 'username2'
        }
        // Добавьте больше объявлений при необходимости
    ];

    // Функция открытия диалога с пользователем в Telegram
    const openTelegramChat = (telegramId) => {
        window.open(`https://t.me/${telegramId}`, '_blank');
    };

    return (
        <div className="space-y-4">
            {ads.map(ad => (
                <div 
                    key={ad.id} 
                    onClick={() => openTelegramChat(ad.telegramId)}
                    className="p-4 border rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">{ad.sellCurrency} → {ad.buyCurrency}</h2>
                        <p className="text-blue-500 font-bold">{ad.rate} {ad.buyCurrency}</p>
                    </div>
                    <p><span className="font-medium">Сумма:</span> {ad.amount}</p>
                    <p><span className="font-medium">Цена за единицу:</span> {ad.price} {ad.sellCurrency}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">Комментарий:</span> {ad.comment}</p>
                </div>
            ))}
        </div>
    );
};

export default ViewAds;
