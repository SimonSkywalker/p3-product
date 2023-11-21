"use client"
// AlreadyUsedPageComponent.tsx
import React from 'react';

export default function AlreadyUsedPageComponent() {

  // Return the JSX structure for the component
  return (
    <>
      <h1 className="text-center text-xl font-bold">
        This link has already submitted answers!
      </h1>
      <br></br>
      <h3 className="text-center text-base">
        If you have not yet answered, you should contact your project leader for a new link.
      </h3>
      <br></br>
      <h3 className="text-center text-base">
        However, if you have answered the questions already, you can safely close this page.
      </h3>
      <br></br>
      <h3 className="text-center text-base">
        Thank you again!
      </h3>
    </>
  );
}
