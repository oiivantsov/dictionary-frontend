import React, { useState } from 'react';

const DaysDialog = ({ isOpen, onClose, onApply }) => {
  const [inputDays, setInputDays] = useState('');

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h4>Дни</h4>
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
          Применить
        </button>
      </div>
    </div>
  );
};

export default DaysDialog;
