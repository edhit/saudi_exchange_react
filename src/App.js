// src/App.js
import React, { useEffect } from 'react';
import AdForm from './AdForm';

const App = () => {
  useEffect(() => {
    window.Telegram.WebApp.ready();
  }, []);

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <AdForm />
    </div>
  );
};

export default App;
