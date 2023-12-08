/*
Describe Integration Tests
Active / History Tabs Stay right below NavBar
*/
'use client'
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import FileSystemService from "@/app/(admin)/components/FileSystemService";
import ServerSidePaths from '@/app/(admin)/components/ServerSidePaths';
import {Project, ProjectObject} from '@/app/(admin)/components/projectClass';
import {ProjectInterface, projectObject, actionProject, modalOperator} from '@/app/(admin)/interfaces/interfaces';
import { TitleDuplicateException } from "@/app/(admin)/exceptions/TitleDuplicateException";
import { CreateWhileEdit } from "@/app/(admin)/exceptions/CreateWhileEditException";
import { EditWhileCreating } from "@/app/(admin)/exceptions/EditWhileCreating";
import { EditingAlreadyActive } from "@/app/(admin)/exceptions/EditingAlreadyActiveException";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateProjectData } from "@/app/(admin)/lib/validation/project";
import { z } from "zod";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/app/(admin)/context/Auth";
import { InactiveProjects } from "../components/ProjectElement";
import IconModal from "../components/IconModal";
import ProjectDeleteConfirmModal from "../components/ProjectDeleteModal";
import ArchiveConfirmModal from "../components/ArchiveModal";
import Tabs from "../components/StateTabs";
import ProjectCreationForm from "../components/CreateProject";

