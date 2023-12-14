import React, { useState, useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000); // Close the notification after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const getBackgroundColor = () => {
    return type === 'success' ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 p-4 text-white ${getBackgroundColor()} transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {message}
    </div>
  );
};

export default Notification;
