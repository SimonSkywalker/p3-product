/* TODO

- /finde ud af klasserne og interface
- lave handler class med de små funktioner
- sætte style ind i css
- sætte enkelte html elementer i filer for sig selv?
- lav bedre id / keys
- færre div'er

IN PROGRESS

- projekter skrevet omvendt ud

MERE TO DO

- same title check når nyt projekt bliver lavet + (når title bliver ændret)
- icons tom check når project bliver oprrettet + defalt icon + ændrer icon under create new når nyt er valgt.
- projekter skrevet omvendt ud

- /lave active og history om til bare project og så lave check på idActive.

- upload icon selv
- exceptions
- test

New To Do

Reset Project Creation after creation Carmen
Cancel Edit - Nicolaj
Checks(same title) - Nicolaj
  - ved create new
  - ved edit project
Default icon
Merete - Change icon under create new when nyt er valgt
Merete - Delete confirmation modal



*/

'use client'
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import FileSystemService from '../components/FileSystemService';
import ServerSidePaths from '../components/ServerSidePaths';
import {Project, ProjectObject} from '../components/projectClass';
import {ProjectInterface, projectObject} from '../interfaces/interfaces';
import { TitleDuplicateException } from "../exceptions/TitleDuplicateException";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const customStyles = {
  content: {
    
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: 500, width: 400,

  },
};



