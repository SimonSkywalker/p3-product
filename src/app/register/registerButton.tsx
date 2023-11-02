'use client'
import { User } from "./userClass";
export default function Button(){   
    

    return(
        <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600" onClick={User.getData}>
        Register
        </button>  
    )
}


