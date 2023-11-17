'use client'

import FormValidator from "./FormValidator";
import {Checkbox} from "@nextui-org/checkbox";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem} from "@nextui-org/dropdown"
import {Button} from "@nextui-org/button"
import {Input} from "@nextui-org/input"
import {RadioGroup, Radio} from "@nextui-org/radio"
import {
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter
} from "@nextui-org/react";
import Link from 'next/link'
import FileSystemService from './FileSystemService';
import Token from './Token'
import Form from './form';
import Question from "./question";
import DatabaseAccess from './DatabaseAccess';
import { QuestionTypes, MultipleChoice, Slider, ChoiceTypes, SliderTypes } from "./question";
import { createElement, useEffect, useState} from "react";
import { createRoot } from "react-dom/client";
import NextUIProvider from "@nextui-org/system"
import { createConnection } from "net";
import { describe } from "node:test";
import { modal } from "@nextui-org/react";
import TokenBuilder from "./TokenBuilder";

let currForm : Form = new Form();
let tokenBuilder : TokenBuilder = new TokenBuilder();
const maxQuestions : number = 255;
const username : string = "sinagaming69";
const project : string = "f-kult";
const rootLink : string = "https://www.testwebsite.com"

class FormCreator{
  public static updateQuestionBox(form : Form){
    for (let i in form.questions){

    }
  }
  public static createOptions(question: MultipleChoice, updateState: () => void){
    return <>
    {question.options.map((e, index) => {return <ul key={index}> <Input defaultValue={e} onValueChange={(input) =>{
      question.renameOption(index, input);
      updateState();
    }}></Input> </ul>})}
    <Button onClick={() => {
      question.addOption();
      updateState();
      <Button onClick={() => {
        question.removeOption(question.options.length-1);
        updateState();
        }}> Remove option</Button>
    }}>Add option</Button>
    </>
  }

  public static renderSwitch(question: Question, updateState: () => void){
    switch(question.questionType){
      case QuestionTypes.slider: {
        return <><Input type="number" label="Amount of steps" min="3" max="9" step="2" onValueChange={(value) => {
          (question as Slider).range = parseInt(value);
        }}/>
        <RadioGroup
        label="Slider type"
        onValueChange={(value) => {
          switch (value){
            case "agreeDisagree":{
              (question as Slider).sliderType = SliderTypes.agreeDisagree;
              break;
            }
            case "number":{
              (question as Slider).sliderType = SliderTypes.values;
              break;
            }
          }
        }}>
          <Radio value="agreeDisagree" >Agree/disagree</Radio>
          <Radio value="number">Number</Radio>
        </RadioGroup></>
      }
      case QuestionTypes.multipleChoice: {
        return <>{FormCreator.createOptions(question as MultipleChoice, updateState)}
        <Checkbox onValueChange={(check) => {
        (question as MultipleChoice).choiceType = check ? ChoiceTypes.checkbox : ChoiceTypes.radio;
        updateState();
      }}>Allow multiple options checked</Checkbox>
        <Checkbox onValueChange={(check) => {
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
    <Input label="Question name" id={"questionID" + question.number.toString} onValueChange={(value) => {
        question.description = value;
        updateState();
      }}></Input>
    <Checkbox onValueChange={(check) => {
        question.mandatory = check;
        updateState();
      }}>Required</Checkbox>
    <Checkbox onValueChange={(check) => {
        question.userDisplay = check;
        updateState();
      }}>Show answers to respondents</Checkbox>
    {FormCreator.renderSwitch(question, updateState)}
    </>
  }

}

export default function Home() {
  const [questions, setQuestions] = useState(currForm.questions);
  const [active, setActive] = useState(currForm)
  const [count, setCount] = useState(0);
  const [validationErrors, setValidationErrors] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [tokens, setTokens] = useState(new Array<Token>);

  
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
      onValueChange={(name) => {
        currForm.name = name;
        updateState();
      }}
    />
      <Input
      type="text"
      label="Form description"
      onValueChange={(description) => {
        currForm.description = description;
        updateState();
      }}
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
            setQuestions(currForm.questions);
            setCount(count+1);
          }}>
            Multiple choice
          </DropdownItem>
          <DropdownItem key="slider" onClick={() => {
            currForm.addQuestion(QuestionTypes.slider);
            setQuestions(currForm.questions);
            setCount(count+1);
          }}>
            Slider
          </DropdownItem>
          <DropdownItem key="input" onClick={() => {
            currForm.addQuestion(QuestionTypes.textInput);
            setQuestions(currForm.questions);
            setCount(count+1);
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

        try {
          FormValidator.FormTemplate.parse(currForm);
          setModalOpen(true);
        } catch(e: any) {
          console.log(e.message);
          alert(e.message);
        }

          
          let database : DatabaseAccess = new DatabaseAccess('src/app');
          let file : string = await database.findJSONFile(["database"], "forms");
          let forms : Array<Object> = await FileSystemService.getJSONFile(file);
          currForm.addToDatabase(forms);
          FileSystemService.writeToJSONFile(forms, file);
          console.log(currForm);

        }}>SUMBIT form</Button>
      </div>
      <Modal isOpen={modalOpen}>
        <ModalContent>
          <Input type="number" label="How many people should answer this form?" min="1" max="1024" step="1" onValueChange={(value) => {
            tokenBuilder.setTokens(parseInt(value));
          }}/>
          <Button onClick={() => {
            console.dir(tokenBuilder);
            setTokens(tokenBuilder.getTokens());
          }}>Publish form</Button>

          <Button>Save without publishing</Button>
          <Button onClick={() => {
              setModalOpen(false);
          }}>Fuck go back</Button>
          {tokens.map((token, index) => {return <li key={index}>Token number {index+1}: {rootLink+"/"+username+"/"+project+"/"+token.tokenID}</li>})}
        </ModalContent>
      </Modal>
    </main>
  )
}