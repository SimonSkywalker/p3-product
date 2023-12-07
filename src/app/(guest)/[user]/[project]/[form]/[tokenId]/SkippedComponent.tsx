"use client"
// SkippedComponent.tsx
import React from 'react';

interface SkippedProps {
  jsonData: {
    _description: string;
    _mandatory: boolean;
    _userDisplay: boolean;
    _questionType: number;
    _saveRole: boolean;
    _options: any[string];
    _type: number;
    _range: number;
  };
}

export default function SkippedComponent({ jsonData } : SkippedProps) {

  // Return the JSX structure for the component
  return (
    <>
      <h3 className="text-center text-base font-bold mb-5">
        {jsonData._description}{jsonData._mandatory && <span style={{ color: 'red' }}>*</span>}
      </h3>
      <p className="text-center text-base">
        You have choosen to skip this question.
      </p>
      <br></br>
      <p className="text-center text-base">
        You can click the "Don't Skip"-button if you want to answer the question.
      </p>
    </>
  );
}
