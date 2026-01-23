import { useState } from 'react';
import Button from '../Buttons/Button';
import './Alert.css';

const Alert = ({ type = 'info', message, dismissible = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const typeClasses = {
    success: 'alertSuccess',
    error: 'alertError',
    warning: 'alertWarning',
    info: 'alertInfo'
  };

  if (!isVisible) return null;

  return (
    <div className={`alert ${typeClasses[type]}`}>
      <span className="alertMessage">{message}</span>
      {dismissible && (
        <Button
          variant="ghost"
          size="small"
          onClick={() => setIsVisible(false)}
          className="alertClose"
        >
          ×
        </Button>
      )}
    </div>
  );
};

export default Alert;