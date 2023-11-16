'use client'

import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const About = () => {

    const notify = () => toast("Hello coders it was easy!");
    const notify1 = () => toast.warning("Hello coders it was easy!");
    const notify2 = () => toast.error("Fetch Error???");
    const notify3 = () => toast.success("Added Project to Catelog!!!");
    const notify4 = () => toast.info("Expired Token ");

  return (
    <div className='relative flex flex-col items-center justify-center min-h-screen overflow-hidden'>About
        <ToastContainer />
        <h1>Lets use react-toastify</h1>
        <button onClick={notify}>Click me for universal notification!</button>
        <button onClick={notify1}>Click me for universal notification!!</button>
        <button onClick={notify2}>Click me for universal notification!!</button>
        <button onClick={notify3}>Click me for universal notification!!</button>
        <button onClick={notify4}>Click me for universal notification!!</button>
    </div>
  )
}

export default About