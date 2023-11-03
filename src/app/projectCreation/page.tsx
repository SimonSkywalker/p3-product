//'use client'
/*'use server'*/
/*import React from 'react'

export default async function leaderHome() {
return (
    

  function openPage(pageName: string, event: React.MouseEvent<HTMLButtonElement>, color: string): void {
    // your code here
    
      <><div className="w-full p-6  lg:max-w-xl">
      <h1 className="text-3xl font-bold text-center text-white-700">Project</h1>
    </div><button className="tablink" onClick={(event: React.MouseEvent<HTMLButtonElement>) => openPage('Home', event, 'red')}>
        Home
      </button><button className="tablink" onClick={(event: React.MouseEvent<HTMLButtonElement>) => openPage('News', event, 'green')} id="defaultOpen">
        News
      </button><button className="tablink" onClick={(event: React.MouseEvent<HTMLButtonElement>) => openPage('Contact', event, 'blue')}>
        Contact
      </button><button className="tablink" onClick={(event: React.MouseEvent<HTMLButtonElement>) => openPage('About', event, 'orange')}>
        About
      </button><div id="Home" className="tabcontent">
        <h3>Home</h3>
        <p>Home is where the heart is..</p>
      </div><div id="News" className="tabcontent">
        <h3>News</h3>
        <p>Some news this fine day!</p>
      </div><div id="Contact" className="tabcontent">
        <h3>Contact</h3>
        <p>Get in touch with us!</p>
      </div><div id="About" className="tabcontent">
        <h3>About</h3>
        <p>Learn more about us!</p>
      </div></>
  }
  );
}*/
/*import React from 'react';
import Link from 'next/link';
import {Project} from './project.js';

export default function registerPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-bold text-center text-gray-700">Project</h1>
        <form className="mt-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
              Username
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
              Password
            </label>
            <input
              type="password"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="repeatPassword"
              className="block text-sm font-semibold text-gray-800"
            >
              Confirm Password
            </label>
            <input
              type="repeatPassword"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mt-2">
            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
              Register
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}*/





/*'use client'
import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import {Project} from './project.js';


export default function loginPage() {
  
  const [index, setIndex] = useState(0);

  function handleClickActive() {
    setIndex(1);
  }

  function handleClickHistory() {
    setIndex(2);
  }

 /* const tabClick = (event: any) => {
    alert();
  }*/
  
  
  /*return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
        <div className="tab">
          <button className="projectTablinks" onClick = {handleClickActive}> Active </button>
          <div id="Active" className="tabcontent">
        <h3>Active</h3>
        <p>Here are your current projects.</p>
      </div>

          </div>
          <div className="tab">
          <button className="projectTablinks" onClick = {handleClickHistory}> History </button>
          <div id="History" className="tabcontent">
        <h3>History</h3>
        <p>Here you can see your archived projects.</p> 
      </div>
      
        </div>
      </div>
  
      if(index == 1){
    /*<div id="Active" className="tabcontent">
        <h3>Active</h3>
        <p>Here are your current projects.</p>
      </div>*/
    //} else {
      /*<div id="History" className="tabcontent">
        <h3>History</h3>
        <p>Here you can see your archived projects.</p> 
      </div>
    } 
    
      
    </div>
  );
}


*/
'use client'
import React from "react";

const Tabs = () => {
  const [openTab, setOpenTab] = React.useState(1);

  let projectNames : String[] = ["Project123", "Project456", "Project789"];
  let projectIcons : String[] = ["hat", "ball", "foot"];


  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
            role="tablist"
          >
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 1
                    ? "text-white bg-blueGray-600"
                    : "text-blueGray-600 bg-white")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                Active
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 2
                    ? "text-white bg-blueGray-600"
                    : "text-blueGray-600 bg-white")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                History
              </a>
            </li>
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                  <p>
                    You can watch your active projects here
                    <br />
                    <br /> 
                  </p>
                </div>
                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                  <p>
                    You can watch your past projects here
                    <br />
                    <br />
                  </p>
                  {projectNames.map((name) => 
                    <div className="border-solid border-4 border-teal-600 bg-teal-400 p-8 inline-block m-24 inline-block bg-teal-400">
                      <p>{name}</p><br/>
                      <p>{projectIcons[projectNames.indexOf(name)]}</p>
                    </div>  
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tabs;
