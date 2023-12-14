import React from 'react';
import Modal from 'react-modal';
import ServerSidePaths from './ServerSidePaths'; // Adjust the import path as needed
import { ProjectObject } from '../classes/projectClass';
import { toast } from 'react-toastify';



interface ArchiveConfirmModalProps {
  modalOpen: { currentModalTitle: string, isOpen: boolean };
  setModalOpen: (modalState: { currentModalTitle: string, isOpen: boolean }) => void;
  projects: ProjectObject[];
  setProjects: (projects: ProjectObject[]) => void; 
  setActionOnProject: (action: { itemTitle: string, itemIndex: number }) => void;
  formattingProjectData: () => void;
  actionOnProject: { itemTitle: string, itemIndex: number };
}

const ArchiveConfirmModal: React.FC<ArchiveConfirmModalProps> = ({ modalOpen, setModalOpen, actionOnProject, projects, formattingProjectData, setActionOnProject }) => {

 /**
   * Runs through the projects state and looks for the one to archive. 
   * Sets IsActive to false for the selected project
   */
 const handleArchive = async () => {
  projects.map((project) => {
    if(project.getTitle() === actionOnProject.itemTitle){
      project.setBeingEdited(false);
      project.setIsActive(false);
    }
  })
  //projects[actionOnProject.projectIndex].setIsActive(false);
  
  await formattingProjectData();
  
  toast.info("Moved " + actionOnProject.itemTitle + " to archive" );

  //Resets the actionOnProject state
  setActionOnProject({itemTitle:"", itemIndex: -1});
  setModalOpen({currentModalTitle: "", isOpen: false});
}

  return (
    <Modal
      isOpen={modalOpen.currentModalTitle === "archiveModal"}
      onRequestClose={() => setModalOpen({currentModalTitle: "", isOpen: false})}
      contentLabel="Archive confirm modal"
      className="modal-confirm"
    >
      <img title={"Cancel"} className="w-6 h-6 float-right hover:scale-125" src={ServerSidePaths.URLFunctionIconsPath + "/cross.png"} onClick={() => setModalOpen({currentModalTitle: "", isOpen: false})}></img>
            
            <p className="mt-8 mb-8 text-xl text-center">Are you sure you would like to archive {actionOnProject?.itemTitle} ?</p>

            <button 
                type="button"
                title="archiveButton" 
                onClick={() => handleArchive()}
                className="float-left m-2 px-12 py-2 tracking-wide text-white transition-colors duration-200 transform bg-red-700 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600 hover:scale-105" >
                Archive
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

export default ArchiveConfirmModal;