export default function ProjectPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const [user, setUser] = useState("");
  
  const [openTab, setOpenTab] = useState<number>(1);
  const tabLabels: string[] = ["Active", "History"];

  const [modalOpen, setModalOpen] = useState<modalOperator>({currentModalTitle: "", isOpen: false});

  const [icons, setIcons] = useState<string[]>([]);
  const [projects, setProjects] = useState<ProjectObject[]>([]);
  
  const [actionOnProject, setActionOnProject] = useState<actionProject>({itemTitle:"", itemIndex: -1});
  
  const [creatingProject, setCreating] = useState<boolean>(false);
  const [newProject, setNewProject] = useState<Project>(new Project());


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
        } finally {
          setIsLoading(false);
        }
      };
  
      validateToken();

      FileSystemService.APIRequestUser().then(async (data) => {
        setUser(await data.Id);
        getProjects(data.Id);
      });
   
    //Sets the div 'outerDiv' as the appElement of the modals, 
    //such that the page content inside the div is hidden when a modal is in use.
    const appElement: HTMLElement | null = document.getElementById('outerDiv');
    if (appElement) {
      Modal.setAppElement(appElement);
    }

    FileSystemService.listFiles(ServerSidePaths.getIconsPath()).then((iconFiles) => {
      setIcons(iconFiles);
    });
    
  }, []);
  
  if (isLoading) {
    // You can display a loading indicator here if needed
    return <div>Loading...</div>;
  }
 
  const URLIconsPath = ServerSidePaths.getURLIconsPath();

  /**
   * Function that calls the getJSONFile function,
   *  which returns all of the users projects as an array of ProjectInterfaces. 
   * The projects get redefined as ProjectObjects and are set as the state projects.
   */
  async function getProjects(theUser: string) {
    
    console.log("get projects user ", user);
    
    const data: ProjectInterface[] = await FileSystemService.getJSONFile(ServerSidePaths.getProjectsPath(theUser)) as ProjectInterface[];
    
    const modifiedData = data.map((project) => {
      // Assuming project.title is the property you want to modify
      const modifiedTitle = project.title.replace(/-/g, ' '); // Replace all occurrences of '-' with a space
    
      // Return a new object with the modified title
      return { ...project, title: modifiedTitle };
    });
    
    const projectsWithBeingEdited: ProjectObject[] = modifiedData.map((projectData) => {return new ProjectObject(projectData)});
    setProjects(projectsWithBeingEdited);

  }
  
  /**
   * getProjectDataArray returns an array with each field of a project for all the projects. 
   * This data is modified with its properties and then written to the project database with the
   * writeToJSONFile function. 
   */
  async function formattingProjectData() {
    
    const data = projects.map((project) => project.getProjectDataArray()); 

    const transformedData = data.map(([title, isActive, icon]) => {
      // Replace spaces with hyphens in the title
      const modifiedTitle = title.replace(/ /g, '-');
    
      // Return a new object with the modified title and other properties
      return {
        title: modifiedTitle,
        isActive,
        icon,
      };
    });

    await FileSystemService.writeToJSONFile(transformedData, ServerSidePaths.getProjectsPath(user));
    console.log(ServerSidePaths.getProjectsPath(user));

  }

  /**
   * Case 1 - Creating a new project:
   * Filters through the projects. If there is a match in title with the new project - notUniqueTitle is > 0
   * creation is true - maxIndex is 0
   * 
   * Case 2 - Editing a project:
   * Filters through the projects. 
   * If there is a match in title with the project being edited, that is not the prev title - notUniqueTitle is > 1
   * creation is true - maxIndex is 1
   */
  function isTitleUnique (title: string, creation: boolean) {

    try {
      
      const notUniqueTitle = projects.filter(project => {return project.getTitle() === title});
      const maxIndex = (creation) ? 0 : 1;
      if(notUniqueTitle.length > maxIndex){

        if(notUniqueTitle.some(project=>{return project.getIsActive() === false})){
          toast.info("The conflicting project is located in history");
        }

        throw new TitleDuplicateException();

      }

    } catch(err) {

      throw err;

    }

  }

  /**
   * Case 1 - The user cancels editing a project:
   * The project title is set to be the previous title before edit and beingEdited is set to false
   * 
   * Case 2 - The user starts to edit a project:
   * The previousTitle is set to be the project title for safe keeping and beingEdited is set to true
   */
  const handleEdit = (editedProject:ProjectObject) => {

    if(editedProject.getBeingEdited()){
      editedProject.setTitle(editedProject.getpreviousTitle());
      editedProject.setBeingEdited(false);
    } else {
      editedProject.setpreviousTitle(editedProject.getTitle());
      editedProject.setBeingEdited(true);
    
    }
    // Update the project in the state
    setProjects((prevProjects) => {
      // Your logic to update the project goes here
      return [...prevProjects];
    });
  };
  
  /**
   * Checks if the user is already creating or editing another project
   * Calls handleEdit
   */
  const setEdit = (project:ProjectObject) => {
    try {
      
      const editingProject = projects.filter(project => {return project.getBeingEdited()});
      
      if(creatingProject){
        throw new EditWhileCreating();
      }
      
      if(editingProject.length) {
        throw new EditingAlreadyActive(editingProject[0].getTitle());
      }
      //SAD project.getTitle() 
      setActionOnProject({itemTitle: project.getTitle(), itemIndex: -1});
      handleEdit(project);

    } catch (err){
      
      if(err instanceof EditWhileCreating) {
        toast.warning(err.message);
      }

      if(err instanceof EditingAlreadyActive) {
        toast.warning(err.message);
      }
    }
  }

  return (
    <>
      <div className="flex flex-wrap">
      <ToastContainer />
        <div id="outerDiv" className="w-full">

          <IconModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            icons={icons}
            setIcons={setIcons}
            URLIconsPath={URLIconsPath}
            newProject={newProject}
          />

          <ProjectDeleteConfirmModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            projects={projects}
            setProjects={setProjects}
            actionOnProject={actionOnProject}
            setActionOnProject={setActionOnProject}
            formattingProjectData={formattingProjectData}
            user={user}
          />
          
          <ArchiveConfirmModal
            modalOpen={modalOpen}
            projects={projects}
            setProjects={setProjects}
            setModalOpen={setModalOpen}
            setActionOnProject={setActionOnProject}
            formattingProjectData={formattingProjectData}
            actionOnProject={actionOnProject}
          />
                     
          {/* Active / History Tab */}
          <Tabs activeTab={openTab} setActiveTab={setOpenTab} tabLabels={tabLabels} />

          <div className="relative flex flex-col min-w-72 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">

                {/* 
                *  Begin Elements shown when on Active Tab
                */}
                <div className={(openTab === 1 ? "block" : "hidden") + " grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-5 place-items-center"}  id="link1">
                  
                  {/* 
                  * Elements in the following Div are hidden if 
                  * creatingProject useState is true
                  */}
                  {/* <div 
                    id="newProjectDiv" 
                    className={(!creatingProject ? "block " : "hidden ") + "grid place-items-center h-30 w-30 border-dashed rounded-lg border-4 border-grey-600 bg-grey-400 p-8 inline-block m-24 inline-block bg-grey-400 "}>
                      <h3>Create New</h3>
                      <button title={"New"} className={"text-5xl text-align-center hover:scale-125"}
                      onClick={handleCreateButtonClick}
                      >+</button>
                  </div> */}

                  {/* 
                  * Elements in the following Div are hidden if 
                  * creatingProject useState is false
                  */}
                      <ProjectCreationForm
                        creatingProject={creatingProject}
                        setCreating={setCreating}
                        user={user}
                        projects={projects}
                        isTitleUnique={isTitleUnique}
                        formattingProjectData={formattingProjectData}
                        setModalOpen={setModalOpen}
                        newProject={newProject}
                        setNewProject={setNewProject}
                      />
                  

                  {/*
                  * maps through all the projects stored in the Array,
                  * creating the object to interact with on the page
                  */}
                  {projects.map((project, i) => 
                  
                    //Creates the project element if the projects' isActive is true
                    project.getIsActive() ? (
                      <div key={"DivActive" + project.getTitle() + i} className="hover:scale-105 shadow-xl h-30 w-60 border rounded-md border-4 border-grey-600 bg-grey-400 p-8 inline-block m-12 inline-block bg-grey-400">
                        
                        {/* Archive Icon to archive the project */}
                        <div 
                          className="flex justify-between items-center">
                            
                            <Link 
                              href={"/" + user + "/" + project.getTitle().replace(/ /g, '-') + "/chart"}
                            >
                              <img 
                                title={"Charts"} 
                                className="w-6 h-6 hover:cursor-pointer  hover:scale-125" 
                                src={ServerSidePaths.URLFunctionIconsPath + "/chart.png"}
                              />
                            </Link>
                            
                            <img title={"Archive"} className="w-6 h-6 hover:scale-125 hover:cursor-pointer" src={ServerSidePaths.URLFunctionIconsPath + "/archive.png"}
                            onClick={ e => {
                              setModalOpen({currentModalTitle: "archiveModal", isOpen: true});
                              setActionOnProject({itemTitle: project.getTitle(), itemIndex: i});
                              console.log(project.getTitle());
                            }}>
                            </img>
                        </div>

                        <form key={"Form" + project.getTitle() + i} onSubmit={(e) =>{
                          e.preventDefault();
                          project.setBeingEdited(false);
                        }}>
                          
                          {/* 
                          * if the Project is being edited, an input field
                          * is shown instead of a paragraph
                          */}
                          { (project.getBeingEdited()) ? (
                            <div className="relative ">
                              <input
                              type="text" 
                              value={actionOnProject?.itemTitle}
                              key={"inputField" + i}
                              onChange={(e)=>{setActionOnProject({itemTitle: e.target.value, itemIndex: -1})                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault(); // Prevent the form submission
                                  try {
                                    let validatedTitle = validateProjectData.parse({title: actionOnProject.itemTitle});
                                    project.setTitle(validatedTitle.title);
                                    isTitleUnique(project.getTitle(), creatingProject);
                                    project.setBeingEdited(false);
                                    formattingProjectData();
                                    FileSystemService.rename('../', ServerSidePaths.getProjectPath(user) + `/${project.getpreviousTitle()}`,project.getTitle());
                                    //setTrigger(!trigger);
                                  } catch(err) {

                                    if(err instanceof z.ZodError){

                                      err.errors.forEach((validationError)=> {
                                        toast.error(validationError.message);
                                      })  
                                    }
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
                                title="Cancel"
                                onClick={() => {handleEdit(project);}}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 px-[8px] py-[3px] text-black rounded-md border hover:text-white border-black-300 hover:bg-black-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                                X
                              </button>
                            </div>
                          ) : (
                            <p 
                            key={"TitleActive" + project.getTitle() + i}
                            className="text-center pb-4">{project.getTitle()}</p>
                          ) }
                          
                          {/*
                          * Link if you click on the icon redirecting
                          * the user to the clicked project page
                          */}
                          <Link href={"/" + user + "/" + project.getTitle().replace(/ /g, '-')}>
                            <img 
                            title={"Project"}
                            key={"Icon" + project.getIcon() + i} 
                            src={`${URLIconsPath}/${project.getIcon()}`}
                            width={50} 
                            height={50} 
                            className="mt-4 mx-auto block rounded"/>
                          </Link><br />
                          
                          <div 
                            
                            key={"buttonsDiv" + i}
                            className="flex justify-between items-center ">
                            <img title={"Delete"} className="w-4 h-6 hover:cursor-pointer  hover:scale-125" src={ServerSidePaths.URLFunctionIconsPath + "/trash.png"}
                            onClick={ e => {
                              setModalOpen({currentModalTitle: "deleteModal", isOpen: true});
                              setActionOnProject({itemTitle: project.getTitle(), itemIndex: i});
                              console.log(project.getTitle());
                            }}>
                            </img>
                            <img title={"Edit"} className="w-4 h-6  hover:scale-125 hover:cursor-pointer" src={ServerSidePaths.URLFunctionIconsPath + "/edit.png"}
                            onClick={()=>{setEdit(project);}}>
                            </img>
                          </div>
                        </form>
                      </div>  

                      ) : (

                        <p key={project.getTitle() + "" + i} className="hidden"/>

                      )
                  )}

                </div>
                {/* 
                *  End Elements shown when on Active Tab
                */}


                {/* 
                *  Begin Elements shown when on History Tab
                *  History is a synchrone version of Active - Just
                *  Without the ability to edit and archive the project
                */}
                <div className={(openTab === 2 ? "block" : "hidden") + " grid grid-cols-3 gap-2 place-items-center"} id="link2">
                  
                {projects.map((project, i) => (
                  <InactiveProjects
                    key={`project-${project.getTitle()}-${i}`}
                    index={i}
                    project={project}
                    user={user}
                    onDelete={(title, index) => {
                      setModalOpen({ currentModalTitle: "deleteModal", isOpen: true });
                      setActionOnProject({ itemTitle: title, itemIndex: index });
                    }}
                    URLIconsPath={URLIconsPath}
                  />
                ))}

                </div>  
                {/* 
                *  End Elements shown when on History Tab
                */}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
