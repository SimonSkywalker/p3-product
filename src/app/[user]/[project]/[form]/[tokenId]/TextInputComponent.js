"use client"
// TextInputComponent.js
import React, { useState, useEffect } from 'react';

export default function TextInputComponent({ jsonData, onUserInput, currentQuestionIndex, userResponses }) {
  const [inputValue, setInputValue] = useState(userResponses[currentQuestionIndex] || '');

  useEffect(() => {
    // Set the initial user response value on component mount
    if (Array.isArray(userResponses[currentQuestionIndex]) && !userResponses[currentQuestionIndex] && userResponses[currentQuestionIndex][0] === -1) {
      // This will set userResponses[currentQuestionIndex] only if it's not already set
      onUserInput('');
    }

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