export default function ProjectPage() {
  const [trigger, setTrigger] = useState(true);
  const [openTab, setOpenTab] = useState<number>(1);
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [creatingProject, setCreating] = useState<boolean>(false);
  const [icons, setIcons] = useState<string[]>([]);
  const [projects, setProjects] = useState<ProjectObject[]>([]); 
  const [newProject, setNewProject] = useState<Project>(new Project());
  
  //Todo - Get username from cookie
  const user = "Mka16"
  const URLIconsPath = ServerSidePaths.getURLIconsPath();

  
  async function getProjects() {
    
    const data: ProjectInterface[] = await FileSystemService.getJSONFile(ServerSidePaths.getProjectsPath(user)) as ProjectInterface[];
    const projectsWithBeingEdited: ProjectObject[] = data.map((projectData) => {return new ProjectObject(projectData)});
    
    setProjects(projectsWithBeingEdited);
    console.log("first" + projects);
  }

  useEffect(() => {

    const appElement: HTMLElement | null = document.getElementById('outerDiv');
    if (appElement) {
      Modal.setAppElement(appElement);
    }

    FileSystemService.listFiles(ServerSidePaths.getIconsPath()).then((iconFiles) => {
      setIcons(iconFiles);
    });

    getProjects();
  }, []);


  const forceRerender = () => {
    setTrigger((prevTrigger) => !prevTrigger);
  };

  
  async function formattingProjectData() {
    
    const data = projects.map((project) => project.getProjectDataArray()); 

    const transformedData = data.map(([title, isActive, icon]) => ({
      title,
      isActive,
      icon,
    }));

    await FileSystemService.writeToJSONFile(transformedData, ServerSidePaths.getProjectsPath(user));

  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>){

    e.preventDefault();
    
    const projectObject: ProjectObject = newProject.convertToProjectObject();
    projects.unshift(projectObject);
   
    formattingProjectData();

    setCreating(false);
    
  } 

  async function handleDelete(index: number){
  
    // Has to .splice since useState value doesnt change
    // immediately but only schedules a change. 
    projects.splice(index, 1);

    await formattingProjectData();
    
  }

  function isTitleUnique (title: string, creation: boolean) {

    try {

      //zod validate
      const notUniqueTitle = projects.filter(project => {return project.getTitle() === title });
      const maxIndex = (creation) ? 0 : 1;
      if(notUniqueTitle.length > maxIndex){
        throw new TitleDuplicateException()
      }

    } catch(err) {

      throw err;

    }


  }

  return (
    <>
      <div className="flex flex-wrap">
      <ToastContainer />
        <div id="outerDiv" className="w-full">

          <Modal
            
            isOpen={modalIsOpen}
            onRequestClose={() => setIsOpen(false)}
            contentLabel="Choose Icon Modal"
            style={customStyles}
          >
            <img className="w-6 h-6 float-right hover:scale-125" src="icons/cross.png" onClick={() => setIsOpen(false)}></img>
            
            <form 
            className="mt-6" 
            onSubmit={() => setIsOpen(false)}>
              <h2 className="text-3xl text-center m-4">Select Project Icon</h2>
              <div id="chooseIcon" className="grid grid-cols-3 gap-2 place-items-center m-12">

                {icons.map(icon => ( 

                  <div key={icon + "Div"}>
                    <label>
                      <input type="radio" onChange={(e) => newProject.setIcon(e.target.value)} name="icon" value={icon} className="hidden"></input>
                      <img src={`${URLIconsPath}/${icon}`} alt={icon} width={50} height={50} className="hover:scale-125"/>
                    </label>
                  </div>
                ))}
    
              </div>

              <hr className="rounded-lg border-2"></hr>

              <h2 className="text-3xl text-center m-4">Or Upload Image</h2>
              <div id="uploadIcon" className="grid place-items-center m-12">

                <label htmlFor="file-input">
                  <img className="w-10 h-10 hover:scale-125" src="icons/upload.png"/>
                </label>
                <input id="file-input" type="file" className="hidden"/>

              </div>
 
              <button 
                type="submit"
                title="submitButton"
                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 hover:scale-105" >
                Submit
              </button>

            </form>
          </Modal>

          <ul key="ul1" 
            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row max-w-screen-2xl mx-auto"
            role="tablist"
          >
            <li key="activeTab" className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a key="activeTabLink"
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
            <li key="historyTab" className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a key="historyTabLink"
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


          


          <div className="relative flex flex-col min-w-72 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={(openTab === 1 ? "block" : "hidden") + " grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-5 place-items-center"}  id="link1">
                  
                  <div 
                    id="newProjectDiv" 
                    className={(!creatingProject ? "block " : "hidden ") + "grid place-items-center h-30 w-30 border-dashed rounded-lg border-4 border-grey-600 bg-grey-400 p-8 inline-block m-24 inline-block bg-grey-400 "}>
                      <h3>Create New</h3>
                      <button className={"text-5xl text-align-center hover:scale-125"}
                      onClick={ e => {
                        e.preventDefault();
                        setCreating(true);

                      }}
                      >+</button>
                  </div>

                  <div 
                  id="createProjectDiv" 
                  className={(creatingProject ? "block " : "hidden ") + "grid shadow-xl h-30 w-60 border-solid border-4 border-grey-800 bg-grey-400 p-8 inline-block m-12 inline-block bg-grey-400"}>

                    <form className="mt-6" onSubmit={e => {
                      e.preventDefault()
                      try {
                        console.log(creatingProject)
                        isTitleUnique(newProject.getTitle(),creatingProject)
                        handleSubmit(e)
                        toast.success("Created Project: " + newProject.getTitle())
                      } catch(err) {
                        if (err instanceof TitleDuplicateException){

                          toast.error(err.message);
                          
                        }
                      }}}>
                      <div 
                        className="mb-4">
                          <input
                            type="text" 
                            id="projectname" 
                            placeholder="Project Name" 
                            autoComplete="Project Name" 
                            name="title"
                            
                            onChange={(e) => newProject.setTitle(e.target.value)}
                            className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                          />
                      </div>
                      
                      <div 
                        className="mt-2 grid place-items-center">
                        <button type="button">
                          <img className="w-10 h-10 hover:scale-125" src="icons/upload.png" 
                          onClick={ e => {
                          e.preventDefault();
                          setIsOpen(true);
    
                        }}></img>
                        </button>
                        
                        
                      </div>

                      <div>
                        <br/>
                        <img className="w-6 h-6 float-left hover:scale-125" src="icons/cross.png"
                        onClick={ e => {
                          e.preventDefault(); // Prevent the form submission
                        }}></img>
                        <button
                          type="submit"
                          className="p-0 m-0 float-right border-none bg-none cursor-pointer"
                        >
                          <img
                            className="w-6 h-6 float-right hover:scale-125"
                            src="icons/checkmark.png"
                            alt="Submit"
                          />
                        </button>
                        
                      </div>
                      
                    </form>

                  </div>


                  
                  
                  
                  
                  {projects.map((project, i) => 
                  
                    project.getIsActive() ? (

                      <div key={"DivActive" + project.getTitle() + i} className="hover:scale-105 shadow-xl h-30 w-60 border rounded-md border-4 border-grey-600 bg-grey-400 p-8 inline-block m-12 inline-block bg-grey-400">
                        <div 
                          className="flex justify-end items-center">
                            <img className="w-4 h-6 hover:scale-125 hover:cursor-pointer" src="icons/arhieve.png"
                            onClick={ e => {
                                project.setIsActive(false);
                                formattingProjectData();
                                //setTrigger(!trigger)
                            }}>
                            </img>
                        </div>
                        <form key={"Form" + project.getTitle() + i} onSubmit={(e) =>{
                          e.preventDefault()
                          project.setBeingEdited(false)
                        }}>
                          
                          
                          
                          
                          { (project.getBeingEdited()) ? (
                            <div className="relative ">
                              <input
                              type="text" 
                              key={"inputField" + i}
                              onChange={(e)=>{
                              project.setTitle(e.target.value)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault(); // Prevent the form submission
                                  try {
                                    isTitleUnique(project.getTitle(),creatingProject)
                                    project.setBeingEdited(false);
                                    formattingProjectData();
                                    //setTrigger(!trigger);
                                  } catch(err) {
                                    if (err instanceof TitleDuplicateException){

                                      toast.error(err.message);
                                      
                                    }
                                  }
                                }
                              }}
                              name="title"
                              className="block w-full px-4 pr-9 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                              />
                              <button 
                                type="button"
                                onClick={() => {
                                  project.setTitle(project.getpreviousTitle())
                                  project.setBeingEdited(false);
                                  forceRerender()
                                }}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 px-[8px] py-[3px] text-black rounded-md border hover:text-white border-black-300 hover:bg-black-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                                X
                              </button>
                            </div>
                          ) : (
                            <p 
                            key={"TitleActive" + project.getTitle() + i}
                            className="text-center pb-4">{project.getTitle()}</p>
                          ) }
                          
                          
                          <img 
                            key={"Icon" + project.getIcon() + i} 
                            src={`${URLIconsPath}/${project.getIcon()}`} 
                            width={50} 
                            height={50} 
                            className="mt-4 mx-auto block"/>
                          
                          <div 
                            
                            key={"buttonsDiv" + i}
                            className="flex justify-between items-center ">
                            <img className="w-4 h-6 hover:cursor-pointer  hover:scale-125" src="icons/trash.png"
                            onClick={ e => {
                              handleDelete(i);
                              console.log(project.getTitle())
                              
        
                            }}>
                            </img>
                            <img className="w-4 h-6  hover:scale-125 hover:cursor-pointer" src="icons/edit.png"
                            onClick={ e => {

                                project.setpreviousTitle(project.getTitle());
                                project.setBeingEdited(true);
                                forceRerender()
                            }}>
                            </img>

                          </div>
                        </form>
                      </div>  

                      ) : (

                        <p key={project.getTitle() + "" + i} className="hidden"/>

                      )
                  

                    
                  )}

                </div>
 
                <div className={(openTab === 2 ? "block" : "hidden") + " grid grid-cols-3 gap-2 place-items-center"} id="link2">
                  
                  {projects.map((project, i) => 
                    
                    project.getIsActive() ? (

                      <p key={project.getTitle() + "" + i} className="hidden"/>

                    ) : (

                      <div key={"DivHistory" + project.getTitle() + i} className="hover:scale-105 shadow-xl h-30 w-60 border rounded-md border-4 border-grey-600 bg-grey-400 p-8 inline-block m-24 inline-block bg-grey-400">
                      <p key={"ProjectHistory" + project.getTitle() + i}>{project.getTitle()}</p><br/>
                      <img src={`${URLIconsPath}/${project.getIcon()}`} width={50} height={50} className=""/>
                      
                      <div>
                        <br/>
                        <img className="w-4 h-6 float-left hover:scale-125" src="icons/trash.png"
                        onClick={ e => {
                          e.preventDefault();
                          
    
                        }}>
                        </img>
                        
                      </div>

                    </div>  
                    )
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