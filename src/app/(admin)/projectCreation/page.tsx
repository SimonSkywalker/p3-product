'use client'
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import FileSystemService from "@/app/(admin)/components/FileSystemService";
import ServerSidePaths from '@/app/(admin)/components/ServerSidePaths';
import {Project, ProjectObject} from '@/app/(admin)/components/projectClass';
import {ProjectInterface, actionProject, modalOperator} from '@/app/(admin)/interfaces/interfaces';
import { TitleDuplicateException } from "@/app/(admin)/exceptions/TitleDuplicateException";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/app/(admin)/context/Auth";
import { InactiveProjects } from "../components/InActiveProjectElement";
import IconModal from "../components/IconModal";
import ProjectDeleteConfirmModal from "../components/ProjectDeleteModal";
import ArchiveConfirmModal from "../components/ArchiveModal";
import Tabs from "../components/StateTabs";
import ProjectCreationForm from "../components/CreateProject";
import {ActiveProjectElement} from "../components/ActiveProjectElement";




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
    
    const projectsWithBeingEdited: ProjectObject[] = data.map((projectData) => {
      // Modify the title by replacing all occurrences of '-' with a space
      const modifiedTitle = projectData.title.replace(/-/g, ' ');

      // Return a new ProjectObject with the modified title and other properties
      return new ProjectObject({ ...projectData, title: modifiedTitle });
    });
    
    setProjects(projectsWithBeingEdited);

  }
  
  /**
   * getProjectDataArray returns an array with each field of a project for all the projects. 
   * This data is modified with its properties and then written to the project database with the
   * writeToJSONFile function. 
   */
  async function formattingProjectData() {
  const transformedData = projects.map((project) => {
    const [title, isActive, icon] = project.getProjectDataArray();

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
                  {projects.map((project, i) => (
                      <ActiveProjectElement
                        index={i}
                        project={project}
                        projects={projects}
                        setProjects={setProjects}
                        user={user}
                        creatingProject={creatingProject}
                        formattingProjectData={formattingProjectData}
                        actionOnProject={actionOnProject}
                        setModalOpen={setModalOpen}
                        isTitleUnique={isTitleUnique}
                        setActionOnProject={setActionOnProject}
                        URLIconsPath={URLIconsPath}
                      />
                  ))}
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