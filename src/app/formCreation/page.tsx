'use client'

import {Checkbox} from "@nextui-org/checkbox";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem} from "@nextui-org/dropdown"
import {Button} from "@nextui-org/button"
import {Input} from "@nextui-org/input"
import {RadioGroup, Radio} from "@nextui-org/radio"
import Link from 'next/link'
import FileSystemService from './FileSystemService';
import Token from './formCreation'
import Form from './form';
import Question from "./question";
import DatabaseAccess from './DatabaseAccess';
import { QuestionTypes, MultipleChoice, Slider } from "./question";
import { createElement, useState} from "react";
import { createRoot } from "react-dom/client";
import NextUIProvider from "@nextui-org/system"

let currForm : Form = new Form();

class FormCreator{
  public static updateQuestionBox(form : Form){
    for (let i in form.questions){

    }
  }

  public static createQuestionBox(questionType : QuestionTypes, questionNumber : number) {
    let questionBox : Array<any> = []

    questionBox.push(<><p> Question number {questionNumber}</p>
    <Input label="Question name" id={"questionID" + questionNumber.toString}></Input>
    <Checkbox>Required</Checkbox>
    <Checkbox>Show answers to respondents</Checkbox>
    </>)

    {switch (questionType){
      case QuestionTypes.multipleChoice: {
        questionBox.push(<><Input defaultValue="option" id={"OPTION" + questionNumber.toString + ".1"}></Input>
        <Checkbox>Allow multiple options checked</Checkbox>
        <Checkbox>Use question to determine roles</Checkbox></>);
        break;
      }
      case QuestionTypes.slider: {
        questionBox.push(<><Input type="number" label="Amount of steps" min="3" max="9" defaultValue="5" step="2"/>
        <RadioGroup
        label="Slider type">
          <Radio value="agreeDisagree">Agree/disagree</Radio>
          <Radio value="number">Number</Radio>
        </RadioGroup></>);
      break;
      }
    }}
    return questionBox;
  }

  public static addOption(optionBox : Element) {

  }

}

currForm.addQuestion(QuestionTypes.multipleChoice);


export default function Home() {
  const EmptyAnyArray : Array<any> = [];
  const [form, setForm] = useState(currForm);


  return (
    <main>
      <h1>New form</h1>
      <Input
      type="text"
      label="Form name"
      defaultValue="New form"
    />
      <Input
      type="text"
      label="Form description"
    />
      <label htmlFor="Qtype"/>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">Question type</Button>
        </DropdownTrigger>
        <DropdownMenu 
          aria-label="Link Actions"
          >
          <DropdownItem key="mchoice" onClick={async () => {
            currForm.addQuestion(QuestionTypes.multipleChoice);
            console.dir(currForm);
            setForm(currForm);
          }}>
            Multiple choice
          </DropdownItem>
          <DropdownItem key="slider" onClick={async () => {
            currForm.addQuestion(QuestionTypes.slider);
            console.dir(currForm);
            setForm(currForm);
          }}>
            Slider
          </DropdownItem>
          <DropdownItem key="input" onClick={async () => {
            currForm.addQuestion(QuestionTypes.textInput);
            console.dir(currForm);
            setForm(currForm);
          }}>
            Text input
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div className='flex flex-wrap content-evenly'>
      {currForm.questions.map((e) => {return <div key={e.number}> {FormCreator.createQuestionBox(e.questionType,e.number)}</div>})}
      </div>
    </main>
  )
}


/*
<button onClick={async () => {
  let database : DatabaseAccess = new DatabaseAccess('src/app');
  let testForm : Form = new Form();
  testForm.tokens = Token.createTokenArray(5,10);
  testForm.name = "November";
  testForm.description = "Jeg er en pølsemix";
  console.log("looking for file");
  let file : string = await database.findJSONFile(["database"], "forms");
  console.log("file found " + file);
  let forms : Array<Object> = await FileSystemService.getJSONFile(file);
  console.log("file extracted");
  console.dir(forms);
  testForm.addToDatabase(forms);
  console.log("added to database");
  console.log(forms);
  FileSystemService.writeToJSONFile(forms, file);
  console.log("wrote to file");
}}>Form test</button>;
*/