"use client"
// FinalPageComponent.js
import React, { useState, useEffect } from 'react';

export default function FinalPageComponent() {

  return (
    <form>
      <h1>You have already submitted your answers!</h1>
      <h3>
        If you have not answered the questions yet, you should contact your project leader for a new link.<br></br>
        However, if you already have answered the questions, you can safely close this page.<br></br>
        Thank you again!
      </h3>
    </form>
  );
}
