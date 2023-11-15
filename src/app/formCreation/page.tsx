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
import { createElement, useEffect, useState} from "react";
import { createRoot } from "react-dom/client";
import NextUIProvider from "@nextui-org/system"
import { createConnection } from "net";

let currForm : Form = new Form();
const maxQuestions : number = 255;

class FormCreator{
  public static updateQuestionBox(form : Form){
    for (let i in form.questions){

    }
  }
  public static createOptions(question: MultipleChoice, updateState: () => void){
    return <>
    {question.options.map((e, index) => {return <ul key={index}> <Input defaultValue={e} onValueChange={(input) =>
      question.renameOption(index, input)
    }></Input> 
    <Button onClick={() => {
      question.removeOption(index); 
      updateState();
      }}> Remove option</Button></ul>})}
    <Button onClick={() => {
      question.addOption();
      updateState();
    }}>Add option</Button>
    </>
  }

  public static renderSwitch(question: Question, updateState: () => void){
    console.log("Question type" + question.questionType);
    switch(question.questionType){
      case QuestionTypes.slider: {
        console.log("Slider");
        return <><Input type="number" label="Amount of steps" min="3" max="9" defaultValue="5" step="2"/>
        <RadioGroup
        label="Slider type">
          <Radio value="agreeDisagree">Agree/disagree</Radio>
          <Radio value="number">Number</Radio>
        </RadioGroup></>
      }
      case QuestionTypes.multipleChoice: {
        console.log("Multiple choice2");
        return <>{FormCreator.createOptions(question as MultipleChoice, updateState)}
        <Checkbox>Allow multiple options checked</Checkbox>
        <Checkbox>Use question to determine roles</Checkbox></>
      }
      case QuestionTypes.textInput: {
        return <></>
      }
    }
  }

  public static createQuestionBox(question : Question, updateState: () => void) {
    console.log("Question type" + question.questionType);
    return <><p> Question number {question.number}</p>
    <Input label="Question name" id={"questionID" + question.number.toString}></Input>
    <Checkbox>Required</Checkbox>
    <Checkbox>Show answers to respondents</Checkbox>
    {FormCreator.renderSwitch(question, updateState)};
    </>
  }

  public static addOption(optionBox : Element) {

  }

}

export default function Home() {
  const qArray = new Array<number>(maxQuestions);
  const [questions, setQuestions] = useState(currForm.questions);
  const [count, setCount] = useState(0);

  
  function updateState() : void {
    setCount(count + 1);
  }

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
          <DropdownItem key="mchoice" onClick={() => {
            currForm.addQuestion(QuestionTypes.multipleChoice);
            console.log("Multiple choice");
            console.dir(currForm);
            setQuestions(currForm.questions);
            setCount(count+1);
            console.dir(questions);
          }}>
            Multiple choice
          </DropdownItem>
          <DropdownItem key="slider" onClick={() => {
            currForm.addQuestion(QuestionTypes.slider);
            console.dir(currForm);
            setQuestions(currForm.questions);
            setCount(count+1);
            console.dir(questions);
          }}>
            Slider
          </DropdownItem>
          <DropdownItem key="input" onClick={() => {
            currForm.addQuestion(QuestionTypes.textInput);
            console.dir(currForm);
            setQuestions(currForm.questions);
            setCount(count+1);
            console.dir(questions);
          }}>
            Text input
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div className='flex flex-wrap content-evenly'>
        <ul>
          {questions.map((e, index) => {return <li key={index}> {FormCreator.createQuestionBox(e, updateState)}</li>})}
        </ul>
        <Button onClick={async () => {
          /*
          let database : DatabaseAccess = new DatabaseAccess('src/app');
          let testForm : Form = new Form();
          currForm.tokens = Token.createTokenArray(5,10);
          currForm.name = "test";
          currForm.description = "test";
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
          */
        }}>SUMBIT form</Button>
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