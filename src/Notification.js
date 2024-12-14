import React, { useState, useEffect } from "react";

const Notification = ({ message, duration }) => {
    const [secondsLeft, setSecondsLeft] = useState(duration / 1000);
  
    useEffect(() => {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
  
      return () => clearInterval(timer);
    }, []);
  
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-black text-white px-4 py-2 mb-16 rounded shadow-lg flex items-center space-x-2 animate-fade-in-out">
        <span>{message}</span>
        <span className="text-gray-300">({secondsLeft}s)</span>
      </div>
    );
  };

  export default Notification;
