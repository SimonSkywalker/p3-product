'use client'

import FormValidator from "../../../../formCreation/FormValidator";
import {Checkbox} from "@nextui-org/checkbox";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/dropdown"
import {Button} from "@nextui-org/button"
import {Input} from "@nextui-org/input"
import {RadioGroup, Radio} from "@nextui-org/radio"
import {Modal, ModalContent} from "@nextui-org/react";
import FileSystemService from "@/app/components/FileSystemService";
import Form from '../../../../formCreation/Form';
import Question from "../../../../formCreation/question";
import FileFinder from '../../../../formCreation/FileFinder';
import { QuestionTypes, MultipleChoice, Slider, ChoiceTypes, SliderTypes } from "../../../../formCreation/question";
import { useEffect, useState} from "react";
import TokenBuilder from "../../../../formCreation/TokenBuilder";
import DatabaseAccess from "../../../../formCreation/DatabaseAccess";
import _, { update } from 'lodash';
import FormBuilder from "../../../../formCreation/FormBuilder";
import FormErrorHandler, { FormFormData } from "../../../../formCreation/FormErrorHandler";
import ObjectAlreadyExistsException from "../../../../exceptions/ObjectAlreadyExistsException";
import { error } from "console";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import ServerSidePaths from "@/app/components/ServerSidePaths";

let tokenBuilder : TokenBuilder = new TokenBuilder();
const maxQuestions : number = 255;
const rootLink : string = "https://www.testwebsite.com"
let databaseFile: string;
let forms: DatabaseAccess;
let currForm = new Form;
const errorHandler = new FormErrorHandler();

class FormCreator{
  public static createOptions(question: MultipleChoice, errors : FormErrorHandler, updateState: () => void){
    errors.addOptionErrors(question.number-1, question.options.length);
    return <>
    {question.options.map((e, index) => {return <ul key={index}> <Input value={e} color="secondary"  onValueChange={(input) =>{
      question.renameOption(index, input);
      updateState();
    }}></Input>
    {errors.validationErrors._questions[question.number-1]._options[index] && (
            <div 
              className="error">
              {errors.validationErrors._questions[question.number-1]._options[index]}
            </div>
          )}
    <Button className="button" onClick={() => {
      question.removeOption(index);
      errors.cleanOption(question.number-1, index);
      updateState();
      }}>Remove option</Button> </ul>})}
    <Button className="button" onClick={() => {
      question.addOption();
      updateState();
    }}>Add option</Button>
    </>
  }

  public static renderSwitch(question: Question, errors : FormErrorHandler, updateState: () => void){
    switch(question.questionType){
      case QuestionTypes.slider: {
        return <><Input color="secondary" value={((question as Slider).range).toString()} type="number" label="Amount of steps" min="3" max="9" step="2" onValueChange={(value) => {
          (question as Slider).range = parseInt(value);
          updateState();
        }}/>
        <RadioGroup
        label="Slider type"
        //Default value is a string equal to the name of the sliderType enum
        defaultValue={SliderTypes[(question as Slider).sliderType]}
        onValueChange={(value) => {
          switch (value){
            case "agreeDisagree":{
              (question as Slider).sliderType = SliderTypes.agreeDisagree;
              break;
            }
            case "values":{
              (question as Slider).sliderType = SliderTypes.values;
              break;
            }
          }
        }}>
          <Radio value="agreeDisagree" >Agree/disagree</Radio>
          <Radio value="values">Number values</Radio>
        </RadioGroup></>
      }
      case QuestionTypes.multipleChoice: {
        return <>
        <Checkbox isSelected={(question as MultipleChoice).choiceType == ChoiceTypes.checkbox} onValueChange={(check) => {
        (question as MultipleChoice).choiceType = check ? ChoiceTypes.checkbox : ChoiceTypes.radio;
        updateState();
      }}>Allow multiple options checked</Checkbox>
        <Checkbox isSelected={(question as MultipleChoice).saveRole} onValueChange={(check) => {
        (question as MultipleChoice).saveRole = check;
        updateState();
      }}>Use question to determine roles</Checkbox>
      {FormCreator.createOptions(question as MultipleChoice, errors, updateState)}</>
      }
      case QuestionTypes.textInput: {
        return <></>
      }
    }
  }

