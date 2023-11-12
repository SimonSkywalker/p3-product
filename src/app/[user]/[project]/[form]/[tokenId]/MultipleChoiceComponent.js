"use client"
// MultipleChoiceComponent.js
import React, { useState, useEffect } from 'react';

export default function MultipleChoiceComponent({ jsonData, onUserInput, currentQuestionIndex, userResponses }) {
  const initialOptions = userResponses && userResponses[currentQuestionIndex] ? userResponses[currentQuestionIndex] : [];
  const [selectedOptions, setSelectedOptions] = useState(initialOptions);

  useEffect(() => {
    // Send the response to the parent component when selectedOptions change
    if ((Array.isArray(userResponses[currentQuestionIndex]) && !userResponses[currentQuestionIndex] && userResponses[currentQuestionIndex][0] !== -1) || typeof userResponses[currentQuestionIndex] == 'undefined') {
      // This will set userResponses[currentQuestionIndex] only if it's not already set
      onUserInput([]);
    }

    onUserInput(selectedOptions);
  }, [selectedOptions]); // Only re-run the effect when selectedOptions change

  const handleOptionSelect = (optionIndex) => {
    if (jsonData.type === 0) {
      // Radio buttons
      setSelectedOptions([optionIndex]);
    } else {
      // Checkboxes
      if (selectedOptions.includes(optionIndex)) {
        // Remove the option if it's already selected
        setSelectedOptions(selectedOptions.filter(index => index !== optionIndex));
      } else {
        // Add the option if it's not selected
        setSelectedOptions([...selectedOptions, optionIndex]);
      }
    }
  };

  return (
    <form>
        <h3>{jsonData.description}{jsonData.mandatory && <span style={{ color: 'red' }}>*</span>}</h3>
            {jsonData.options.map((option, optionIndex) => (
            <div className="flex items-center mb-4" key={optionIndex}>
                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                {jsonData.type === 0 ? ( // Display radio buttons if type is 0
                    <input
                      type="radio"
                      onChange={() => handleOptionSelect(optionIndex)}
                      checked={selectedOptions.includes(optionIndex)}
                      value={option}
                      name={jsonData.description}
                      className="w-4 h-4"
                    />
                ) : (
                    // Display checkboxes if type is 1
                    <input
                      type="checkbox"
                      onChange={() => handleOptionSelect(optionIndex)}
                      checked={selectedOptions.includes(optionIndex)}
                      value={option}
                      name={jsonData.description}
                      className="w-4 h-4"
                    />
                )}
                {option}
                </label>
            </div>
            ))}
            {
              <p>DEBUG: Selected options: {selectedOptions.join(', ')}</p>
            }
    </form>
  );
}