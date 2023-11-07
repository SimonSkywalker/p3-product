"use client"
// SliderComponent.js
import React from 'react';

export default function SliderComponent({ jsonData }) {
  return (
    <form>
        <div className="flex flex-col space-y-2 w-full">
            <input type="range" className="w-full" min="1" max={jsonData.range} step="1"/>
            <ul className="flex justify-between w-full px-[10px]">
                <li className="flex justify-center relative"><span className="absolute">1<br></br>Strongly disagree</span></li>
                <li className="flex justify-center relative"><span className="absolute">2<br></br>Disagree</span></li>
                <li className="flex justify-center relative"><span className="absolute">3<br></br>Neutral</span></li>
                <li className="flex justify-center relative"><span className="absolute">4<br></br>Agree</span></li>
                <li className="flex justify-center relative"><span className="absolute">5<br></br>Strongly agree</span></li>
            </ul>
          </div>
    </form>
  );
}