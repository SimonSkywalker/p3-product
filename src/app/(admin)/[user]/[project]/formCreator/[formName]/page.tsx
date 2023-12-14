'use client'

import FormValidator from "@/app/(admin)/classes/form/FormValidator";
import {Checkbox} from "@nextui-org/checkbox";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/dropdown"
import {Button} from "@nextui-org/button"
import {Input} from "@nextui-org/input"
import {RadioGroup, Radio} from "@nextui-org/radio"
import {Modal, ModalBody, ModalContent, ModalHeader} from "@nextui-org/react";
import FileSystemService from "@/app/(admin)/classes/FileSystemService";
import Form from '@/app/(admin)/classes/form/Form';
import Question from "@/app/(admin)/classes/question";
import FileFinder from '@/app/(admin)/classes/FileFinder';
import { QuestionTypes, MultipleChoice, Slider, ChoiceTypes, SliderTypes } from "@/app/(admin)/classes/question";
import { useEffect, useState} from "react";
import TokenBuilder from "@/app/(admin)/classes/form/TokenBuilder";
import DatabaseAccess from "@/app/(admin)/classes/DatabaseAccess";
import _ from 'lodash';
import FormBuilder from "@/app/(admin)/classes/form/FormBuilder";
import FormErrorHandler, { FormFormData } from "@/app/(admin)/classes/form/FormErrorHandler";
import ObjectAlreadyExistsException from "@/app/(admin)/exceptions/ObjectAlreadyExistsException";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { usePathname } from 'next/navigation'
import { z } from "zod";
import ResponseCsvMaker, { ResponseData } from "@/app/(admin)/classes/CsvMaker";
import CsvMaker from "@/app/(admin)/classes/CsvMaker";
import { TokenValidator } from "@/app/(admin)/classes/tokenClass";

//Declaring more constant objects and variables used throughout page
let tokenBuilder : TokenBuilder = new TokenBuilder();
const maxQuestions : number = 255;
let databaseFile: string;
let forms: DatabaseAccess = new DatabaseAccess([]);
let currForm = new Form;
const errorHandler = new FormErrorHandler();

class FormCreator{
  public static createOptions(question: MultipleChoice, errors : FormErrorHandler, updateState: () => void){
    errors.addOptionErrors(question.number-1, question.options.length);
    return <>
    {question.options.map((e, index) => {return <ul key={index}> 
    <div className="inline-flex">
    <Input value={e} color="secondary" className="w-5/6" variant="bordered"  onValueChange={(input) =>{
      question.renameOption(index, input);
      updateState();
    }}></Input>
    <button className={"text-3xl text-align-center pl-2 pr-20"} onClick={() => {
      question.removeOption(index);
      errors.cleanOption(question.number-1, index);
      updateState();
      }}>x</button>
      </div>
    {errors.validationErrors._questions[question.number-1]._options[index] && (
            <div 
              className="error">
              {errors.validationErrors._questions[question.number-1]._options[index]}
            </div>
          )} </ul>})}
    <Button className="button mb-5" onClick={() => {
      question.addOption();
      updateState();
    }}>Add option</Button>
    </>
  }

