"use client"
// MultipleChoiceComponent.js
import React from 'react';

export default function MultipleChoiceComponent({ jsonData }) {
  return (
    <form>
        <div>
        <p>Multiple Choice</p>
        {/*jsonData.options.map((option, optionIndex) => (
          <label key={optionIndex}>
            <input type="radio" name={`question-${index}`} value={option} />
            {option}
          </label>
        )*/}
        </div>
    </form>
  );
}