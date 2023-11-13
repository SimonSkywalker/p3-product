"use client"
// SubmitPageComponent.js
import React, { useState, useEffect } from 'react';

export default function SubmitPageComponent({ jsonData }) {

  return (
    <form>
      <h1>Congratulations!</h1>
      <h3>
        You answered all the questions.<br></br>
        Please click the "Submit My Answers"-button when you want to submit your questions.
      </h3>
    </form>
  );
}
