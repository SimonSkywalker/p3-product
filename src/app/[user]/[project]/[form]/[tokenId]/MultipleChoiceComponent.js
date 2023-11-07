"use client"
// MultipleChoiceComponent.js
import React from 'react';

export default function MultipleChoiceComponent({ jsonData }) {
  return (
    <form>
        <h3>{jsonData.description}{jsonData.mandatory && <span style={{ color: 'red' }}>*</span>}</h3>
            {jsonData.options.map((option, optionIndex) => (
            <div className="flex items-center mb-4">
                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300" key={optionIndex}>
                {jsonData.type === 0 ? ( // Display radio buttons if type is 0
                    <input type="radio" value={option} name={jsonData.description} class="w-4 h-4" />
                ) : (
                    // Display checkboxes if type is 1
                    <input type="checkbox" value={option} name={jsonData.description} class="w-4 h-4" />
                )}
                {option}
                </label>
            </div>
            ))}
    </form>
  );
}