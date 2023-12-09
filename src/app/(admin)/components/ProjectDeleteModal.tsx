import React from 'react';
import Modal from 'react-modal';
import ServerSidePaths from './ServerSidePaths'; // Adjust the import path as needed
import { ProjectObject } from './projectClass';
import FileSystemService from './FileSystemService';
import { toast } from 'react-toastify';

interface DeleteConfirmModalProps {
  modalOpen: { currentModalTitle: string, isOpen: boolean };
  setModalOpen: (modalState: { currentModalTitle: string, isOpen: boolean }) => void;
  projects: ProjectObject[];
  setProjects: (projects: ProjectObject[]) => void;
  actionOnProject: { itemTitle: string, itemIndex: number };
  setActionOnProject: (action: { itemTitle: string, itemIndex: number }) => void;
  formattingProjectData: () => void;
  user: string;
}

const ProjectDeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ modalOpen, setModalOpen, projects, setProjects, actionOnProject, setActionOnProject, formattingProjectData, user}) => {
  
  const handleDelete = async () => {

    // Has to .splice since useState value doesnt change
    // immediately but only schedules a change.
    projects.splice(actionOnProject.itemIndex, 1);

    await formattingProjectData();
    FileSystemService.delete('../', ServerSidePaths.getProjectPath(user) + `/${actionOnProject.itemTitle}`);
    
    toast.info("Deleted " + actionOnProject.itemTitle);

    //Resets the actionOnProject state
    setActionOnProject({itemTitle: "", itemIndex: -1});
    setModalOpen({currentModalTitle: "", isOpen: false});
  };
  
  return (
    <Modal
      isOpen={modalOpen.currentModalTitle === "deleteModal"}
      onRequestClose={() => setModalOpen({currentModalTitle: "", isOpen: false})}
      contentLabel="Delete confirm modal"
      className="modal-confirm"
    >
      <img title={"Cancel"} className="w-6 h-6 float-right hover:scale-125" src={ServerSidePaths.URLFunctionIconsPath + "/cross.png"} onClick={() => setModalOpen({currentModalTitle: "", isOpen: false})}></img>
            
            <p className="mt-8 mb-8 text-xl text-center">Are you sure you would like to delete {actionOnProject?.itemTitle} ?</p>
            
            <p className="mt-8 mb-8 text-l text-center">Deleted objects can never be recovered</p>

            <button 
                type="button"
                title="deleteButton"
                onClick={()=>{handleDelete()}}
                className="float-left m-2 px-12 py-2 tracking-wide text-white transition-colors duration-200 transform bg-red-700 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600 hover:scale-105" >
                Delete
              </button>
            <button 
                type="button"
                title="cancelButton"
                onClick={() => setModalOpen({currentModalTitle: "", isOpen: false})}
                className="float-right m-2 px-12 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 hover:scale-105" >
                Cancel
              </button>
    </Modal>
  );
}

export default ProjectDeleteConfirmModal;