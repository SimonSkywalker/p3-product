'use client'

import FormValidator from "../../../../formCreation/FormValidator";
import {Checkbox} from "@nextui-org/checkbox";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/dropdown"
import {Button} from "@nextui-org/button"
import {Input} from "@nextui-org/input"
import {RadioGroup, Radio} from "@nextui-org/radio"
import {
  Modal, 
  ModalContent} from "@nextui-org/react";
import FileSystemService from '../../../../formCreation/FileSystemService';
import Token from '../../../../formCreation/Token'
import Form from '../../../../formCreation/form';
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

let tokenBuilder : TokenBuilder = new TokenBuilder();
const maxQuestions : number = 255;
const rootLink : string = "https://www.testwebsite.com"
let databaseFile: string;
let forms: DatabaseAccess;
let currForm = new Form;


class FormCreator{
  public static createOptions(question: MultipleChoice, errors : FormFormData, updateState: () => void){
    return <>
    {question.options.map((e, index) => {return <ul key={index}> <Input value={e} onValueChange={(input) =>{
      (question as MultipleChoice).renameOption(index, input);
      updateState();
    }}></Input>
    {errors._questions[question.number-1]._options[index] && (
            <div 
              className="error">
              {errors._questions[question.number-1]._options[index]}
            </div>
          )}
    <Button onClick={() => {
      (question as MultipleChoice).removeOption(index);
      updateState();
      }}>Remove option</Button> </ul>})}
    <Button onClick={() => {
      (question as MultipleChoice).addOption();
      updateState();
    }}>Add option</Button>
    </>
  }

  public static renderSwitch(question: Question, errors : FormFormData, updateState: () => void){
    switch(question.questionType){
      case QuestionTypes.slider: {
        return <><Input value={((question as Slider).range).toString()} type="number" label="Amount of steps" min="3" max="9" step="2" onValueChange={(value) => {
          (question as Slider).range = parseInt(value);
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
        return <>{FormCreator.createOptions(question as MultipleChoice, errors, updateState)}
        <Checkbox defaultChecked={(question as MultipleChoice).choiceType == ChoiceTypes.checkbox} onValueChange={(check) => {
        (question as MultipleChoice).choiceType = check ? ChoiceTypes.checkbox : ChoiceTypes.radio;
        updateState();
      }}>Allow multiple options checked</Checkbox>
        <Checkbox defaultChecked={(question as MultipleChoice).saveRole} onValueChange={(check) => {
        (question as MultipleChoice).saveRole = check;
        updateState();
      }}>Use question to determine roles</Checkbox></>
      }
      case QuestionTypes.textInput: {
        return <></>
      }
    }
  }

  public static createQuestionBox(form: Form, question : Question, errors: FormFormData, updateState: () => void) {
    return <><p> Question number {question.number}</p>
    <Input label="Question name" value={question.description} onValueChange={(value) => {
        question.description = value;
        updateState();
      }}></Input>
      {errors._questions[question.number-1]._description && (
            <div 
              className="error">
              {errors._questions[question.number-1]._description}
            </div>
          )}
    <Checkbox defaultChecked={question.mandatory} onValueChange={(check) => {
        question.mandatory = check;
        updateState();
      }}>Required</Checkbox>
    <Checkbox defaultChecked={question.userDisplay} onValueChange={(check) => {
        question.userDisplay = check;
        updateState();
      }}>Show answers to respondents</Checkbox>
    {FormCreator.renderSwitch(question, errors, updateState)}
    <Button onClick={() => {
      form.removeQuestion(question.number-1);
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

const username : string = params.user;
const project : string = params.project;
const formName : string = params.formName;
const pathToSrc : string = "../../../..";


  useEffect(() => {
    const getForm = async () => {
      const database : FileFinder = new FileFinder(pathToSrc);
      console.log(database.directoryPath);
      databaseFile = await database.findJSONFile(["database", username, project], "forms");
      let formsArray : Array<Form> = [];
      let objectsArray : Array<Object> = await FileSystemService.getJSONFile(database.directoryPath, databaseFile);
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
  const [validationErrors, setValidationErrors] = useState(new FormErrorHandler().validationErrors);
  const [modalOpen, setModalOpen] = useState(false);

  
  function updateState() : void {
    setForm(_.cloneDeep(form));
  }

  return ( active ? (
    <main>
      <h1>Form creator</h1>
      <Input
      type="text"
      label="Form name"
      value={form.getUncleanName()}
      onValueChange={(name) => {
        form.name = name;
        form.cleanName();
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
        {form.questions.map((e, index) => {return <li key={index}> {FormCreator.createQuestionBox(form, e, validationErrors, updateState)}</li>})}
      </ul>
      <label htmlFor="Qtype"/>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">Question type</Button>
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
        <Button onClick={async () => {

        try {
          FormValidator.FormTemplate.parse(form);
          if(forms.checkDuplicate(form) && form.name != currForm.name)
            throw(new ObjectAlreadyExistsException("Form of name " + form.name + " already exists"));
          setModalOpen(true);
        } catch(e: any) {
          if(e instanceof ObjectAlreadyExistsException)
            alert(e.message);
          let errorHandler = new FormErrorHandler();
          setValidationErrors(errorHandler.errorValidation(e));
        }
          console.dir(form);

        }}>Save form</Button>
        <Button onClick={async () => {
          try{
            //Uses currForm since it uses the values that were gained on page load
            //If form was used, you could accidentally name your new form the same as an existing one and delete that
            forms.removeFromDatabase(currForm.name);
            FileSystemService.writeToJSONFile(pathToSrc, forms.objects, databaseFile);
          }
          catch(e : any) {
            console.log("didn't delete");
          }
        }}>Delete form</Button>
      </div>
      <Modal isOpen={modalOpen}>
        <ModalContent>
          <Input type="number" label="How many people should answer this form?" min="1" max="1024" step="1" onValueChange={(value) => {
            tokenBuilder.setTokens(parseInt(value));
          }}/>
          <Button onClick={async () => {
            console.dir(tokenBuilder);
            form.tokens = tokenBuilder.getTokens();
            form.isActive = false;
            setActive(false);
            //If the form already exists in the database, remove it first
            if(forms.checkDuplicate(form) && form.name == currForm.name)
              forms.removeFromDatabase(form.name);
            forms.addToDatabase(form);
            FileSystemService.writeToJSONFile(pathToSrc, forms.objects, databaseFile);
          }}>Publish form</Button>
          <Button onClick={async () => {
            //If the form already exists in the database, remove it first
            if(forms.checkDuplicate(form) && form.name == currForm.name)
              forms.removeFromDatabase(form.name);
            forms.addToDatabase(form);
            FileSystemService.writeToJSONFile(pathToSrc, forms.objects, databaseFile);
          }
          }>Save without publishing</Button>
          <Button onClick={() => {
            setModalOpen(false);  
          }}>Fuck go back</Button>
          {form.tokens.map((token, index) => {return <li key={index}>Token number {index+1}: {rootLink+"/"+username+"/"+project+"/"+form.name+"/"+token.tokenID}</li>})}
        </ModalContent>
      </Modal>
    </main>)
    :
    (
      <main>
      {form.tokens.map((token, index) => {return <li key={index}>Token number {index+1}: {rootLink+"/"+username+"/"+project+"/"+form.name+"/"+token.tokenID}</li>})}
      </main>
    )
  )
}