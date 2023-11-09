"use client"
// TextInputComponent.js
import React, { useState, useEffect } from 'react';

export default function TextInputComponent({ jsonData, onUserInput, currentQuestionIndex, userResponses }) {
  const [inputValue, setInputValue] = useState(userResponses[currentQuestionIndex] || '');

  useEffect(() => {
    // Update the input value when the current question changes
    setInputValue(userResponses[currentQuestionIndex] || '');
  }, [currentQuestionIndex, userResponses]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Send the response to the parent component
    onUserInput(newValue);
  };

  return (
    <form>
      <h3>{jsonData.description}{jsonData.mandatory && <span style={{ color: 'red' }}>*</span>}</h3>
      <div>
        <input
          className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
    </form>
  );
}
