import React, { useState, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const translations = {
  fi: {
    days: 'Päivät',
    apply: 'Hyväksy',
  },
  ru: {
    days: 'Дни',
    apply: 'Применить',
  },
  en: {
    days: 'Days',
    apply: 'Apply',
  },
};

const DaysDialog = ({ isOpen, onClose, onApply }) => {
  const [inputDays, setInputDays] = useState('');
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.fi;


  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h4>{t.days}</h4>
        <input
          type="number"
          value={inputDays}
          onChange={(e) => setInputDays(e.target.value)}
          className="form-control mb-3"
          placeholder="количество дней"
        />
        <button
          className="btn btn-primary"
          onClick={() => {
            onApply(Number(inputDays)); // Pass the input to parent
            setInputDays(''); // Clear input field
            onClose(); // Close dialog
          }}
          disabled={!inputDays} // Disable button if no input
        >
          {t.apply}
        </button>
      </div>
    </div>
  );
};

export default DaysDialog;
