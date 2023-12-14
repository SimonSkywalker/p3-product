import React from 'react';
import Link from 'next/link';
import { Project, ProjectObject } from '@/app/(admin)/classes/projectClass'; // Adjust the import path
import ServerSidePaths from './ServerSidePaths'; // Adjust the import path
import { validateProjectData } from '../lib/validation/project';
import FileSystemService from '../classes/FileSystemService';
import { z } from 'zod';
import { TitleDuplicateException } from '../exceptions/TitleDuplicateException';
import { toast } from 'react-toastify';
import { EditWhileCreating } from '../exceptions/EditWhileCreating';
import { EditingAlreadyActive } from '../exceptions/EditingAlreadyActiveException';

interface ProjectItemProps {
  creatingProject: boolean;
  project: ProjectObject;
  projects: ProjectObject[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectObject[]>>;
  user: string;
  setModalOpen: (modalOperator: {currentModalTitle: string, isOpen: boolean}) => void;
  actionOnProject: { itemTitle: string, itemIndex: number };
  setActionOnProject: (action: {itemTitle: string, itemIndex: number}) => void;
  isTitleUnique: (title: string, creation: boolean) => void;
  formattingProjectData: () => void;
  URLIconsPath: string;
  index: number;
}

export const ActiveProjectElement: React.FC<ProjectItemProps> = ({
  actionOnProject,
  creatingProject,
  project,
  projects,
  setProjects,
  user,
  setModalOpen,
  setActionOnProject,
  URLIconsPath,
  index,
  isTitleUnique,
  formattingProjectData
}) => {

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
      return [...prevProjects];
    });
  };

  //Creates the project element if the projects' isActive is true
  if (project.getIsActive()) {
    return (
      <div key={"DivActive" + project.getTitle() + index} className="hover:scale-105 shadow-xl h-30 w-60 border rounded-md border-4 border-grey-600 bg-grey-400 p-8 inline-block m-12 inline-block bg-grey-400">
                          
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
            setActionOnProject({itemTitle: project.getTitle(), itemIndex: index});
            console.log(project.getTitle());
          }}>
          </img>
      </div>

      <form key={"Form" + project.getTitle() + index} onSubmit={(e) =>{
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
            key={"inputField" + index}
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
                  FileSystemService.rename(ServerSidePaths.getProjectPath(user) + `/${project.getpreviousTitle()}`,project.getTitle());
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
          key={"TitleActive" + project.getTitle() + index}
          className="text-center pb-4">{project.getTitle()}</p>
        ) }
        
        {/*
        * Link if you click on the icon redirecting
        * the user to the clicked project page
        */}
        <Link 
        href={"/" + user + "/" + project.getTitle().replace(/ /g, '-')} 
        onClick={(e)=>{if(project.getBeingEdited()){e.preventDefault()}}}
        className={`${project.getBeingEdited() && 'disabled'}`}>
          <img 
          title={"Project"}
          key={"Icon" + project.getIcon() + index} 
          src={`${URLIconsPath}/${project.getIcon()}`}
          width={50} 
          height={50} 
          className="mt-4 mx-auto block rounded"/>
        </Link><br />
        
        <div 
          
          key={"buttonsDiv" + index}
          className="flex justify-between items-center ">
          <img title={"Delete"} className="w-4 h-6 hover:cursor-pointer  hover:scale-125" src={ServerSidePaths.URLFunctionIconsPath + "/trash.png"}
          onClick={ e => {
            setModalOpen({currentModalTitle: "deleteModal", isOpen: true});
            setActionOnProject({itemTitle: project.getTitle(), itemIndex: index});
            console.log(project.getTitle());
          }}>
          </img>
          <img title={"Edit"} className="w-4 h-6  hover:scale-125 hover:cursor-pointer" src={ServerSidePaths.URLFunctionIconsPath + "/edit.png"}
          onClick={()=>{setEdit(project);}}>
          </img>
        </div>
      </form>
    </div>  

                  
    );
  }
return null;
};