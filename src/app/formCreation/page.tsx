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
import _ from 'lodash';

let tokenBuilder : TokenBuilder = new TokenBuilder();
const maxQuestions : number = 255;
const username : string = "sinagaming69";
const project : string = "f-kult";
const formName : string = "bedste-film-2022"
const rootLink : string = "https://www.testwebsite.com"
let databaseFile: string;
let forms: DatabaseAccess<Form>;
let currForm = new Form;


class FormCreator{
  public static createOptions(question: MultipleChoice, updateState: () => void){
    return <>
    {question.options.map((e, index) => {return <ul key={index}> <Input defaultValue={e} onValueChange={(input) =>{
      question.renameOption(index, input);
      updateState();
    }}></Input> </ul>})}
    <Button onClick={() => {
      question.removeOption(question.options.length-1);
      updateState();
      }}>Remove option</Button>
    <Button onClick={() => {
      question.addOption();
      updateState();
    }}>Add option</Button>
    </>
  }

  public static renderSwitch(question: Question, updateState: () => void){
    switch(question.questionType){
      case QuestionTypes.slider: {
        return <><Input defaultValue={((question as Slider).range).toString()} type="number" label="Amount of steps" min="3" max="9" step="2" onValueChange={(value) => {
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

  public static createQuestionBox(question : Question, updateState: () => void) {
    return <><p> Question number {question.number}</p>
    <Input label="Question name" defaultValue={question.description} onValueChange={(value) => {
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
      currForm.removeQuestion(question.number-1);
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
      forms = new DatabaseAccess(await FileSystemService.getJSONFile(await databaseFile) as Form[])

      try {
        console.log("hee hee");
        currForm =(forms).objects[(forms).getIndexFromDatabase(formName)] as Form;
      }
      catch (e: any) {
        console.log("fuuck");
        currForm = new Form;
      }
      
    }
    getForm();

  }, [])

  const [questions, setQuestions] = useState(currForm.questions);
  const [active, setActive] = useState(currForm.isActive)
  const [count, setCount] = useState(0);
  const [validationErrors, setValidationErrors] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [tokens, setTokens] = useState(new Array<Token>);
  const [form, setForm] = useState(currForm);



  
  function updateState() : void {
    setForm(_.cloneDeep(currForm));
  }

  return ( active ? (
    <main>
      <h1>Form creator</h1>
      <Input
      type="text"
      label="Form name"
      defaultValue={currForm.getUncleanName()}
      onValueChange={(name) => {
        currForm.name = name;
        currForm.cleanName();
        updateState();
      }}
    />
      <Input
      type="text"
      label="Form description"
      defaultValue={currForm.description}
      onValueChange={(description) => {
        currForm.description = description;
        updateState();
      }}
    />
      <ul>
        {questions.map((e, index) => {return <li key={index}> {FormCreator.createQuestionBox(e, updateState)}</li>})}
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
            currForm.addQuestion(QuestionTypes.multipleChoice);
            setQuestions(currForm.questions);
            setCount(count+1);
            console.dir(currForm);
          }}>
            Multiple choice
          </DropdownItem>
          <DropdownItem key="slider" onClick={() => {
            currForm.addQuestion(QuestionTypes.slider);
            setQuestions(currForm.questions);
            setCount(count+1);
            console.dir(currForm);
          }}>
            Slider
          </DropdownItem>
          <DropdownItem key="input" onClick={() => {
            currForm.addQuestion(QuestionTypes.textInput);
            setQuestions(currForm.questions);
            setCount(count+1);
            console.dir(currForm);
          }}>
            Text input
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div className='flex flex-wrap content-evenly'>
        <Button onClick={async () => {

        try {
          FormValidator.FormTemplate.parse(currForm);
          setModalOpen(true);
        } catch(e: any) {
          console.log(e.message);
          alert(e.message);
        }
          console.dir(currForm);

        }}>Save form</Button>
      </div>
      <Modal isOpen={modalOpen}>
        <ModalContent>
          <Input type="number" label="How many people should answer this form?" min="1" max="1024" step="1" onValueChange={(value) => {
            tokenBuilder.setTokens(parseInt(value));
          }}/>
          <Button onClick={async () => {
            console.dir(tokenBuilder);
            currForm.tokens = tokenBuilder.getTokens();
            currForm.isActive = false;
            setActive(false);
            setTokens(tokenBuilder.getTokens());
            let forms : DatabaseAccess<Form> = new DatabaseAccess(await FileSystemService.getJSONFile(await databaseFile) as Form[]);
            forms.addToDatabase(currForm);
            FileSystemService.writeToJSONFile(forms.objects, databaseFile);
          }}>Publish form</Button>
          <Button onClick={async () => {
            let forms : DatabaseAccess<Form> = new DatabaseAccess(await FileSystemService.getJSONFile(await databaseFile) as Form[]);
            forms.addToDatabase(currForm);
            FileSystemService.writeToJSONFile(forms.objects, databaseFile);
          }
          }>Save without publishing</Button>
          <Button onClick={() => {
            setModalOpen(false);  
          }}>Fuck go back</Button>
          {tokens.map((token, index) => {return <li key={index}>Token number {index+1}: {rootLink+"/"+username+"/"+project+"/"+currForm.name+"/"+token.tokenID}</li>})}
        </ModalContent>
      </Modal>
    </main>)
    :
    (
      <main>
      {tokens.map((token, index) => {return <li key={index}>Token number {index+1}: {rootLink+"/"+username+"/"+project+"/"+currForm.name+"/"+token.tokenID}</li>})}
      </main>
    )
  )
}