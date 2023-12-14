import Link from "next/link";
import Form from "../classes/form/Form";
import ServerSidePaths from "./ServerSidePaths";


interface InActiveFormProps {
form: Form;
project: string;
index: number
setModalOpen: (modalOperator: {currentModalTitle: string, isOpen: boolean}) => void;
setActionOnProject: (action: {itemTitle: string, itemIndex: number}) => void;
}

export const InActiveFormElement: React.FC<InActiveFormProps> = ({form, project, index, setModalOpen, setActionOnProject}) => {

if(form.isActive) {
    return (            
        <div key={"div" + form.name + index} className="hover:scale-105 shadow-xl h-30 w-60 rounded-lg border-4 border-grey-600 bg-grey-400 inline-block m-24 inline-block bg-grey-400 ">
        
            {/* user/project/formCreation/[formName]*/}
            <Link href={project + "/formCreator/" + form.name}>

            <p key={"title" + form.name + index} className="mb-8 ml-2 mt-2">{form.name}</p>

            <div className="inline-flex flex-row">
                <p key={"status" + form.name + index} className="italic ml-2 mb-2">Not Published</p>
            </div>  

            </Link><br/>

            <img title={"Delete"} className="w-4 h-6 m-2 float-right hover:scale-125" src={ServerSidePaths.URLFunctionIconsPath + "/trash.png"}
            onClick={ e => {
                setModalOpen({currentModalTitle: "deleteModal", isOpen: true});
                setActionOnProject({itemTitle: form.name, itemIndex: index});
                
            }}>
            </img>

        </div>
    );
}
return null;
};