"use client"
// AgreeDisagreeComponent.tsx
import React, { useState, useEffect } from 'react';

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

  // useEffect to handle initial setup and update slider value
  useEffect(() => {
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
  }, [currentQuestionIndex, userResponses]);

  // Event handler for slider value change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    // Send the response to the parent component
    onUserInput(value);
  };

  // Event handler for additional change
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const react1 = document.querySelector<HTMLElement>("#react1")!;
    const react2 = document.querySelector<HTMLElement>("#react2")!;
    const react3 = document.querySelector<HTMLElement>("#react3")!;
    const react4 = document.querySelector<HTMLElement>("#react4")!;
    const react5 = document.querySelector<HTMLElement>("#react5")!;
    const react6 = document.querySelector<HTMLElement>("#react6")!;
    const react7 = document.querySelector<HTMLElement>("#react7")!;
    const react8 = document.querySelector<HTMLElement>("#react8")!;
    const react9 = document.querySelector<HTMLElement>("#react9")!;
    const react10 = document.querySelector<HTMLElement>("#react10")!;

    if (jsonData.range === 9) {
      switch (parseInt(e.target.value)) {
        case 1:
          react1.style.display = "block";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 2:
          react1.style.display = "none";
          react2.style.display = "block";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 3:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "block";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 4:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "block";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 5:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "block";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 6:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "block";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 7:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "block";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 8:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "block";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 9:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "block";
          react10.style.display = "none";
          break;
        default:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "block";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
      }
    } else if (jsonData.range === 7) {
      switch (parseInt(e.target.value)) {
        case 1:
          react1.style.display = "block";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 2:
          react1.style.display = "none";
          react2.style.display = "block";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 3:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "block";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 4:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "block";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 5:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "block";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 6:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "block";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 7:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "block";
          react10.style.display = "none";
          break;
        default:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "block";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
      }
    } else if (jsonData.range === 5) {
      switch (parseInt(e.target.value)) {
        case 1:
          react1.style.display = "block";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 2:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "block";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 3:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "block";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 4:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "block";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 5:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "block";
          react10.style.display = "none";
          break;
        default:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "block";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
      }
    } else if (jsonData.range === 3) {
      switch (parseInt(e.target.value)) {
        case 1:
          react1.style.display = "block";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 2:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "block";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
        case 3:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "none";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "block";
          break;
        default:
          react1.style.display = "none";
          react2.style.display = "none";
          react3.style.display = "none";
          react4.style.display = "none";
          react5.style.display = "block";
          react6.style.display = "none";
          react7.style.display = "none";
          react8.style.display = "none";
          react9.style.display = "none";
          react10.style.display = "none";
          break;
      }
    }
  };

  // Return the JSX structure for the component
  return (
    <form>
      <div>
        <div className="py-12 px-4">
          <div className=" mx-auto container lg:max-w-[356px] md:max-w-[720px] max-w-[343px] py-8 px-8 bg-white shadow rounded-md">
            <p className="text-base font-semibold leading-normal text-center text-gray-800">
              {jsonData.description}{jsonData.mandatory && <span style={{ color: 'red' }}>*</span>}
            </p>
            <div
              id="react1"
              style={{
                display: (jsonData.range === 3 || jsonData.range === 5 || jsonData.range === 7 || jsonData.range === 9) ? (userResponses[currentQuestionIndex] === 1 ? 'block' : 'none') : 'none',
              }}
              className="border  mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
            >
              <svg viewBox="0 0 61.706 61.708" width="61.706" height="61.708" xmlns="http://www.w3.org/2000/svg">
                <path fill="#D62E45" d="M 30.854 3.117 C 46.174 3.117 58.596 15.531 58.596 30.857 C 58.596 46.177 46.174 58.59 30.854 58.59 C 15.531 58.59 3.111 46.177 3.111 30.857 C 3.111 15.531 15.531 3.117 30.854 3.117"/>
                <polygon fill="#5B0000" points="43.15 22.889 47.701 18.01 45.753 16.059 40.872 20.615 35.996 16.059 34.045 18.01 38.598 22.889 34.045 27.767 35.996 29.713 40.872 25.166 45.753 29.713 47.701 27.767"/>
                <path fill="#5B0000" d="M 13.234 42.396 L 14.861 44.025 C 18.698 40.966 22.793 39.474 27.217 39.015 L 28.583 47.28 C 28.974 49.678 31.119 50.975 34.044 50.975 C 37.103 50.975 40.94 49.162 40.94 45.908 C 40.94 45.254 40.418 42.396 40.028 40.25 C 42.303 41.094 44.579 42.332 46.728 44.025 L 48.352 42.396 C 43.798 36.869 37.298 34.275 30.795 34.275 C 24.288 34.275 17.786 36.869 13.234 42.396 Z M 32.624 37.812 L 34.527 38.156 L 36.001 46.542 L 34.188 46.837 L 32.624 37.812 Z"/>
                <polygon fill="#5B0000" points="22.991 22.889 27.54 18.01 25.591 16.059 20.713 20.615 15.835 16.059 13.888 18.01 18.437 22.889 13.888 27.767 15.835 29.713 20.713 25.166 25.591 29.713 27.54 27.767"/>
                <path fill="#5B0000" d="M 30.854 3.117 C 46.174 3.117 58.596 15.531 58.596 30.857 C 58.596 46.177 46.174 58.59 30.854 58.59 C 15.531 58.59 3.111 46.177 3.111 30.857 C 3.111 15.531 15.531 3.117 30.854 3.117 M 30.854 0 C 13.84 0 0 13.85 0 30.857 C 0 47.86 13.841 61.708 30.854 61.708 C 47.864 61.708 61.706 47.86 61.706 30.857 C 61.706 13.85 47.864 0 30.854 0 Z"/>
              </svg>
            </div>
            <div
              id="react2"
              style={{
                display: (jsonData.range === 7 || jsonData.range === 9) ? (userResponses[currentQuestionIndex] === 2 ? 'block' : 'none') : 'none',
              }}
              className="border  mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
            >
              <svg viewBox="0 0 61.706 61.708" width="61.706" height="61.708" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EB4138" d="M 30.854 3.117 C 46.174 3.117 58.594 15.531 58.594 30.857 C 58.594 46.177 46.174 58.59 30.854 58.59 C 15.531 58.59 3.109 46.177 3.109 30.857 C 3.109 15.531 15.531 3.117 30.854 3.117"/>
                <path fill="#5B0200" d="M 30.983 35.719 C 25.132 35.719 17.981 38.321 14.076 45.471 L 15.703 46.769 C 20.254 42.223 25.457 40.92 30.983 40.92 C 36.51 40.92 41.715 42.223 46.264 46.769 L 47.891 45.471 C 43.991 38.32 36.837 35.719 30.983 35.719 Z"/>
                <polygon fill="#5B0200" points="38.786 23.357 47.891 18.479 46.591 16.207 33.583 22.06 33.583 24.66 46.591 30.514 47.891 28.236"/>
                <polygon fill="#5B0200" points="28.383 22.06 15.375 16.207 14.076 18.479 23.181 23.357 14.076 28.236 15.375 30.514 28.383 24.66"/>
                <path fill="#5B0200" d="M 30.854 3.117 C 46.174 3.117 58.594 15.531 58.594 30.857 C 58.594 46.177 46.174 58.59 30.854 58.59 C 15.531 58.59 3.109 46.177 3.109 30.857 C 3.109 15.531 15.531 3.117 30.854 3.117 M 30.854 0 C 13.838 0 0 13.85 0 30.857 C 0 47.86 13.839 61.708 30.854 61.708 C 47.862 61.708 61.706 47.86 61.706 30.857 C 61.706 13.85 47.862 0 30.854 0 Z"/>
              </svg>
            </div>
            <div
              id="react3"
              style={{
                display: (jsonData.range === 5) ? (userResponses[currentQuestionIndex] === 2 ? 'block' : 'none') : jsonData.range === 9 ? (userResponses[currentQuestionIndex] === 3 ? 'block' : 'none') : 'none',
              }}
              className="border  mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
            >
              <svg viewBox="0 0 61.702 61.708" width="61.702" height="61.708" xmlns="http://www.w3.org/2000/svg">
                <path fill="#F1661F" d="M 30.856 3.117 C 46.176 3.117 58.601 15.531 58.601 30.857 C 58.601 46.177 46.176 58.59 30.856 58.59 C 15.539 58.59 3.113 46.177 3.113 30.857 C 3.113 15.531 15.539 3.117 30.856 3.117"/>
                <path fill="#680F00" d="M 30.846 35.271 C 24.987 35.271 17.838 37.871 13.936 45.021 L 15.563 46.324 C 20.114 41.773 25.319 40.47 30.846 40.47 C 36.372 40.47 41.568 41.773 46.124 46.324 L 47.753 45.021 C 43.851 37.871 36.699 35.271 30.846 35.271 Z"/>
                <path fill="#680F00" d="M 39.3 16.407 C 36.758 16.407 34.748 19.334 34.748 22.915 C 34.748 26.485 36.758 29.412 39.3 29.412 C 41.831 29.412 43.851 26.485 43.851 22.915 C 43.851 19.334 41.831 16.407 39.3 16.407 Z"/>
                <path fill="#680F00" d="M 22.384 16.407 C 19.853 16.407 17.838 19.334 17.838 22.915 C 17.838 26.485 19.853 29.412 22.384 29.412 C 24.926 29.412 26.946 26.485 26.946 22.915 C 26.945 19.334 24.926 16.407 22.384 16.407 Z"/>
                <path fill="#680F00" d="M 30.856 3.117 C 46.176 3.117 58.601 15.531 58.601 30.857 C 58.601 46.177 46.176 58.59 30.856 58.59 C 15.539 58.59 3.113 46.177 3.113 30.857 C 3.113 15.531 15.539 3.117 30.856 3.117 M 30.856 0 C 13.84 0 0 13.85 0 30.857 C 0 47.86 13.841 61.708 30.856 61.708 C 47.864 61.708 61.702 47.86 61.702 30.857 C 61.702 13.85 47.864 0 30.856 0 Z"/>
              </svg>
            </div>
            <div
              id="react4"
              style={{
                display: (jsonData.range === 7) ? (userResponses[currentQuestionIndex] === 3 ? 'block' : 'none') : jsonData.range === 9 ? (userResponses[currentQuestionIndex] === 4 ? 'block' : 'none') : 'none',
              }}
              className="border  mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
            >
              <svg viewBox="0 0 61.708 61.708" width="61.708" height="61.708" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FF9C00" d="M 30.856 3.117 C 46.181 3.117 58.596 15.531 58.596 30.857 C 58.596 46.177 46.181 58.59 30.856 58.59 C 15.525 58.59 3.116 46.177 3.116 30.857 C 3.116 15.531 15.525 3.117 30.856 3.117"/>
                <path fill="#782B00" d="M 39.547 15.928 C 37.016 15.928 35.001 18.854 35.001 22.43 C 35.001 26.006 37.016 28.932 39.547 28.932 C 42.089 28.932 44.114 26.006 44.114 22.43 C 44.114 18.854 42.089 15.928 39.547 15.928 Z"/>
                <path fill="#782B00" d="M 22.645 15.928 C 20.108 15.928 18.099 18.854 18.099 22.43 C 18.099 26.006 20.108 28.932 22.645 28.932 C 25.187 28.932 27.196 26.006 27.196 22.43 C 27.196 18.854 25.187 15.928 22.645 15.928 Z"/>
                <polygon fill="#782B00" points="16.664 32.666 15.035 36.246 39.943 47.491 41.509 43.914"/>
                <path fill="#782B00" d="M 30.856 3.117 C 46.181 3.117 58.596 15.531 58.596 30.857 C 58.596 46.177 46.181 58.59 30.856 58.59 C 15.525 58.59 3.116 46.177 3.116 30.857 C 3.116 15.531 15.525 3.117 30.856 3.117 M 30.856 0 C 13.843 0 0 13.85 0 30.857 C 0 47.86 13.844 61.708 30.856 61.708 C 47.864 61.708 61.708 47.86 61.708 30.857 C 61.707 13.85 47.864 0 30.856 0 Z"/>
              </svg>
            </div>
            <div
              id="react5"
              style={{
                display: !userResponses[currentQuestionIndex] ? 'block' : jsonData.range === 3 ? (userResponses[currentQuestionIndex] === 2 ? 'block' : 'none') : jsonData.range === 5 ? (userResponses[currentQuestionIndex] === 3 ? 'block' : 'none') : jsonData.range === 7 ? (userResponses[currentQuestionIndex] === 4 ? 'block' : 'none') : jsonData.range === 9 ? (userResponses[currentQuestionIndex] === 5 ? 'block' : 'none') : 'none',
              }}
              className="border  mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
            >
              <svg viewBox="0 0 61.708 61.708" width="61.708" height="61.708" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFCE00" d="M 30.852 3.117 C 46.177 3.117 58.603 15.531 58.603 30.857 C 58.603 46.177 46.177 58.59 30.852 58.59 C 15.542 58.59 3.113 46.177 3.113 30.857 C 3.112 15.531 15.542 3.117 30.852 3.117"/>
                <rect x="17.193" y="38.82" fill="#7F4601" width="27.308" height="3.902"/>
                <path fill="#7F4601" d="M 39.3 15.928 C 36.759 15.928 34.749 18.854 34.749 22.43 C 34.749 26.006 36.759 28.932 39.3 28.932 C 41.837 28.932 43.847 26.006 43.847 22.43 C 43.847 18.854 41.837 15.928 39.3 15.928 Z"/>
                <path fill="#7F4601" d="M 22.398 15.928 C 19.857 15.928 17.836 18.854 17.836 22.43 C 17.836 26.006 19.857 28.932 22.398 28.932 C 24.93 28.932 26.945 26.006 26.945 22.43 C 26.945 18.854 24.93 15.928 22.398 15.928 Z"/>
                <path fill="#7F4601" d="M 30.852 3.117 C 46.177 3.117 58.603 15.531 58.603 30.857 C 58.603 46.177 46.177 58.59 30.852 58.59 C 15.542 58.59 3.113 46.177 3.113 30.857 C 3.112 15.531 15.542 3.117 30.852 3.117 M 30.852 0 C 13.85 0 0 13.85 0 30.857 C 0 47.86 13.85 61.708 30.852 61.708 C 47.871 61.708 61.708 47.86 61.708 30.857 C 61.708 13.85 47.87 0 30.852 0 Z"/>
              </svg>
            </div>
            <div
              id="react6"
              style={{
                display: (jsonData.range === 7) ? (userResponses[currentQuestionIndex] === 5 ? 'block' : 'none') : jsonData.range === 9 ? (userResponses[currentQuestionIndex] === 6 ? 'block' : 'none') : 'none',
              }}
              className="border  mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
            >
              <svg viewBox="0 0 61.703 61.708" width="61.703" height="61.708" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFEC01" d="M 30.852 3.117 C 46.166 3.117 58.591 15.531 58.591 30.857 C 58.591 46.177 46.166 58.59 30.852 58.59 C 15.526 58.59 3.101 46.177 3.101 30.857 C 3.101 15.531 15.525 3.117 30.852 3.117"/>
                <path fill="#7A5C00" d="M 39.353 16.185 C 36.822 16.185 34.796 19.117 34.796 22.693 C 34.796 26.269 36.821 29.201 39.353 29.201 C 41.895 29.201 43.91 26.269 43.91 22.693 C 43.91 19.117 41.895 16.185 39.353 16.185 Z"/>
                <path fill="#7A5C00" d="M 22.444 16.185 C 19.902 16.185 17.888 19.117 17.888 22.693 C 17.888 26.269 19.902 29.201 22.444 29.201 C 24.986 29.201 26.991 26.269 26.991 22.693 C 26.991 19.117 24.986 16.185 22.444 16.185 Z"/>
                <path fill="#7A5C00" d="M 32.012 39.865 C 33.636 39.865 37.422 39.865 39.564 37.592 L 40.07 37.033 L 42.486 38.187 L 42.074 39.115 C 40.345 42.924 35.746 44.279 32.012 44.279 L 24.122 44.273 L 24.122 39.859 L 32.012 39.865 Z"/>
                <path fill="#7A5C00" d="M 30.852 3.117 C 46.166 3.117 58.591 15.531 58.591 30.857 C 58.591 46.177 46.166 58.59 30.852 58.59 C 15.526 58.59 3.101 46.177 3.101 30.857 C 3.101 15.531 15.525 3.117 30.852 3.117 M 30.852 0 C 13.838 0 0 13.85 0 30.857 C 0 47.86 13.838 61.708 30.852 61.708 C 47.854 61.708 61.703 47.86 61.703 30.857 C 61.702 13.85 47.854 0 30.852 0 Z"/>
              </svg>
            </div>
            <div
              id="react7"
              style={{
                display: (jsonData.range === 5) ? (userResponses[currentQuestionIndex] === 4 ? 'block' : 'none') : jsonData.range === 9 ? (userResponses[currentQuestionIndex] === 7 ? 'block' : 'none') : 'none',
              }}
              className="border  mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
            >
              <svg viewBox="0 0 61.714 61.708" width="61.714" height="61.708" xmlns="http://www.w3.org/2000/svg">
                <path fill="#E6EB00" d="M 30.862 3.117 C 46.176 3.117 58.602 15.531 58.602 30.857 C 58.602 46.177 46.176 58.59 30.862 58.59 C 15.526 58.59 3.122 46.177 3.122 30.857 C 3.122 15.531 15.526 3.117 30.862 3.117"/>
                <path fill="#5E5B00" d="M 47.496 33.752 C 42.612 38.947 38.056 41.553 30.904 41.553 C 23.752 41.553 19.207 38.948 14.334 33.752 L 12.699 35.049 C 15.959 42.201 23.11 46.757 30.904 46.757 C 38.71 46.757 45.86 42.201 49.12 35.049 L 47.496 33.752 Z"/>
                <path fill="#5E5B00" d="M 39.363 16.185 C 36.821 16.185 34.806 19.117 34.806 22.693 C 34.806 26.269 36.821 29.201 39.363 29.201 C 41.895 29.201 43.909 26.269 43.909 22.693 C 43.909 19.117 41.895 16.185 39.363 16.185 Z"/>
                <path fill="#5E5B00" d="M 22.456 16.185 C 19.925 16.185 17.899 19.117 17.899 22.693 C 17.899 26.269 19.924 29.201 22.456 29.201 C 24.998 29.201 27.002 26.269 27.002 22.693 C 27.002 19.117 24.998 16.185 22.456 16.185 Z"/>
                <path fill="#5E5B00" d="M 30.862 3.117 C 46.176 3.117 58.602 15.531 58.602 30.857 C 58.602 46.177 46.176 58.59 30.862 58.59 C 15.526 58.59 3.122 46.177 3.122 30.857 C 3.122 15.531 15.526 3.117 30.862 3.117 M 30.862 0 C 13.849 0 0 13.85 0 30.857 C 0 47.86 13.85 61.708 30.862 61.708 C 47.874 61.708 61.714 47.86 61.714 30.857 C 61.714 13.85 47.875 0 30.862 0 Z"/>
              </svg>
            </div>
            <div
              id="react8"
              style={{
                display: (jsonData.range === 7) ? (userResponses[currentQuestionIndex] === 6 ? 'block' : 'none') : jsonData.range === 9 ? (userResponses[currentQuestionIndex] === 8 ? 'block' : 'none') : 'none',
              }}
              className="border  mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
            >
              <svg viewBox="0 0 61.703 61.708" width="61.703" height="61.708" xmlns="http://www.w3.org/2000/svg">
                <path fill="#C6E605" d="M 30.852 3.117 C 46.177 3.117 58.591 15.531 58.591 30.857 C 58.591 46.177 46.177 58.59 30.852 58.59 C 15.537 58.59 3.112 46.177 3.112 30.857 C 3.112 15.531 15.537 3.117 30.852 3.117"/>
                <path fill="#FFFFFF" d="M 11.924 33.73 C 11.924 41.702 20.346 48.124 30.788 48.124 C 41.229 48.124 49.642 41.702 49.642 33.73 L 11.924 33.73 Z"/>
                <path fill="#475900" d="M 40.544 16.101 C 36.642 16.101 34.047 18.701 32.739 21.632 L 35.017 23.257 C 36.314 20.979 37.939 19.676 40.543 19.676 C 43.138 19.676 45.09 21.3 46.06 23.257 L 48.338 21.632 C 47.052 18.701 44.437 16.101 40.544 16.101 Z"/>
                <path fill="#475900" d="M 21.043 16.101 C 17.13 16.101 14.535 18.701 13.228 21.632 L 15.506 23.257 C 16.803 20.979 18.438 19.676 21.043 19.676 C 23.638 19.676 25.589 21.3 26.56 23.257 L 28.828 21.632 C 27.54 18.701 24.935 16.101 21.043 16.101 Z"/>
                <g transform="matrix(1, 0, 0, 1, -559.6854248046875, -222.96176147460938)">
                  <path fill="#475900" d="M570.961,255.882c0,8.869,8.712,16.015,19.513,16.015s19.502-7.146,19.502-16.015H570.961z M600.304,258.433h6.561c0,3.693-2.563,6.43-6.561,8.486V258.433z M591.286,258.433h7.383v9.24 c-2.184,0.887-4.704,1.408-7.383,1.492V258.433z M582.278,258.433h7.372v10.732c-2.679-0.084-5.199-0.605-7.372-1.492V258.433z M574.072,258.433h6.561v8.486C576.646,264.862,574.072,262.126,574.072,258.433z"/>
                </g>
                <path fill="#475900" d="M 30.852 3.117 C 46.177 3.117 58.591 15.531 58.591 30.857 C 58.591 46.177 46.177 58.59 30.852 58.59 C 15.537 58.59 3.112 46.177 3.112 30.857 C 3.112 15.531 15.537 3.117 30.852 3.117 M 30.852 0 C 13.828 0 0 13.85 0 30.857 C 0 47.86 13.827 61.708 30.852 61.708 C 47.865 61.708 61.703 47.86 61.703 30.857 C 61.703 13.85 47.865 0 30.852 0 Z"/>
              </svg>
            </div>
            <div
              id="react9"
              style={{
                display: (jsonData.range === 5) ? (userResponses[currentQuestionIndex] === 5 ? 'block' : 'none') : jsonData.range === 7 ? (userResponses[currentQuestionIndex] === 7 ? 'block' : 'none') : jsonData.range === 9 ? (userResponses[currentQuestionIndex] === 9 ? 'block' : 'none') : 'none',
              }}
              className="border  mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
            >
              <svg viewBox="0 0 61.713 61.708" width="61.713" height="61.708" xmlns="http://www.w3.org/2000/svg">
                <path fill="#AAEA0D" d="M 30.861 3.117 C 46.176 3.117 58.601 15.531 58.601 30.857 C 58.601 46.177 46.176 58.59 30.861 58.59 C 15.525 58.59 3.122 46.177 3.122 30.857 C 3.121 15.531 15.525 3.117 30.861 3.117"/>
                <path fill="#215200" d="M 11.285 32.408 C 11.285 41.273 19.998 48.419 30.788 48.419 C 41.589 48.419 50.301 41.273 50.301 32.408 L 11.285 32.408 Z"/>
                <path fill="#215200" d="M 40.543 16.471 C 36.641 16.471 34.046 19.076 32.738 21.997 L 35.016 23.627 C 36.324 21.349 37.948 20.046 40.542 20.046 C 43.136 20.046 45.099 21.676 46.069 23.627 L 48.337 21.997 C 47.051 19.076 44.447 16.471 40.543 16.471 Z"/>
                <path fill="#215200" d="M 21.041 16.471 C 17.128 16.471 14.533 19.076 13.236 21.997 L 15.504 23.627 C 16.801 21.349 18.436 20.046 21.041 20.046 C 23.636 20.046 25.587 21.676 26.558 23.627 L 28.836 21.997 C 27.538 19.076 24.944 16.471 21.041 16.471 Z"/>
                <path fill="#215200" d="M 30.861 3.117 C 46.176 3.117 58.601 15.531 58.601 30.857 C 58.601 46.177 46.176 58.59 30.861 58.59 C 15.525 58.59 3.122 46.177 3.122 30.857 C 3.121 15.531 15.525 3.117 30.861 3.117 M 30.861 0 C 13.848 0 0 13.85 0 30.857 C 0 47.86 13.849 61.708 30.861 61.708 C 47.864 61.708 61.713 47.86 61.713 30.857 C 61.712 13.85 47.864 0 30.861 0 Z"/>
              </svg>
            </div>
            <div
              id="react10"
              style={{
                display: (jsonData.range === 3) ? (userResponses[currentQuestionIndex] === 3 ? 'block' : 'none') : 'none',
              }}
              className="border  mx-auto rounded-full w-[64px] h-[64px] relative mt-6 mb-6"
            >
              <svg viewBox="0 0 61.704 61.708" width="61.704" height="61.708" xmlns="http://www.w3.org/2000/svg">
                <path fill="#83E828" d="M 30.852 3.117 C 46.177 3.117 58.602 15.531 58.602 30.857 C 58.602 46.177 46.177 58.59 30.852 58.59 C 15.537 58.59 3.112 46.177 3.112 30.857 C 3.111 15.531 15.536 3.117 30.852 3.117"/>
                <path fill="#0F4D00" d="M 26.906 22.039 L 19.787 29.159 L 12.657 22.039 C 11.423 20.81 10.442 19.824 10.442 17.615 C 10.442 15.056 12.562 12.942 15.114 12.942 C 17.677 12.942 19.787 15.056 19.787 17.615 C 19.787 15.056 21.886 12.942 24.449 12.942 C 27.002 12.942 29.122 15.056 29.122 17.615 C 29.122 19.824 28.141 20.81 26.906 22.039 Z"/>
                <path fill="#0F4D00" d="M 48.804 22.039 L 41.673 29.159 L 34.543 22.039 C 33.319 20.81 32.339 19.824 32.339 17.615 C 32.339 15.056 34.448 12.942 37.011 12.942 C 39.564 12.942 41.673 15.056 41.673 17.615 C 41.673 15.056 43.782 12.942 46.346 12.942 C 48.899 12.942 51.019 15.056 51.019 17.615 C 51.019 19.824 50.037 20.81 48.804 22.039 Z"/>
                <path fill="#0F4D00" d="M 11.286 32.408 C 11.286 42.486 19.987 50.618 30.788 50.618 C 41.589 50.618 50.29 42.486 50.29 32.408 L 11.286 32.408 Z"/>
                <path fill="#0F4D00" d="M 30.852 3.117 C 46.177 3.117 58.602 15.531 58.602 30.857 C 58.602 46.177 46.177 58.59 30.852 58.59 C 15.537 58.59 3.112 46.177 3.112 30.857 C 3.111 15.531 15.536 3.117 30.852 3.117 M 30.852 0 C 13.838 0 0 13.85 0 30.857 C 0 47.86 13.838 61.708 30.852 61.708 C 47.865 61.708 61.704 47.86 61.704 30.857 C 61.703 13.85 47.864 0 30.852 0 Z"/>
              </svg>
            </div>
            <p className="text-sm leading-none text-center text-gray-600">
            <span id="exp">
              {jsonData.range === 9 && (
                <>
                  {userResponses[currentQuestionIndex] === 1 && (
                    "Strongly Disagree"
                  )}
                  {userResponses[currentQuestionIndex] === 2 && (
                    "Disagree"
                  )}
                  {userResponses[currentQuestionIndex] === 3 && (
                    "Moderately Disagree"
                  )}
                  {userResponses[currentQuestionIndex] === 4 && (
                    "Slightly Disagree"
                  )}
                  {(!userResponses[currentQuestionIndex] || userResponses[currentQuestionIndex] === 5) && (
                    "Neutral"
                  )}
                  {userResponses[currentQuestionIndex] === 6 && (
                    "Slightly Agree"
                  )}
                  {userResponses[currentQuestionIndex] === 7 && (
                    "Moderately Agree"
                  )}
                  {userResponses[currentQuestionIndex] === 8 && (
                    "Agree"
                  )}
                  {userResponses[currentQuestionIndex] === 9 && (
                    "Strongly Agree"
                  )}
                </>
              )}
              {jsonData.range === 7 && (
                <>
                  {userResponses[currentQuestionIndex] === 1 && (
                    "Strongly Disagree"
                  )}
                  {userResponses[currentQuestionIndex] === 2 && (
                    "Disagree"
                  )}
                  {userResponses[currentQuestionIndex] === 3 && (
                    "Somewhat Disagree"
                  )}
                  {(!userResponses[currentQuestionIndex] || userResponses[currentQuestionIndex] === 4) && (
                    "Neutral"
                  )}
                  {userResponses[currentQuestionIndex] === 5 && (
                    "Somewhat Agree"
                  )}
                  {userResponses[currentQuestionIndex] === 6 && (
                    "Agree"
                  )}
                  {userResponses[currentQuestionIndex] === 7 && (
                    "Strongly Agree"
                  )}
                </>
              )}
              {jsonData.range === 5 && (
                <>
                  {userResponses[currentQuestionIndex] === 1 && (
                    "Strongly Disagree"
                  )}
                  {userResponses[currentQuestionIndex] === 2 && (
                    "Disagree"
                  )}
                  {(!userResponses[currentQuestionIndex] || userResponses[currentQuestionIndex] === 3) && (
                    "Neutral"
                  )}
                  {userResponses[currentQuestionIndex] === 4 && (
                    "Agree"
                  )}
                  {userResponses[currentQuestionIndex] === 5 && (
                    "Strongly Agree"
                  )}
                </>
              )}
              {jsonData.range === 3 && (
                <>
                  {userResponses[currentQuestionIndex] === 1 && (
                    "Disagree"
                  )}
                  {(!userResponses[currentQuestionIndex] || userResponses[currentQuestionIndex] === 2) && (
                    "Neutral"
                  )}
                  {userResponses[currentQuestionIndex] === 3 && (
                    "Agree"
                  )}
                </>
              )}
            </span>
            </p>
            <div className="slider mt-4 mb-4 mx-auto ">
              <input
                id="slider"
                onChange={(e) => {
                  changeHandler(e);
                  handleSliderChange(e);
                }}
                className="w-full cursor-pointer rounded-full "
                type="range"
                value={sliderValue}
                min={1}
                max={(jsonData.range)}
                step={1}
              />
            </div>
            {/*
              <p>DEBUG: Selected value: {sliderValue}</p>
            */}
          </div>
        </div>
      </div>
    </form>
  );
}