"use client"
// AgreeDisagreeComponent.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
// https://www.npmjs.com/package/rc-slider
// Import Slider component from 'rc-slider' library
import Slider from "rc-slider";
// Import styles for the Slider component
import './rc-slider.css';

interface AgreeDisagreeProps {
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

export default function AgreeDisagreeComponent({ jsonData, onUserInput, currentQuestionIndex, userResponses } : AgreeDisagreeProps) {
  // State variable to track the slider value
  const [sliderValue, setSliderValue] = useState(userResponses[currentQuestionIndex] || Math.ceil(jsonData.range / 2));
  const [selectedResponse, setSelectedResponse] = useState(userResponses[currentQuestionIndex]);

  const responseOptions = {
    9: [
      "Strongly Disagree",
      "Disagree",
      "Moderately Disagree",
      "Slightly Disagree",
      "Neutral",
      "Slightly Agree",
      "Moderately Agree",
      "Agree",
      "Strongly Agree"
    ],
    7: [
      "Strongly Disagree",
      "Disagree",
      "Somewhat Disagree",
      "Neutral",
      "Somewhat Agree",
      "Agree",
      "Strongly Agree"
    ],
    5: [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    3: [
      "Disagree",
      "Neutral",
      "Agree"
    ]
  };

  // useEffect to handle initial setup and update slider value
  useEffect(() => {
    // Set the initial state only on the first render
    if (typeof selectedResponse == 'undefined') {
      setSelectedResponse(Math.ceil(jsonData.range / 2));
    }

    // Set the initial user response value on component mount
    if ((Array.isArray(userResponses[currentQuestionIndex]) && 
        !userResponses[currentQuestionIndex] && 
        userResponses[currentQuestionIndex][0] !== -1) || 
        typeof userResponses[currentQuestionIndex] == 'undefined') {
      // This will set userResponses[currentQuestionIndex] only if it's not already set
      onUserInput(Math.ceil(jsonData.range / 2));
    }

    // Update the slider value when the current question changes
    setSliderValue(userResponses[currentQuestionIndex] || Math.ceil(jsonData.range / 2));
  }, [currentQuestionIndex, userResponses, selectedResponse]);

  // Event handler for slider value change
  const handleSliderChange = (value: number | number[]) => {
    const sliderValue = Array.isArray(value) ? value[0] : value;
    setSliderValue(sliderValue);
    setSelectedResponse(sliderValue);
    // Send the response to the parent component
    onUserInput(sliderValue);
  };

  // Return the JSX structure for the component
  return (
    <form>
      <h3 className="text-center text-base font-bold mb-5">
        {jsonData.description}{jsonData.mandatory && <span style={{ color: 'red' }}>*</span>}
      </h3>
      <div
        id="react1"
        style={{
          display: (jsonData.range === 3 || jsonData.range === 5 || jsonData.range === 7 || jsonData.range === 9) ? (userResponses[currentQuestionIndex] === 1 ? 'block' : 'none') : 'none',
        }}
        className="border mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
      >
        <Image
          priority
          src="/emojis/1.svg"
          height={64}
          width={64}
          alt={String(responseOptions[jsonData.range as keyof typeof responseOptions][selectedResponse - 1]) + " Emoji"}
        />
      </div>
      <div
        id="react2"
        style={{
          display: (jsonData.range === 7 || jsonData.range === 9) ? (userResponses[currentQuestionIndex] === 2 ? 'block' : 'none') : 'none',
        }}
        className="border mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
      >
        <Image
          priority
          src="/emojis/2.svg"
          height={64}
          width={64}
          alt={String(responseOptions[jsonData.range as keyof typeof responseOptions][selectedResponse - 1]) + " Emoji"}
        />
      </div>
      <div
        id="react3"
        style={{
          display: (jsonData.range === 5) ? (userResponses[currentQuestionIndex] === 2 ? 'block' : 'none') : jsonData.range === 9 ? (userResponses[currentQuestionIndex] === 3 ? 'block' : 'none') : 'none',
        }}
        className="border mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
      >
        <Image
          priority
          src="/emojis/3.svg"
          height={64}
          width={64}
          alt={String(responseOptions[jsonData.range as keyof typeof responseOptions][selectedResponse - 1]) + " Emoji"}
        />
      </div>
      <div
        id="react4"
        style={{
          display: (jsonData.range === 7) ? (userResponses[currentQuestionIndex] === 3 ? 'block' : 'none') : jsonData.range === 9 ? (userResponses[currentQuestionIndex] === 4 ? 'block' : 'none') : 'none',
        }}
        className="border mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
      >
        <Image
          priority
          src="/emojis/4.svg"
          height={64}
          width={64}
          alt={String(responseOptions[jsonData.range as keyof typeof responseOptions][selectedResponse - 1]) + " Emoji"}
        />
      </div>
      <div
        id="react5"
        style={{
          display: !userResponses[currentQuestionIndex] ? 'block' : jsonData.range === 3 ? (userResponses[currentQuestionIndex] === 2 ? 'block' : 'none') : jsonData.range === 5 ? (userResponses[currentQuestionIndex] === 3 ? 'block' : 'none') : jsonData.range === 7 ? (userResponses[currentQuestionIndex] === 4 ? 'block' : 'none') : jsonData.range === 9 ? (userResponses[currentQuestionIndex] === 5 ? 'block' : 'none') : 'none',
        }}
        className="border mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
      >
        <Image
          priority
          src="/emojis/5.svg"
          height={64}
          width={64}
          alt={String(responseOptions[jsonData.range as keyof typeof responseOptions][selectedResponse - 1]) + " Emoji"}
        />
      </div>
      <div
        id="react6"
        style={{
          display: (jsonData.range === 7) ? (userResponses[currentQuestionIndex] === 5 ? 'block' : 'none') : jsonData.range === 9 ? (userResponses[currentQuestionIndex] === 6 ? 'block' : 'none') : 'none',
        }}
        className="border mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
      >
        <Image
          priority
          src="/emojis/6.svg"
          height={64}
          width={64}
          alt={String(responseOptions[jsonData.range as keyof typeof responseOptions][selectedResponse - 1]) + " Emoji"}
        />
      </div>
      <div
        id="react7"
        style={{
          display: (jsonData.range === 5) ? (userResponses[currentQuestionIndex] === 4 ? 'block' : 'none') : jsonData.range === 9 ? (userResponses[currentQuestionIndex] === 7 ? 'block' : 'none') : 'none',
        }}
        className="border mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
      >
        <Image
          priority
          src="/emojis/7.svg"
          height={64}
          width={64}
          alt={String(responseOptions[jsonData.range as keyof typeof responseOptions][selectedResponse - 1]) + " Emoji"}
        />
      </div>
      <div
        id="react8"
        style={{
          display: (jsonData.range === 7) ? (userResponses[currentQuestionIndex] === 6 ? 'block' : 'none') : jsonData.range === 9 ? (userResponses[currentQuestionIndex] === 8 ? 'block' : 'none') : 'none',
        }}
        className="border mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
      >
        <Image
          priority
          src="/emojis/8.svg"
          height={64}
          width={64}
          alt={String(responseOptions[jsonData.range as keyof typeof responseOptions][selectedResponse - 1]) + " Emoji"}
        />
      </div>
      <div
        id="react9"
        style={{
          display: (jsonData.range === 5) ? (userResponses[currentQuestionIndex] === 5 ? 'block' : 'none') : jsonData.range === 7 ? (userResponses[currentQuestionIndex] === 7 ? 'block' : 'none') : jsonData.range === 9 ? (userResponses[currentQuestionIndex] === 9 ? 'block' : 'none') : 'none',
        }}
        className="border mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
      >
        <Image
          priority
          src="/emojis/9.svg"
          height={64}
          width={64}
          alt={String(responseOptions[jsonData.range as keyof typeof responseOptions][selectedResponse - 1]) + " Emoji"}
        />
      </div>
      <div
        id="react10"
        style={{
          display: (jsonData.range === 3) ? (userResponses[currentQuestionIndex] === 3 ? 'block' : 'none') : 'none',
        }}
        className="border mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
      >
        <Image
          priority
          src="/emojis/10.svg"
          height={64}
          width={64}
          alt={String(responseOptions[jsonData.range as keyof typeof responseOptions][selectedResponse - 1]) + " Emoji"}
        />
      </div>
      <p className="text-sm leading-none text-center text-gray-600">
      <span id="exp">
        {/* keyof typeof responseOptions: Returns the union of keys of the type returned by typeof responseOptions. In this case, it's 9, 7, 5, and 3. */}
        {responseOptions[jsonData.range as keyof typeof responseOptions][selectedResponse - 1]}
      </span>
      </p>
      <div className="slider mt-4 mb-4 mx-auto ">
        { // New Slider
        <Slider
          onChange={(value) => {
            handleSliderChange(value);
          }}
          dots
          value={sliderValue}
          min={1}
          max={(jsonData.range)}
          step={1}
          styles={{
            handle: {
              borderColor: "#0075ff",
              backgroundColor: "#0075ff",
              opacity: 1
            },
            track: {
              backgroundColor: "#0075ff"
            }
          }}
        />
        }
        {/* // Change For Jest
        <input
          onChange={(e) => {
            handleSliderChange(Number(e.target.value));
          }}
          className="w-full cursor-pointer rounded-full "
          type="range"
          role="slider"
          value={sliderValue}
          min={1}
          max={(jsonData.range)}
          step={1}
        />
        */}
      </div>
      {/*
        <p>DEBUG: Selected value: {sliderValue}</p>
      */}
    </form>
  );
}