  public static createQuestionBox(form: Form, question : Question, errors: FormErrorHandler, updateState: () => void) {
    errors.addQuestionErrors(question.number);
    console.dir(errors);
    return <><p> Question number {question.number}</p>
    <Input color="secondary"  label="Question name" value={question.description} onValueChange={(value) => {
        question.description = value;
        updateState();
      }}></Input>
      {errors.validationErrors._questions[question.number-1]._description && (
            <div 
              className="error">
              {errors.validationErrors._questions[question.number-1]._description}
            </div>
          )}
    <Checkbox isSelected={question.mandatory} onValueChange={(check) => {
        question.mandatory = check;
        updateState();
      }}>Required</Checkbox>
    <Checkbox isSelected={question.userDisplay} onValueChange={(check) => {
        question.userDisplay = check;
        updateState();
      }}>Show answers to respondents</Checkbox>
    {FormCreator.renderSwitch(question, errors, updateState)}
    <Button className="button" onClick={() => {
      form.removeQuestion(question.number-1);
      errors.cleanQuestion(question.number-1);
      updateState();
    }}>Remove question</Button>
    </>
  }
}

interface CreationPageParams {
  params: {
    user: string;
    project: string;
    formName: string;
  }
}

export default function FormCreation({params} : CreationPageParams) {
  console.log("goofy");

const router = useRouter();

const username : string = params.user;
const project : string = params.project.replace(/(?<!\\)-/g," ").replace(/\\-/g,"-");
const formName : string = params.formName;
const pathToSrc : string = "../../../..";

/**
 * This useEffect checks for the user's cookies to see if they are logged in
 * If no token is found from the cookies, or if it is not validated, send a message and reroute to the login page
 */
useEffect(() => {
  const token = Cookies.get("token");
  console.log(token)
  if (!token) {
    toast.error("No user found"); 
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

        if (!res.ok) throw new Error("Token validation failed");
      } catch (error) {
        console.error(error);
        toast.error("You do not have access to this page");
        router.replace("/login"); // Redirect to login if token validation fails
      }
    };

    validateToken();

  //FileSystemService.APIRequestUser().then(async (data)=>{setUser(await data.Id);});
  
});


  useEffect(() => {
    const getForm = async () => {
      const database : FileFinder = new FileFinder(pathToSrc);
      console.log(database.directoryPath);
      databaseFile = await database.findJSONFile(["database", username, project], "forms");
      let formsArray : Array<Form> = [];
      let objectsArray : Array<Object> = await FileSystemService.getJSONFile(databaseFile);
      for(let i = 0; i < objectsArray.length; i++){
        let formBuilder = new FormBuilder();
        console.dir(objectsArray[i] as Form);
        formsArray.push(formBuilder.formFromObject(objectsArray[i] as Form))
      }

      forms = new DatabaseAccess(formsArray);
      console.dir(forms);
      try {
        currForm =(forms.objects)[forms.getIndexFromDatabase(formName)] as Form;
        console.log("hee hee");
      }
      catch (e: any) {
        console.log("fuuck");
        currForm = new Form;
      }
      setForm(currForm);
      setActive(currForm.isActive);
      console.dir(form);
      console.dir(currForm);
      
    }
    getForm();

  }, [])

  const [form, setForm] = useState(currForm);
  const [active, setActive] = useState(currForm.isActive)
  const [validationErrors, setValidationErrors] = useState(errorHandler.validationErrors);
  const [modalOpen, setModalOpen] = useState(false);

  
  function updateState() : void {
    setForm(_.cloneDeep(form));
  }

  return ( active ? (
    <main>
      <div 
        className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
        <div 
          className="w-full p-6 rounded-md shadow-md lg:max-w-xl bg-white-300 shadow-2xl space-y-3">
          <h1 
            className="text-3xl font-bold text-center text-gray-700">
            Form creation
          </h1>
          <Input
          type="text"
          color="secondary" 
          label="Form name"
          value={form.getUncleanName()}
          onValueChange={(name) => {
            form.name = name;
            updateState();
          }}
        />
        {validationErrors._name && (
                <div 
                  className="error">
                  {validationErrors._name}
                </div>
              )}
          <Input
          type="text"
          color="secondary" 
          label="Form description"
          value={form.description}
          onValueChange={(description) => {
            form.description = description;
            updateState();
          }}
        />
        {validationErrors._description && (
                <div 
                  className="error">
                  {validationErrors._description}
                </div>
              )}
          <ul>
            {form.questions.map((e, index) => {return <li key={index}> {FormCreator.createQuestionBox(form, e, errorHandler, updateState)}</li>})}
          </ul>
          <label htmlFor="Qtype"/>
          <Dropdown>
            <DropdownTrigger>
              <Button className="button" variant="bordered">Question type</Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Link Actions"
              >
              <DropdownItem key="mchoice" onClick={() => {
                form.addQuestion(QuestionTypes.multipleChoice);
                updateState();
                console.dir(form);
              }}>
                Multiple choice
              </DropdownItem>
              <DropdownItem key="slider" onClick={() => {
                form.addQuestion(QuestionTypes.slider);
                updateState();
                console.dir(form);
              }}>
                Slider
              </DropdownItem>
              <DropdownItem key="input" onClick={() => {
                form.addQuestion(QuestionTypes.textInput);
                updateState();
                console.dir(form);
              }}>
                Text input
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <div className='flex flex-wrap content-evenly'>
            <Button className="bg-primary text-white" onClick={async () => {

            try {
              FormValidator.FormTemplate.parse(form);
              console.dir(forms);
              if(forms.checkDuplicate(form) && form.name != formName)
                throw(new ObjectAlreadyExistsException("Form of name " + form.name + " already exists"));
              setModalOpen(true);
            } catch(e: any) {
              if(e instanceof ObjectAlreadyExistsException)
                toast.error('A form with this name already exists in this project');
              let errorHandler = new FormErrorHandler();
              setValidationErrors(errorHandler.errorValidation(e));
            }
              console.dir(form);

            }}>Save form</Button>
            <Button className="button" onClick={async () => {
              try{
                //Uses currForm since it uses the values that were gained on page load
                //If form was used, you could accidentally name your new form the same as an existing one and delete that
                forms.removeFromDatabase(formName);
                FileSystemService.writeToJSONFile(forms.objects, databaseFile);
              }
              catch(e : any) {
                console.log("didn't delete");
              }
            }}>Delete form</Button>
          </div>
          <Modal isOpen={modalOpen}>
            <ModalContent>
              <Input color="secondary" type="number" label="How many people should answer this form?" min="0" max="1024" step="1" onValueChange={(value) => {
                tokenBuilder.setTokens(parseInt(value));
              }}/>
              <Button className="button" onClick={async () => {
                form.cleanName();
                console.dir(tokenBuilder);
                form.tokens = tokenBuilder.getTokens();
                form.isActive = false;
                setActive(false);
                //If the form already exists in the database, remove it first
                if(forms.checkDuplicate(form) && form.name == formName)
                  forms.removeFromDatabase(form.name);
                forms.addToDatabase(form);
                const database : FileFinder = new FileFinder(pathToSrc);
                //Makes directory at the project path plus the current form name
                //If directory already exists, nothing happens
                FileSystemService.makeDirectory(pathToSrc, await database.getDirectory(["database", username, project]) + "/" + form.name)
                //Overwrites the forms json file with this form added/updated
                FileSystemService.writeToJSONFile(forms.objects, databaseFile);
              }}>Publish form</Button>

              <Button className="button" onClick={async () => {
                form.cleanName();
                //If the form already exists in the database, remove it first
                if(forms.checkDuplicate(form) && form.name == formName)
                  forms.removeFromDatabase(form.name);
                forms.addToDatabase(form);
                const database : FileFinder = new FileFinder(pathToSrc);
                //Makes directory at the project path plus the current form name
                //If directory already exists, nothing happens
                FileSystemService.makeDirectory(pathToSrc, await database.getDirectory(["database", username, project]) + "/" + form.name)
                //Overwrites the forms json file with this form added/updated
                FileSystemService.writeToJSONFile(forms.objects, databaseFile);
                setModalOpen(false);
              }}>Save without publishing</Button>

              <Button className="button" onClick={() => {
                setModalOpen(false);  
              }}>Don't save</Button>

              {form.tokens.map((token, index) => {return <li key={index}>Token number {index+1}: {rootLink+"/"+username+"/"+project.replace(/-/g, "\\-").replace(/ /g, "-")+"/"+form.name+"/"+token.tokenID}</li>})}

            </ModalContent>
          </Modal>
        </div>
      </div>
    </main>)
    :
    (
      <main>
      {form.tokens.map((token, index) => {return <li key={index}>Token number {index+1}: {rootLink+"/"+username+"/"+project.replace(/-/g, "\\-").replace(/ /g, "-")+"/"+form.name+"/"+token.tokenID}</li>})}
      </main>
    )
  )
}