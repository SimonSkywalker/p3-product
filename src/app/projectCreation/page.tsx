
'use client'
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Image from 'next/image';
import FileSystemService from '../components/FileSystemService';
import ServerSidePaths from '../components/ServerSidePaths';
import ProjectFormHandler from '../components/handlerClass';
import {ProjectInterface} from '../interfaces/interfaces';


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



export default function projectPage() {

  const [openTab, setOpenTab] = React.useState(1);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [creatingProject, setCreating] = React.useState(false);
  const [icons, setIcons] = useState<string[]>([]);
  const [projects, setProjects] = useState<ProjectInterface[]>([]);
  const [projectIconsActive, setProjectIcons] = useState<String[]>([]);
  const [projectNamesActive, setProjectNames] = useState<String[]>([]);
  const [projectIconsHistory, setProjectIconsHistory] = useState<String[]>([]);
  const [projectNamesHistory, setProjectNamesHistory] = useState<String[]>([]);
  const [user, setUser] = useState<string>("Mka16");
  const URLIconsPath = ServerSidePaths.getURLIconsPath();
  const [newProject, setNewProject] = useState<ProjectFormHandler>(new ProjectFormHandler);

  useEffect(() => {
    async function getProjects() {
        const data: ProjectInterface[] = await FileSystemService.getJSONFile(ServerSidePaths.getProjectsPath(user)) as ProjectInterface[];
        setProjects(data);
        
        let projectNamesActiveLength = projectNamesActive.length;
        for(let i= 0; i< projectNamesActiveLength; i++){
          projectNamesActive.pop();
        }

        let projectsIconActiveLength = projectIconsActive.length;
        for(let i= 0; i< projectsIconActiveLength; i++){
          projectIconsActive.pop();
        }

        let projectNamesHistoryLength = projectNamesHistory.length;
        for(let i= 0; i< projectNamesHistoryLength; i++){
          projectNamesHistory.pop();
        }

        let projectsIconHistoryLength = projectIconsHistory.length;
        for(let i= 0; i< projectsIconHistoryLength; i++){
          projectIconsHistory.pop();
        }

        data.forEach(project => {
          
          if(project.isActive){
            
            projectNamesActive.push(project.title);
            projectIconsActive.push(project.icon);
            
          } else {
            
            projectNamesHistory.push(project.title);
            projectIconsHistory.push(project.icon);
            
          }
        })

          
        

    }
     
    const appElement: HTMLElement | null = document.getElementById('outerDiv');
    if (appElement) {
      Modal.setAppElement(appElement);
    }

    FileSystemService.listFiles(ServerSidePaths.getIconsPath()).then((iconFiles) => {
        setIcons(iconFiles);
    });

    getProjects();
  }, []);


  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function Show(){
    setCreating(true);
  }

  function hide(){
    setCreating(false);
  }

  async function handleSubmit(){
    
    console.log(newProject.getTitle());
    console.log(newProject.getIcon());

    //projects.push(newProject);

    
    let test : ProjectInterface = {
      title: "Teams",
      isActive: true,
      icon: "checkmark.png"
    }

    projects.push(test);

    await FileSystemService.writeToJSONFile(projects, ServerSidePaths.getProjectsPath(user));

    const data: ProjectInterface[] = await FileSystemService.getJSONFile(ServerSidePaths.getProjectsPath(user)) as ProjectInterface[];
    setProjects(data);
    

  }
  
  function handleChange(e: any){
    //e.preventDefault();
    
    newProject.setIcon(e.target.value);

  }

  function handleChangeTitle(e: any){
    //e.preventDefault();
    
    newProject.setTitle(e.target.value);



  }

  return (
    <>
      <div className="flex flex-wrap">
        
        <div id="outerDiv" className="w-full">

          <Modal
            
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Choose Icon Modal"
            style={customStyles}
          >
            <img className="w-6 h-6 float-right hover:scale-125" src="icons/cross.png" onClick={closeModal}></img>
            
            

            <form 
            className="mt-6" 
            onSubmit={handleSubmit}>
              <h2 className="text-3xl text-center m-4">Select Project Icon</h2>
              <div id="chooseIcon" className="grid grid-cols-3 gap-2 place-items-center m-12">

                


                {icons.map(icon => ( 

                  <div key={icon}>
                    <label>
                      <input onChange={handleChange} id={icon + "selected"} type="radio" name="icon" value={icon}></input>
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
            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
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
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={(openTab === 1 ? "block" : "hidden") + " grid grid-cols-3 gap-2 place-items-center"}  id="link1">
                  
                  <div id="newProjectDiv" className={(!creatingProject ? "block " : "hidden ") + "grid place-items-center h-30 w-30 border-dashed rounded-lg border-4 border-grey-600 bg-grey-400 p-8 inline-block m-24 inline-block bg-grey-400 "}>
                      <h3>Create New</h3>
                      <button className={"text-5xl text-align-center"}
                      onClick={ e => {
                        e.preventDefault();
                        Show();

                      }}
                      >+</button>
                  </div>

                  <div id="createProjectDiv" className={(creatingProject ? "block " : "hidden ") + "h-30 w-30 border-solid border-4 border-grey-800 bg-grey-400 p-8 inline-block m-24 inline-block bg-grey-400"}>

                    <form 
                    className="mt-6" 
                    onSubmit={handleSubmit}>
                      <div 
                        className="mb-4">
                          <input
                            type="text" 
                            id="projectname" 
                            placeholder="Project Name" 
                            autoComplete="Project Name" 
                            name="title"
                            onChange={handleChangeTitle}
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                          />
                      </div>
                      
                      <div 
                        className="mt-2 grid place-items-center">
                        <img className="w-10 h-10 hover:scale-125" src="icons/upload.png"
                        onClick={ e => {
                          e.preventDefault();
                          openModal();
    
                        }}>
                        </img>
                      </div>

                      <div>
                        <br/>
                        <img className="w-6 h-6 float-left hover:scale-125" src="icons/cross.png"
                        onClick={ e => {
                          e.preventDefault();
                          hide();
    
                        }}>
                        </img>
                        <img onClick={handleSubmit} className="w-6 h-6 float-right hover:scale-125" src="icons/checkmark.png"></img>

                        


                      </div>
                      

                    </form>

                  </div>

                  {projectNamesActive.map((name, i) => 
                    <div key={i} className="h-30 w-30 border rounded-md border-4 border-grey-600 bg-grey-400 p-8 inline-block m-24 inline-block bg-grey-400">
                      <p key={i+"p"}>{name}</p><br/>
                      <img src={`${URLIconsPath}/${projectIconsActive[projectNamesActive.indexOf(name)]}`} width={50} height={50} className=""/>
                      
                    </div>  
                  )}

                </div>

                  
                <div className={(openTab === 2 ? "block" : "hidden") + " grid grid-cols-3 gap-2 place-items-center"} id="link2">
                  
                  {projectNamesHistory.map((name, i) => 
                    <div key={i} className="h-30 w-30 border rounded-md border-4 border-grey-600 bg-grey-400 p-8 inline-block m-24 inline-block bg-grey-400">
                      <p key={i+"p"}>{name}</p><br/>
                      <img src={`${URLIconsPath}/${projectIconsHistory[projectNamesHistory.indexOf(name)]}`} width={50} height={50} className=""/>
                      
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