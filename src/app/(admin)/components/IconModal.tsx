import React from 'react';
import Modal from 'react-modal';
import ServerSidePaths from './ServerSidePaths'; // Adjust the import path as needed
import FileSystemService from './FileSystemService';
import { Project } from './projectClass';
import { toast } from 'react-toastify';

interface IconModalProps {
  modalOpen: { currentModalTitle: string, isOpen: boolean };
  setModalOpen: (modalState: { currentModalTitle: string, isOpen: boolean }) => void;
  icons: string[];
  setIcons: (icons: string[]) => void; 
  URLIconsPath: string;
  newProject: Project; // Define a more specific type if possible
}

const IconModal: React.FC<IconModalProps> = ({ modalOpen, setModalOpen, icons, setIcons, URLIconsPath, newProject }) => {

 /**
   * Handles when an icon is uploaded. 
   * Sets a variable 'file' as the file at index[0] if more files are uploaded. 
   * Creates new FormData with the file as the value of the field file. 
   * The formData is used to call the postIcon function to post the new icon to the icon folder.
   * The icons state is updated with the updated icon folder.
   */
 async function handleUploadIcon(e:React.ChangeEvent<HTMLInputElement>) {
  e.preventDefault();

  const fileInput = e.target;

  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    // Handle the case where there are no files selected
    return;
  }

  const file = fileInput.files[0];

  // Check if the file is an image
  if (!file.type.startsWith('image/')) {
    toast.warning(file.type + ' is not an image:');
    // Optionally, show an error message to the user here
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const result: { [key: string]: any } = await FileSystemService.postIcon(formData);
  console.log("filename:", result["filename"]);
  console.log("size:", result["size"]);

  //Resets the file input field
  e.target.value = '';                

  FileSystemService.listFiles(ServerSidePaths.getIconsPath()).then((iconFiles) => {
    setIcons(iconFiles);
  });

}

  return (
    <Modal
      isOpen={modalOpen.currentModalTitle === "iconModal"}
      onRequestClose={() => setModalOpen({currentModalTitle: "", isOpen: false})}
      contentLabel="Choose Icon Modal"
      className="modal-icon"
    >
      <img className="w-6 h-6 float-right hover:scale-125" src={ServerSidePaths.URLFunctionIconsPath + "/cross.png"} title={"Cancel"} onClick={() => setModalOpen({currentModalTitle: "", isOpen: false})}></img>
            
            <form 
            className="mt-6" 
            onSubmit={(e) => {e.preventDefault(); setModalOpen({currentModalTitle: "", isOpen: false})}}>
              <h2 className="text-3xl text-center m-4">Select Project Icon</h2>
              <div id="chooseIcon" className="grid grid-cols-3 gap-2 place-items-center m-12">

                {icons.map(icon => ( 

                  <div key={icon + "Div"}>
                    <label>
                      <input type="radio" onChange={(e) => newProject.setIcon(e.target.value)} name="icon" value={icon} className="hidden"></input>
                      <img src={`${URLIconsPath}/${icon}`} alt={icon} title={icon} width={50} height={50} className="hover:scale-125"/>
                    </label>
                  </div>
                ))}
    
              </div>
                
              <hr className="rounded-lg border-2"></hr>

              <h2 className="text-3xl text-center m-4">Or Upload Image</h2>
              <div id="uploadIcon" className="grid place-items-center m-12">

                <label htmlFor="file-input">
                  <img title={"upload"} className="w-10 h-10 hover:scale-125" src={ServerSidePaths.URLFunctionIconsPath + "/upload.png"}/>
                </label>
                <input id="file-input" type="file" onChange={e => handleUploadIcon(e)} className="hidden"/>

              </div>
 
              <button 
                type="submit"
                title="submitButton"
                onClick={() => setModalOpen({currentModalTitle: "", isOpen: false})}
                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 hover:scale-105" >
                Submit
              </button>

            </form>
    </Modal>
  );
}

export default IconModal;