'use client'

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Button, Input } from "@nextui-org/react";
import Link from 'next/link'
import FileSystemService from './FileSystemService';
import Token from './formCreation'
import Form from './form';
import Question from "./question";
import DatabaseAccess from './DatabaseAccess';
import { QuestionTypes, MultipleChoice, Slider } from "./question";
import { createElement } from "react";

let currForm : Form = new Form();


class FormCreator{
  public static updateQuestionBox(form : Form){
    for (let i in form.questions){

    }
  }

  public static createQuestionBox(questionType : QuestionTypes, questionNumber : number) : Element {
    let questionBox = <><p> Question number {questionNumber}</p>
    <Input label="Question name" id="questionID"></Input></>
    return questionBox;
  }
}



export default function Home() {
  return (
    <main>
      <h1>New form</h1>
      <Input
      type="text"
      label="fname"
      defaultValue="New form"
    />
      <Input
      type="text"
      label="fdescription"
    />
      <label htmlFor="Qtype"/>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">Question type</Button>
        </DropdownTrigger>
        <DropdownMenu 
          aria-label="Link Actions"
          onAction={() => {FormCreator.updateQuestionBox}}
        >
          <DropdownItem key="mchoice" onClick={async () => {
            currForm.addQuestion(QuestionTypes.multipleChoice);
            console.dir(currForm);
          }}>
            Multiple choice
          </DropdownItem>
          <DropdownItem key="slider" onClick={async () => {
            currForm.addQuestion(QuestionTypes.slider);
          }}>
            Slider
          </DropdownItem>
          <DropdownItem key="input" onClick={async () => {
            currForm.addQuestion(QuestionTypes.textInput);
          }}>
            Text input
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div className='flex flex-wrap content-evenly'>
      </div>
      {FormCreator.createQuestionBox(QuestionTypes.multipleChoice, 1)};
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