"use client"
// SkippedComponent.js
import React, { useState, useEffect } from 'react';

export default function SkippedComponent({ jsonData }) {

  return (
    <form>
      <h3>{jsonData.description}{jsonData.mandatory && <span style={{ color: 'red' }}>*</span>}</h3>
      <p>
        You have choosen to skip this question.<br></br>
        You can click the "Don't Skip"-button if you want to answer the question.
      </p>
    </form>
  );
}
