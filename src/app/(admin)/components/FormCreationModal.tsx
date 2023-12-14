import React from 'react';
import Modal from 'react-modal';
import Form from '../classes/form/Form';
import ServerSidePaths from './ServerSidePaths';
import Link from 'next/link';
import { toast } from 'react-toastify';
import ObjectAlreadyExistsException from '../exceptions/ObjectAlreadyExistsException';
import FormValidator from '../classes/form/FormValidator';
import FormBuilder from '../classes/form/FormBuilder';
import { z } from 'zod';
import FileSystemService from '../classes/FileSystemService';

interface FormCreationModalProps {
  modalOpen: { currentModalTitle: string, isOpen: boolean };
  setModalOpen: (modalState: { currentModalTitle: string, isOpen: boolean }) => void;
  forms: Form[];
  selectedForm: Form;
  setSelectedForm: (selectedForm: Form) => void;
  nameInput: string;
  setNameInput: (nameInput: string) => void;
  user: string;
  project: string;
}


const FormCreationModal: React.FC<FormCreationModalProps> = ({ modalOpen, setModalOpen, selectedForm, setSelectedForm, forms, nameInput, user, project, setNameInput}) => {
    const publishedForms = forms.filter((form) => !form.isActive);
    const notPublishedForms = forms.filter((form) => form.isActive);

    const closeModal = () => {
        setModalOpen({ currentModalTitle: '', isOpen: false });
        setNameInput('');
      };

    const truncateString = (str: string, maxLength: number) => {
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
    };

    async function writeFormData() {
        const projectAltered = project.replace(/-/g, ' ');
        FileSystemService.writeToJSONFile(forms, ServerSidePaths.getFormsPath(user, projectAltered).replace(/%20/g,' '));
    }

    const handleSelectChange = (e:any) => {
        const selectedValue = e.target.value;
        const selectedForm = forms.find((form) => form.name === selectedValue);
        setSelectedForm(selectedForm as Form);
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

  return (
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
            href={project + "/formCreator/newForm"}
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
  );
}

export default FormCreationModal;