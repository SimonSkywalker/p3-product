'use client'

import React, { useEffect } from 'react'
import Modal from "react-modal";
import FileSystemService from "@/app/(admin)/components/FileSystemService";
import FileFinder from '@/app/(admin)/formCreation/FileFinder';
import ServerSidePaths from '@/app/(admin)/components/ServerSidePaths';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { ProjectInterface, actionProject, modalOperator } from '@/app/(admin)/interfaces/interfaces';
import { Project } from '@/app/(admin)/components/projectClass';
import { FormObject } from '@/app/(admin)/interfaces/interfaces';
import Form from '@/app/(admin)/formCreation/Form';
import FormBuilder from '@/app/(admin)/formCreation/FormBuilder';
import Link from 'next/link';
import FormValidator from '@/app/(admin)/formCreation/FormValidator';
import ObjectAlreadyExistsException from '@/app/(admin)/exceptions/ObjectAlreadyExistsException';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(admin)/context/Auth';
import { z } from 'zod';

interface ProjectParams {
    params:{
        user: string;
        project: string;
    }
}

let Puge = ({params}:ProjectParams) => {
  const router = useRouter();
  const { logout } = useAuth();


  const [openTab, setOpenTab] = useState<number>(2);
  const [modalOpen, setModalOpen] = useState<modalOperator>({currentModalTitle: "", isOpen: false});

  const [nameInput, setNameInput] = useState<string>("");
  const [selectedForm, setSelectedForm] = useState<Form>();
  const [actionOnProject, setActionOnProject] = useState<actionProject>({projectTitle:"", projectIndex: -1});
  const [creatingForm, setForm] = useState<boolean>(false);
  const [newForm, setNewForm] = useState<Project>(new Project());
  const [selectedValue, setSelectedValue] = useState("");
  const [forms, setForms] = useState<Form[]>([]);
  const [projectState, setProjectState] = useState<boolean>();
  //console.log(params.user, params.project);


  async function getForms() {
  
    const projectAltered = params.project.replace(/-/g, ' ');
    let projects = await FileSystemService.getJSONFile(ServerSidePaths.getProjectsPath(params.user)) as ProjectInterface[];
    let project = projects.filter((project) => project.title.replace(/-/g,' ') === projectAltered.replace(/%20/g," "));
    
    setProjectState(project[0].isActive);
    
    const dataForms: Form[] = await FileSystemService.getJSONFile(ServerSidePaths.getFormsPath(params.user, projectAltered).replace(/%20/g,' ')) as Form[];
    
    const buildedForms : Form[] = [];
    
    dataForms.map(form => {
      buildedForms.push(new FormBuilder().formFromObject(form));
    })
    buildedForms.forEach((form)=>{
      form.name = form.getUncleanName()
    })
    console.log("dataForms: ", dataForms);

    setForms(buildedForms);

  }

  useEffect(() => {
    
    const token = Cookies.get("token");
    console.log(token)
    if (!token) {
      logout();
      router.replace("/login"); // If no token is found, redirect to login page
      return;
    }
      // Validate the token by making an API call
      const validateToken = async () => {
        try {
          const res = await fetch("/api/protected", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (!res.ok) {throw new Error("Token validation failed");}
        } catch (error) {
          console.error(error);
          logout();
          router.replace("/login"); // Redirect to login if token validation fails
        }
      };
  
      validateToken();

    getForms();

    const appElement: HTMLElement | null = document.getElementById('outerDiv');
    if (appElement) {
      Modal.setAppElement(appElement);
    }

  
    // længden er 0 fordi useEffect ikke er kørt færdig surt show
    //console.log(forms.length);
  
  }, []);


  async function handleDelete(){
  
    // Has to .splice since useState value doesnt change
    // immediately but only schedules a change. 
    forms.splice(actionOnProject.projectIndex, 1);
    forms.forEach((form)=>form.cleanName())
    const projectAltered = params.project.replace(/-/g, ' ');
    await FileSystemService.writeToJSONFile(forms, ServerSidePaths.getFormsPath(params.user, projectAltered).replace(/%20/g,' '));
    
    FileSystemService.delete('../', ServerSidePaths.getProjectPath(params.user) + `/` + projectAltered.replace(/%20/g,' ') + `/${actionOnProject.projectTitle}`);

    toast.info("Deleted " + actionOnProject.projectTitle);
    forms.forEach((form)=>form.name = form.getUncleanName())
    //Resets the actionOnProject state
    setActionOnProject({projectTitle:"", projectIndex: -1});
   
    setModalOpen({currentModalTitle: "deleteModal", isOpen: false});

  }

  const truncateString = (str: string, maxLength: number) => {
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
  };

  const handleSelectChange = (e:any) => {
    const selectedValue = e.target.value;
    const selectedForm = forms.find((form) => form.name === selectedValue);
    setSelectedForm(selectedForm);
  };

  const handleCopyForm = (selectForm : Form, copiedName : string) => {
    let copyForm = selectForm.createChild();
    copyForm.name = copiedName;
    copyForm.cleanName(); 
    try{
      FormValidator.nameTemplate.parse(copyForm.name);
        //maybe throws zod error
        //Check if validateName is unique
      const isNotUnique : boolean = forms.some((form)=>{return (form.name == copyForm?.name)})
      if(isNotUnique){
      throw new ObjectAlreadyExistsException("Form already exists");
      }
      //Push form to forms array
      forms.push(new FormBuilder().formFromObject(copyForm))
      writeFormData();
      setModalOpen({currentModalTitle: "newFormModal", isOpen: false})
    } catch (e: any) {

      if (e instanceof z.ZodError) {
        e.errors.forEach((validationError) => {
          toast.error(validationError.message);
        });
      } else {
        toast.error(e.message);
      }

        
    }
  };

  const closeModal = () => {
    setModalOpen({ currentModalTitle: '', isOpen: false });
    setNameInput('');
  };

  async function writeFormData() {
    const projectAltered = params.project.replace(/-/g, ' ');
    FileSystemService.writeToJSONFile(forms, ServerSidePaths.getFormsPath(params.user, projectAltered).replace(/%20/g,' '));
  }

  /*async function handleDelete(){
  
    // Has to .splice since useState value doesnt change
    // immediately but only schedules a change. 
    projects.splice(actionOnProject.projectIndex, 1);

    await formattingProjectData();
    
    FileSystemService.delete('../', ServerSidePaths.getProjectPath(user) + `/${actionOnProject.projectTitle}`);

    toast.info("Deleted " + actionOnProject.projectTitle);

    //Resets the actionOnProject state
    setActionOnProject({projectTitle:"", projectIndex: -1});

    setModalOpen({currentModalTitle: "deleteModal", isOpen: false});

  }
  */

  const publishedForms = forms.filter((form) => !form.isActive);
  const notPublishedForms = forms.filter((form) => form.isActive);

  return (
    <div className="flex flex-wrap">
      <ToastContainer />
        <div id="outerDiv" className="w-full">

          <Modal
            
            isOpen={(modalOpen.currentModalTitle === "newFormModal") ? modalOpen.isOpen : false}
            onRequestClose={() => {closeModal}}
            contentLabel="Choose newForm Modal"
            className="modal-newForm"
           
          >
            <img className="w-6 h-6 float-right hover:scale-125" src={ServerSidePaths.URLFunctionIconsPath + "/cross.png"} title={"Cancel"} onClick={() => setModalOpen({currentModalTitle: "", isOpen: false})}></img>
            
            <form 
            className="mt-6" 
            onSubmit={() => setModalOpen({currentModalTitle: "", isOpen: false})}>
              <h2 className="text-3xl text-center m-4">Form Creation</h2>
              
              
              <Link 
                href={params.project + "/formCreator/newForm"}
                type="button"
                title="FormButton"
                className="float-left m-2 px-9 py-2 tracking-wide text-white bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none hover:scale-105" >
                New Form
              </Link>
              

              
              <select
                className="float-right m-2 px-12 py-2 tracking-wide text-white transition-colors hover:duration-200 bg-gray-700 rounded-md hover:bg-gray-600"
                onChange={handleSelectChange}
                value={selectedForm ? selectedForm.name : ''}
              >
                <option value="" disabled className="hidden">
                  Choose an existing Form
                </option>
                <optgroup label="Published">
                {publishedForms.map((form) => (
                    <option key={form.name} value={form.name}>
                      {truncateString(form.getUncleanName(), 20)}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Not Published">
                  {notPublishedForms.map((form) => (
                    <option key={form.name} value={form.name}>
                      {truncateString(form.getUncleanName(), 20)}
                    </option>
                  ))}
                </optgroup>
              </select>


              <input
              className={`px-16 ml-2 py-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40 ${!selectedForm && 'disabled'}`}   
              disabled={!selectedForm}
              onChange={(e) => {
                setNameInput(e.target.value.toString());}}
              placeholder='Name of copied form'
              >
              
              </input>

              <button
              className={`float-right m-2 px-12 py-2 tracking-wide text-white transition-colors hover:duration-200 bg-gray-700 rounded-md hover:bg-gray-600 ${!selectedForm && 'disabled'}`}
              onClick={(e) => {selectedForm ? handleCopyForm(selectedForm, nameInput) : toast.warning("Please Select a Form");e.preventDefault()}}
              disabled={!selectedForm}
              >
                Copy Form
              </button>
            </form>
          </Modal>

          <Modal
            
            isOpen={(modalOpen.currentModalTitle === "deleteModal") ? modalOpen.isOpen : false}
            onRequestClose={() => setModalOpen({currentModalTitle: "", isOpen: false})}
            contentLabel="Delete confirm modal"
            className="modal-confirm"
          >
            <img title={"Cancel"} className="w-6 h-6 float-right hover:scale-125" src={ServerSidePaths.URLFunctionIconsPath + "/cross.png"} onClick={() => setModalOpen({currentModalTitle: "deleteModal", isOpen: false})}></img>
            
            <p className="mt-8 mb-8 text-xl text-center">Are you sure you would like to delete <span className="break-all">{actionOnProject?.projectTitle}</span> ?</p>
            
            <p className="mt-8 mb-8 text-l text-center">Deleted objects can never be recovered</p>

            <button 
                type="button"
                title="deleteButton"
                onClick={(event) => {event.preventDefault(); handleDelete();}}
                className="float-left m-2 px-12 py-2 tracking-wide text-white transition-colors duration-200 transform bg-red-700 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600 hover:scale-105" >
                Delete
              </button>
            <button 
                type="button"
                title="cancelButton"
                onClick={() => setModalOpen({currentModalTitle: "deleteModal", isOpen: false})}
                className="float-right m-2 px-12 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 hover:scale-105" >
                Cancel
              </button>
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
                <div className={(openTab === 1 ? "block" : "hidden") + " grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-5 place-items-center"}  id="link1">
 
                  {/*Reverses the forms array such that the newest saved is displayed first*/}
                  {forms.toReversed().map((form, i) => 
                    form.isActive ? (

                      <p key={"status" + form.name + i} className="hidden"></p>

                    ) : (
                      
                      <div key={"div" + form.name + i} className="hover:scale-105 shadow-xl h-30 w-60 rounded-lg border-4 border-grey-600 bg-grey-400 inline-block m-24 inline-block bg-grey-400 ">
                      
                        {/* user/project/formCreation/[formName]*/}
                        <Link href={params.project + "/formCreator/" + form.name}>

                          <p key={"title" + form.name + i} className="mb-8 ml-2 mt-2">{form.name}</p>

                          <div className="inline-flex flex-row">
                            <p key={"status" + form.name + i} className="italic ml-2 mb-2">Published</p>
                          </div>  

                        </Link><br/>

                        <img title={"Delete"} className="w-4 h-6 m-2 float-right hover:scale-125" src={ServerSidePaths.URLFunctionIconsPath + "/trash.png"}
                          onClick={ e => {
                            setModalOpen({currentModalTitle: "deleteModal", isOpen: true});
                            setActionOnProject({projectTitle: form.name, projectIndex: i});
                            
                          }}>
                        </img>

                      </div>
                    )
                    
                  )}

                  <p className="text-xs font-bold uppercase  shadow-lg rounded block leading-normal text-white bg-palette-500">
                    <Link 
                    href={"/projectCreation"}
                    className='px-5 py-3 bg-palette-500 rounded'>
                      Back to projectpage
                    </Link>
                  </p>

                </div> 
                
                <div className={(openTab === 2 ? "block" : "hidden") + " grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-5 place-items-center"}  id="link1">

                  <div 
                    id="newProjectDiv" 
                    className={`grid place-items-center h-25 w-40 border-dashed rounded-lg border-4 border-grey-600 bg-grey-400 inline-block m-24 inline-block bg-grey-400 ${projectState ? 'block' : 'hidden'}`}>
                      <h3 className='pt-2'>Create New</h3>
                      <button title={"New"} className={"text-5xl text-align-center hover:scale-125"}
                      onClick={(e)=>{setModalOpen({currentModalTitle: "newFormModal", isOpen: true});setSelectedForm(undefined)}}
                      >+</button>
                  </div>
                
                  {/*Reverses the forms array such that the newest saved is displayed first*/}
                  {forms.toReversed().map((form, i) => 
                    !form.isActive ? (

                      <p key={"status" + form.name + i} className="hidden"></p>

                    ) : (
                      
                      <div key={"div" + form.name + i} className="hover:scale-105 shadow-xl h-30 w-60 rounded-lg border-4 border-grey-600 bg-grey-400 inline-block m-24 inline-block bg-grey-400 ">
                      
                        {/* user/project/formCreation/[formName]*/}
                        <Link href={params.project + "/formCreator/" + form.name}>

                          <p key={"title" + form.name + i} className="mb-8 ml-2 mt-2">{form.name}</p>

                          <div className="inline-flex flex-row">
                            <p key={"status" + form.name + i} className="italic ml-2 mb-2">Not Published</p>
                          </div>  

                        </Link><br/>

                        <img title={"Delete"} className="w-4 h-6 m-2 float-right hover:scale-125" src={ServerSidePaths.URLFunctionIconsPath + "/trash.png"}
                          onClick={ e => {
                            setModalOpen({currentModalTitle: "deleteModal", isOpen: true});
                            setActionOnProject({projectTitle: form.name, projectIndex: i});
                            
                          }}>
                        </img>

                      </div>
                    )
                    
                  )}

                  <p className="text-xs font-bold uppercase shadow-lg rounded block leading-normal text-white bg-palette-500">
                    <Link 
                    href={"/projectCreation"}
                    className='px-5 py-3 bg-palette-500 rounded'>
                      Back to projectpage
                    </Link>
                  </p>

                </div> 

              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Puge