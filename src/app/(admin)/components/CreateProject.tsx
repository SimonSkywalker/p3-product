import React, { useState } from 'react';
import { Project, ProjectObject } from '@/app/(admin)/components/projectClass';
import ServerSidePaths from './ServerSidePaths';
import { validateProjectData } from '../lib/validation/project';
import FileSystemService from './FileSystemService';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { TitleDuplicateException } from '../exceptions/TitleDuplicateException';
import { CreateWhileEdit } from '../exceptions/CreateWhileEditException';

interface ProjectCreationFormProps {
  creatingProject: boolean;
  setCreating: (isCreating: boolean) => void;
  setModalOpen: (modalOperator: {currentModalTitle: string, isOpen: boolean}) => void;
  newProject: Project;
  projects: ProjectObject[];
  user: string;
  isTitleUnique: (title: string, creation: boolean) => void;
  formattingProjectData: () => void;
  setNewProject: React.Dispatch<React.SetStateAction<Project>>;
}

const ProjectCreationForm: React.FC<ProjectCreationFormProps> = ({
  creatingProject,
  setCreating,
  setModalOpen,
  isTitleUnique,
  projects,
  user,
  formattingProjectData,
  newProject,
  setNewProject,
}) => {

    /**
     * When a new project is submitted, the new project is placed as the first object in the projects state.
     * A new directory with the project title is made within the database.
     */
    const createFolders = async () => {
        await FileSystemService.makeDirectory('../', ServerSidePaths.getProjectPath(user) + `/${newProject.getTitle()}`);
        await FileSystemService.writeToJSONFile([],ServerSidePaths.getProjectPath(user) + `/${newProject.getTitle()}/` + "forms.json")
    } 

    const handleFormSubmit = async (e:React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
    
        try {
    
          let validatedTitle = validateProjectData.parse({ title: newProject.getTitle() });
          newProject.setTitle(validatedTitle.title);
          isTitleUnique(newProject.getTitle(), creatingProject);
        
          //Sets a default icon if none is chosen
          if(newProject.getIcon() === ""){
            newProject.setIcon("person-team.svg");
          }
          
          //converts the new project to an ProjectObject as the already existing objects
          const projectObject: ProjectObject = newProject.convertToProjectObject();
          
          projects.unshift(projectObject);
         
          formattingProjectData();
          
          createFolders();
          
          //Resets the newProject state with empty values
          setNewProject((prevProject) => {
            const updatedProject = new Project();
            updatedProject.setProject({ ...prevProject.getProject(), title: '', icon: '' });
            return updatedProject;
          });
    
          setCreating(false);
          
          toast.success("Created Project: " + newProject.getTitle());
    
        } catch (err) {
          if (err instanceof z.ZodError) {
            err.errors.forEach((validationError) => {
              toast.error(validationError.message);
            });
          }
    
          if (err instanceof TitleDuplicateException) {
            toast.error(err.message);
          }
        }
      };


        /**
   * Checks if the user is currently editing a project, if not - creating state is set to true
   */
  const handleCreateButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const editingProject = projects.filter((project) => project.getBeingEdited());
  
      if (editingProject.length) {
        throw new CreateWhileEdit(editingProject[0].getTitle());
      }
  
      setCreating(true);
    } catch (err) {
      if (err instanceof CreateWhileEdit) {
        toast.warning(err.message);
      }
    }
  };

  return (

    <div>
      <div 
        id="newProjectDiv" 
        className={(!creatingProject ? "block " : "hidden ") + "grid place-items-center h-30 w-30 border-dashed rounded-lg border-4 border-grey-600 bg-grey-400 p-8 inline-block m-24 inline-block bg-grey-400 "}>
          <h3>Create New</h3>
          <button title={"New"} className={"text-5xl text-align-center hover:scale-125"}
          onClick={handleCreateButtonClick}
          >+</button>
      </div>

      <div 
        id="createProjectDiv" 
        className={`${creatingProject ? "block" : "hidden"} grid shadow-xl h-30 w-60 border-solid border-4 border-grey-800 bg-grey-400 p-8 inline-block m-12 bg-grey-400`}>

        <form className="mt-6" onSubmit={handleFormSubmit}>
          <div 
          className="mb-4">
              <input
              type="text" 
              id="projectname" 
              placeholder="Project Name" 
              autoComplete="Project Name" 
              name="title"
              value={newProject.getTitle()} 
              onChange={(e) => setNewProject((prevProject) => {
                  const updatedProject = new Project();
                  updatedProject.setProject({ ...prevProject.getProject(), title: e.target.value });
                  return updatedProject;
              })}

              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
          </div>
          
          <div className="mt-2 grid place-items-center">
          {(newProject.getIcon() === "") ? 
          (
              <button type="button">
              <img className="w-10 h-10 hover:scale-125" src={ServerSidePaths.URLFunctionIconsPath + "/upload.png"} title={"Upload"}
              onClick={ e => {
                  e.preventDefault();
                  setModalOpen({currentModalTitle: "iconModal", isOpen: true});
              }}></img>
          </button>
          ) : (
              <button type="button">
              <img title={"Project"} className="w-10 h-10 hover:scale-125" src={"icons/" + newProject.getIcon()}
              onClick={ e => {
              e.preventDefault();
              setModalOpen({currentModalTitle: "iconModal", isOpen: true});

          }}></img>
          </button>
          )
          } 
          
          </div>

          <div>
          <br/>
          <img title={"Cancel"} className="w-6 h-6 float-left hover:scale-125" src={ServerSidePaths.URLFunctionIconsPath + "/cross.png"}
          onClick={ e => {
              setNewProject((prevProject) => {
              const updatedProject = new Project();
              updatedProject.setProject({ ...prevProject.getProject(), icon: '' , title: ''});
              return updatedProject;
              });
              setCreating(false);
              e.preventDefault(); // Prevent the form submission
          }}></img>
          <button
              type="submit"
              className="p-0 m-0 float-right border-none bg-none cursor-pointer"
          >
              <img
              title={"Submit"}
              className="w-6 h-6 float-right hover:scale-125"
              src={ServerSidePaths.URLFunctionIconsPath + "/checkmark.png"}
              alt="Submit"
              />
          </button>
          
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProjectCreationForm;