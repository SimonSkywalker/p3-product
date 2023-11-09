'use client'

import Link from 'next/link'
import FileSystemService from './FileSystemService';
import Token from './formCreation'
import Form from './form';
import DatabaseAccess from './DatabaseAccess';

export default function Home() {
  return (
    <main>
      <h1>New form</h1>
      <label htmlFor="fname">Form name: </label>
      <input name="fname"/>
      <label htmlFor="fname">Form description: </label>
      <input name="fname"/>
      
      <div className='flex flex-wrap content-evenly'>
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