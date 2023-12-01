'use client'

import React from 'react'
import Modal from "react-modal";
import FileSystemService from "../../components/FileSystemService";
import ServerSidePaths from '../../components/ServerSidePaths';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { modalOperator } from '@/app/interfaces/interfaces';
import { Project } from '@/app/components/projectClass';

interface ProjectParams {
    params:{
        user: string;
        project: string;
    }
}

export const page = ({params}:ProjectParams) => {

    const [openTab, setOpenTab] = useState<number>(2);
    const [modalOpen, setModalOpen] = useState<modalOperator>({currentModalTitle: "", isOpen: false});

    const [creatingForm, setForm] = useState<boolean>(false);
    const [newForm, setNewForm] = useState<Project>(new Project());
    const [selectedValue,setSelectedValue] = useState("");

   

  return (
    <div className="flex flex-wrap">
      <ToastContainer />
        <div id="outerDiv" className="w-full">

          <Modal
            
            isOpen={(modalOpen.currentModalTitle === "newFormModal") ? modalOpen.isOpen : false}
            onRequestClose={() => setModalOpen({currentModalTitle: "", isOpen: false})}
            contentLabel="Choose newForm Modal"
            className="modal-newForm"
           
          >
            <img className="w-6 h-6 float-right hover:scale-125" src={ServerSidePaths.URLFunctionIconsPath + "/cross.png"} title={"Cancel"} onClick={() => setModalOpen({currentModalTitle: "", isOpen: false})}></img>
            
            <form 
            className="mt-6" 
            onSubmit={() => setModalOpen({currentModalTitle: "", isOpen: false})}>
              <h2 className="text-3xl text-center m-4">Form Creation</h2>
              
              <button 
                type="button"
                title="deleteButton"
                onClick={ (e) => {}  }
                className="float-left m-2 px-9 py-2 tracking-wide text-white bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:bg-red-600 hover:scale-105" >
                New Form
              </button>
              
              
                <select 
                    
                   /*  value={selectedValue}
                    onChange={(e)=>{
                        const selectedValue = e.target.value;
                        // Update state or perform any other action based on the selected value
                        setSelectedValue(selectedValue);
                      }} */
                    
                    className="float-right m-2 px-12 py-2 tracking-wide text-white transition-colors hover:duration-200 bg-gray-700 rounded-md hover:bg-gray-600">
                    
                    <option value="" disabled selected className='hidden'>Choose an existing Form</option>
                    <optgroup label="Published">
                    <option value="P0">P0-Form</option>
                    <option value="P1">P1-Form</option>
                    <option value="P2">P2-Form</option>
                    <option value="P0">P0-Form</option>
                    <option value="P1">P1-Form</option>
                    <option value="P2">P2-Form</option>
                    <option value="P0">P0-Form</option>
                    <option value="P1">P1-Form</option>
                    <option value="P2">P2-Form</option>
                    <option value="P0">P0-Form</option>
                    <option value="P1">P1-Form</option>
                    <option value="P2">P2-Form</option>
                    <option value="P0">P0-Form</option>
                    <option value="P1">P1-Form</option>
                    <option value="P2">P2-Form</option>
                    </optgroup>
                    <optgroup label="Not Published">
                    <option value="P3">P3-Form</option>
                    <option value="P4">P4-Form</option>
                    <option value="P5">P5-Form</option>
                    </optgroup>
                    Cancel
                </select>
 
            </form>
          </Modal>

          
          

          <ul key="ul1" 
            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row max-w-screen-2xl mx-auto"
            role="tablist"
          >
            <li key="publishedTab" className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a key="publishedTabLink"
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 1
                    ? "text-white bg-palette-500"
                    : "text-palette-500 bg-white-300")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                Published
              </a>
            </li>
            <li key="notPublishedTab" className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a key="notPublishedTabLink"
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 2
                    ? "text-white bg-palette-500"
                    : "text-palette-500 bg-white-300")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                Not Published
              </a>
            </li>
          </ul>


          


          <div className="relative flex flex-col min-w-72 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={(openTab === 2 ? "block" : "hidden") + " grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-5 place-items-center"}  id="link1">
                  
                  <div 
                    id="newProjectDiv" 
                    className={(!creatingForm ? "block " : "hidden ") + "grid place-items-center h-25 w-40 border-dashed rounded-lg border-4 border-grey-600 bg-grey-400 inline-block m-24 inline-block bg-grey-400 "}>
                      <h3 className='pt-2'>Create New</h3>
                      <button title={"New"} className={"text-5xl text-align-center hover:scale-125"}
                      onClick={(e)=>{setModalOpen({currentModalTitle: "newFormModal", isOpen: true})}}
                      >+</button>
                  </div>

                </div> 

              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default page