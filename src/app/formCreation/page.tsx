'use client'

import FormValidator from "./FormValidator";
import {Checkbox} from "@nextui-org/checkbox";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/dropdown"
import {Button} from "@nextui-org/button"
import {Input} from "@nextui-org/input"
import {RadioGroup, Radio} from "@nextui-org/radio"
import {
  Modal, 
  ModalContent} from "@nextui-org/react";
import FileSystemService from './FileSystemService';
import Token from './Token'
import Form from './form';
import Question from "./question";
import FileFinder from './FileFinder';
import { QuestionTypes, MultipleChoice, Slider, ChoiceTypes, SliderTypes } from "./question";
import { useEffect, useState} from "react";
import TokenBuilder from "./TokenBuilder";
import DatabaseAccess from "./DatabaseAccess";
import _, { update } from 'lodash';
import FormBuilder from "./FormBuilder";

let tokenBuilder : TokenBuilder = new TokenBuilder();
const maxQuestions : number = 255;
const username : string = "sinagaming69";
const project : string = "f-kult";
const formName : string = "Test-form"
const rootLink : string = "https://www.testwebsite.com"
let databaseFile: string;
let forms: DatabaseAccess;
let currForm = new Form;


class FormCreator{
  public static createOptions(question: MultipleChoice, updateState: () => void){
    return <>
    {question.options.map((e, index) => {return <ul key={index}> <Input value={e} onValueChange={(input) =>{
      (question as MultipleChoice).renameOption(index, input);
      updateState();
    }}></Input>
    <Button onClick={() => {
      (question as MultipleChoice).removeOption(question.number);
      updateState();
      }}>Remove option</Button> </ul>})}
    <Button onClick={() => {
      (question as MultipleChoice).addOption();
      updateState();
    }}>Add option</Button>
    </>
  }

  public static renderSwitch(question: Question, updateState: () => void){
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
        return <>{FormCreator.createOptions(question as MultipleChoice, updateState)}
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

  public static createQuestionBox(form: Form, question : Question, updateState: () => void) {
    return <><p> Question number {question.number}</p>
    <Input label="Question name" value={question.description} onValueChange={(value) => {
        question.description = value;
        updateState();
      }}></Input>
    <Checkbox defaultChecked={question.mandatory} onValueChange={(check) => {
        question.mandatory = check;
        updateState();
      }}>Required</Checkbox>
    <Checkbox defaultChecked={question.userDisplay} onValueChange={(check) => {
        question.userDisplay = check;
        updateState();
      }}>Show answers to respondents</Checkbox>
    {FormCreator.renderSwitch(question, updateState)}
    <Button onClick={() => {
      form.removeQuestion(question.number-1);
      updateState();
    }}>Remove question</Button>
    </>
  }
}

export default function Home() {
  console.log("goofy");


  useEffect(() => {
    const getForm = async () => {
      const database : FileFinder = new FileFinder('src/app');
      databaseFile = await database.findJSONFile(["database"], "forms");
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
      console.dir(form);
      console.dir(currForm);
      
    }
    getForm();

  }, [])

  const [form, setForm] = useState(currForm);
  const [active, setActive] = useState(currForm.isActive)
  const [validationErrors, setValidationErrors] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [tokens, setTokens] = useState(new Array<Token>);

  
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
      <Input
      type="text"
      label="Form description"
      value={form.description}
      onValueChange={(description) => {
        form.description = description;
        updateState();
      }}
    />
      <ul>
        {form.questions.map((e, index) => {return <li key={index}> {FormCreator.createQuestionBox(form, e, updateState)}</li>})}
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
          setModalOpen(true);
        } catch(e: any) {
          console.log(e.message);
          alert(e.message);
        }
          console.dir(form);

        }}>Save form</Button>
        <Button onClick={async () => {
          try{
            let forms : DatabaseAccess = new DatabaseAccess(await FileSystemService.getJSONFile(databaseFile) as Form[]);
            //Uses currForm since it uses the values that were gained on page load
            //If form was used, you could accidentally name your new form the same as an existing one and delete that
            forms.removeFromDatabase(currForm.name);
            FileSystemService.writeToJSONFile(forms.objects, databaseFile);
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
            setTokens(tokenBuilder.getTokens());
            let forms : DatabaseAccess = new DatabaseAccess(await FileSystemService.getJSONFile(databaseFile) as Form[]);
            forms.addToDatabase(form);
            FileSystemService.writeToJSONFile(forms.objects, databaseFile);
          }}>Publish form</Button>
          <Button onClick={async () => {
            let forms : DatabaseAccess = new DatabaseAccess(await FileSystemService.getJSONFile(databaseFile) as Form[]);
            forms.addToDatabase(form);
            FileSystemService.writeToJSONFile(forms.objects, databaseFile);
          }
          }>Save without publishing</Button>
          <Button onClick={() => {
            setModalOpen(false);  
          }}>Fuck go back</Button>
          {tokens.map((token, index) => {return <li key={index}>Token number {index+1}: {rootLink+"/"+username+"/"+project+"/"+form.name+"/"+token.tokenID}</li>})}
        </ModalContent>
      </Modal>
    </main>)
    :
    (
      <main>
      {tokens.map((token, index) => {return <li key={index}>Token number {index+1}: {rootLink+"/"+username+"/"+project+"/"+form.name+"/"+token.tokenID}</li>})}
      </main>
    )
  )
}