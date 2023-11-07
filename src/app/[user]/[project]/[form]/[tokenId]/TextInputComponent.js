"use client"
// TextInputComponent.js
import React from 'react';

export default function TextInputComponent({ jsonData }) {
  return (
    <form>
        <h3>{jsonData.description}{jsonData.mandatory && <span style={{ color: 'red' }}>*</span>}</h3>
        <div>
          <input className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400" type="text" />
        </div>
    </form>
  );
}