  public static renderSwitch(question: Question, errors : FormErrorHandler, updateState: () => void){
    switch(question.questionType){
      case QuestionTypes.slider: {
        return <><Input color="secondary" variant="bordered" value={((question as Slider).range).toString()} type="number" label="Amount of steps" min="3" max="9" step="2" onValueChange={(value) => {
          (question as Slider).range = parseInt(value);
          updateState();
        }}/>
        <RadioGroup
        label="Slider type"
        //Default value is a string equal to the name of the sliderType enum
        defaultValue={SliderTypes[(question as Slider).type]}
        onChange={(value) => {
          switch (value.target.value){
            case "agreeDisagree":{
              (question as Slider).type = SliderTypes.agreeDisagree;
              break;
            }
            case "values":{
              (question as Slider).type = SliderTypes.values;
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
        <Checkbox isSelected={(question as MultipleChoice).type == ChoiceTypes.checkbox} onValueChange={(check) => {
        (question as MultipleChoice).type = check ? ChoiceTypes.checkbox : ChoiceTypes.radio;
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
    return <><p> Question number {question.number}</p>
    <Input color="secondary" variant="bordered"  label="Question name" value={question.description} onValueChange={(value) => {
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
    <Button className="button mb-5" onClick={() => {
      form.removeQuestion(question.number-1);
      errors.cleanQuestion(question.number-1);
      updateState();
    }}>Remove question</Button>
    <div className="flex-grow border-t border-gray-400"></div>
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
const router = useRouter();

//The rootLink is the current pathname until a slash
const rootLink = window.location.hostname + (window.location.hostname == "localhost" ? (":" + window.location.port) : "");
const username : string = params.user;
const project : string = params.project.replace(/-/g," ");
const formName : string = params.formName.replace(/%20/g,"-");
const pathToSrc : string = "@";

/**
 * This useEffect checks for the user's cookies to see if they are logged in
 * If no token is found from the cookies, or if it is not validated, send a message and reroute to the login page
 */
useEffect(() => {
  const token = Cookies.get("token");
  if (!token) {
    toast.error("No user found"); 
    router.replace("/login"); // If no token is found, redirect to login page
    return;
  }
    // Validate the token by making an API call
    TokenValidator.validateToken(token).catch((error) => {
      console.error(error);
      router.replace("/login");
    });
    
  //FileSystemService.APIRequestUser().then(async (data)=>{setUser(await data.Id);});
  
},[]);


  useEffect(() => {
    const getForm = async () => {
      try {
        const database : FileFinder = new FileFinder(pathToSrc);
        databaseFile = await database.findJSONFile(["database", username, project], "forms");
        let formsArray : Array<Form> = [];
        let objectsArray : Array<Object> = await FileSystemService.getJSONFile(databaseFile);
        for(let i = 0; i < objectsArray.length; i++){
          let formBuilder = new FormBuilder();
          formsArray.push(formBuilder.formFromObject(objectsArray[i] as Form))
        }
        forms = new DatabaseAccess(formsArray);

        currForm = (forms.objects)[forms.getIndexFromDatabase(formName)] as Form;
        currForm.name = currForm.getUncleanName();
      }
      catch (e: any) {
        currForm = new Form;
        toast.error("Failed to get existing forms");
      }
      
      setForm(currForm);
      setActive(currForm.isActive);
      
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
          variant="bordered"
          label="Form name"
          value={form.name}
          onChange={(name) => {
            form.name = name.target.value;
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
          variant="bordered"
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
          <div className="flex-grow border-t border-gray-400"></div>
          <ul>
            {form.questions.map((e, index) => {return <li key={index}> {FormCreator.createQuestionBox(form, e, errorHandler, updateState)}</li>})}
          </ul>
          <label htmlFor="Qtype"/>
          <Dropdown>
            <DropdownTrigger>
              <Button className="button mb-5" variant="bordered">New Question</Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Link Actions"
              >
              <DropdownItem key="mchoice" onClick={() => {
                form.addQuestion(QuestionTypes.multipleChoice);
                updateState();
              }}>
                Multiple choice
              </DropdownItem>
              <DropdownItem key="slider" onClick={() => {
                form.addQuestion(QuestionTypes.slider);
                updateState();
              }}>
                Slider
              </DropdownItem>
              <DropdownItem key="input" onClick={() => {
                form.addQuestion(QuestionTypes.textInput);
                updateState();
              }}>
                Text input
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <div className="flex-grow border-t border-gray-400"></div>
          <div className='flex flex-wrap content-evenly'>
            <Button className="bg-primary text-white" onClick={() => {

            try {
              FormValidator.FormTemplate.parse(form);
              form.cleanName();
              if((forms.checkDuplicate(form) && form.name != formName) || form.name.trim() === "newForm")
                throw(new ObjectAlreadyExistsException("Form of name " + form.name + " already exists"));
              setModalOpen(true);
            } catch(e: any) {
              if(e instanceof ObjectAlreadyExistsException)
                toast.error('A form with this name already exists in this project');
              else if(e instanceof z.ZodError){
                e.errors.forEach((validationErr) => {
                  toast.error(validationErr.message);
                })
              } else {toast.error(e.message)}

              let errorHandler = new FormErrorHandler();
              setValidationErrors(errorHandler.errorValidation(e));
            }

            }}>Save form</Button>
            <Button className="button mb-5" onClick={async () => {
              try{
                //Uses currForm since it uses the values that were gained on page load
                //If form was used, you could accidentally name your new form the same as an existing one and delete that
                forms.removeFromDatabase(formName);
                FileSystemService.writeToJSONFile(forms.objects, databaseFile);
                toast.success("Deleted form");
                router.replace("/" + username + "/" + project.replace(/ /g, "-"));
              }
              catch(e : any) {
                toast.error("didn't delete");
              }
            }}>Delete form</Button>
            <Button onClick={()=> {router.replace("/" + username + "/" + project.replace(/ /g, "-"))}}>
              Go back to forms
            </Button>
          </div>
          <Modal isOpen={modalOpen}>
            <ModalContent>
              <ModalHeader>
                Publish form
              </ModalHeader>
              <ModalBody>
              <Input color="secondary" variant="bordered" type="number" label="How many people should answer this form?" min="0" max="1024" step="1" onValueChange={(value) => {
                tokenBuilder.setTokens(parseInt(value));
              }}/>
              <Button className="button mb-5" onClick={async () => {
                
                form.tokens = tokenBuilder.getTokens();
                form.isActive = false;
                setActive(false);
                //If the form already exists in the database, remove it first
                forms.removeFromDatabase(currForm.name);
                forms.addToDatabase(form);
                const database : FileFinder = new FileFinder(pathToSrc);
                //Makes directory at the project path plus the current form name
                //If directory already exists, nothing happens
                FileSystemService.makeDirectory(await database.getDirectory(["database", username, project]) + "/" + form.name)
                //Overwrites the forms json file with this form added/updated
                FileSystemService.writeToJSONFile(forms.objects, databaseFile);
                updateState();
              }}>Publish form</Button>

              <div className="flex-grow border-t border-gray-400"></div>

              <Button className="button mb-5" onClick={async () => {
                
                
                //Removes the form that was edited from the database
                forms.removeFromDatabase(currForm.name);
                forms.addToDatabase(form);
                const database : FileFinder = new FileFinder(pathToSrc);
                //Makes directory at the project path plus the current form name
                //If directory already exists, nothing happens
                FileSystemService.makeDirectory(await database.getDirectory(["database", username, project]) + "/" + form.name)
                //Overwrites the forms json file with this form added/updated
                FileSystemService.writeToJSONFile(forms.objects, databaseFile);
                setModalOpen(false);
                router.replace("/" + username + "/" + project.replace(/ /g, "-"))
              }}>Save without publishing</Button>

              <Button className="button mb-5" onClick={() => {
                setModalOpen(false);  
              }}>Don't save</Button>
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </main>)
    :
    (
      <main>
      {form.tokens.map((token, index) => {return <li key={index}>Token number {index+1}: {rootLink+"/"+username+"/"+project.replace(/ /g, "-")+"/"+form.name+"/"+token.tokenID}
      <br/>Answer sent: {token.isUsed ? "yes" : "no"}</li>})}
        <Button onClick={async ()=> {
          let fileFinder = new FileFinder(pathToSrc);
          let JSONobjects : Array<any> = []
          let responses : Array<ResponseData> = [];
          try{
            //Try to get an array of JSON objects form the responses.json file corresponding to this form
            let responseFile = fileFinder.findJSONFile(["database", username, project, form.name], "responses");
            JSONobjects = await FileSystemService.getJSONFile(await responseFile);
            //Convert each JSON object to a ResponseData instance into the response array
            console.dir(JSONobjects);
            JSONobjects.forEach((object) => {
              responses.push(ResponseData.responseFromObject(object));
            })
            console.dir(responses);
            //Convert the responses into an array that is then converted into a string using the CsvMaker
            CsvMaker.download("responses.csv", CsvMaker.arrayToCsv(ResponseCsvMaker.responsesToArray(responses, form)));
          }
          catch(e : any) {
            console.log(e.message);
            toast.error(e.message);
          }
        }}> Download responses</Button>
        <Button onClick={()=> {router.replace("/" + username + "/" + project.replace(/ /g, "-"))}}>
          Go back to forms
        </Button>
      </main>
    )
  )
}