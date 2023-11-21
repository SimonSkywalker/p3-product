"use client"
// TextInputComponent.tsx
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

interface TextInputProps {
  jsonData: {
    description: string;
    mandatory: boolean;
    userDisplay: boolean;
    questionType: number;
    saveRole: boolean;
    options: any[string];
    type: number;
    range: number;
  };
  onUserInput: any;
  currentQuestionIndex: number;
  userResponses: any[];
}

export default function TextInputComponent({ jsonData, onUserInput, currentQuestionIndex, userResponses } : TextInputProps) {
  // State variable to track the input value
  const [inputValue, setInputValue] = useState(userResponses[currentQuestionIndex] || '');

  // useEffect to handle initial setup and update input value
  useEffect(() => {
    // Set the initial user response value on component mount
    if ((Array.isArray(userResponses[currentQuestionIndex]) && !userResponses[currentQuestionIndex] && userResponses[currentQuestionIndex][0] === -1) || typeof userResponses[currentQuestionIndex] == 'undefined') {
      // This will set userResponses[currentQuestionIndex] only if it's not already set
      onUserInput('');
    }

    // Update the input value when the current question changes
    setInputValue(userResponses[currentQuestionIndex] || '');
  }, [currentQuestionIndex, userResponses]);

  // Event handler for input value change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    adjustHeight();

    // Send the response to the parent component
    onUserInput(newValue);
  };

  const textbox = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    if (textbox.current) {
      textbox.current.style.height = "inherit";
      textbox.current.style.height = `${textbox.current.scrollHeight}px`;
    }
  }

  useLayoutEffect(adjustHeight, []);

  // Return the JSX structure for the component
  return (
    <form>
      <h3 className="text-center text-base font-bold mb-5">
        {jsonData.description}{jsonData.mandatory && <span style={{ color: 'red' }}>*</span>}
      </h3>
      <div>
        <textarea
          ref={textbox}
          className="min-h-[5.5rem] border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter your answer here."
        />
      </div>
      {/*
        <p>DEBUG: Inputted text: {inputValue}</p>
      */}
    </form>
  );
}
