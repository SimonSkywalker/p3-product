"use client"
// SliderComponent.js
import React, { useState, useEffect } from 'react';
//https://www.npmjs.com/package/rc-slider
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';

export default function SliderComponent({ jsonData, onUserInput, currentQuestionIndex, userResponses }) {

  const [sliderValue, setSliderValue] = useState(userResponses[currentQuestionIndex] || Math.ceil(jsonData.range / 2));

  useEffect(() => {
    // Set the initial user response value on component mount
    if ((Array.isArray(userResponses[currentQuestionIndex]) && !userResponses[currentQuestionIndex] && userResponses[currentQuestionIndex][0] !== -1) || typeof userResponses[currentQuestionIndex] == 'undefined') {
      // This will set userResponses[currentQuestionIndex] only if it's not already set
      onUserInput(Math.ceil(jsonData.range / 2));
    }

    // Update the slider value when the current question changes
    setSliderValue(userResponses[currentQuestionIndex] || Math.ceil(jsonData.range / 2));
  }, [currentQuestionIndex, userResponses]);

  const handleSliderChange = (e) => {
    const value = parseInt(e);
    setSliderValue(value);
    // Send the response to the parent component
    onUserInput(value);
  };

  const generateMarks = (range) => {
    const marks = {};
    for (let i = 1; i <= range; i++) {
      marks[i] = i.toString();
    }
    return marks;
  };

  return (
    <form>
      <h3>{jsonData.description}{jsonData.mandatory && <span style={{ color: 'red' }}>*</span>}</h3>
      <div className="w-full px-1 mb-7">
        <Slider id="slider"
          onChange={(e) => {
            handleSliderChange(e);
          } }
          type="range"
          value={sliderValue}
          min={1}
          max={(jsonData.range)}
          step={1} 
          marks={generateMarks(jsonData.range)}
        />
      </div>
      {/*
        <p className="mt-5">DEBUG: Selected value: {sliderValue}</p>
      */}
    </form>
  );
}