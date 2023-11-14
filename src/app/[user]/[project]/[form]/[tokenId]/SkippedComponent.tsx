"use client"
// SkippedComponent.tsx
import React from 'react';

interface SkippedProps {
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
}

export default function SkippedComponent({ jsonData } : SkippedProps) {

  // Return the JSX structure for the component
  return (
    <>
      <h3>{jsonData.description}{jsonData.mandatory && <span style={{ color: 'red' }}>*</span>}</h3>
      <p>
        You have choosen to skip this question.<br></br>
        You can click the "Don't Skip"-button if you want to answer the question.
      </p>
    </>
  );
}
