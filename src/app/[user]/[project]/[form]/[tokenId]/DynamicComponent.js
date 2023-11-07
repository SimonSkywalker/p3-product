// DynamicComponent.js
import React from 'react';

export default function DynamicComponent({ jsonData }) {
  return (
    <form>
        <h3>{jsonData.description}</h3>
        <div>
          <input className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400" type="text" />
        </div>
    </form>
  );
}