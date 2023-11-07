import { Metadata } from 'next';
import { notFound } from "next/navigation";
import dynamic from "next/dynamic"; 
import React, { lazy, Suspense, useState, useEffect } from 'react';
import FormRenderer from './FormRenderer';

//import formList from '@/app/database/forms.json';
//import userList from '@/app/database/userLogins.json';

export async function generateMetadata({
  params,
}: { 
  params: { user: string; project: string; form: string; tokenId: string } 
}): Promise<Metadata> { 
  return { 
      title: params.form + ' | Project management survey tool (working title)', 
  } 
}

// Define the type for your JSON data
type FormData = {
  forms: {
    name: string;
    description: string;
    questions: any[]; // You can define the type for your questions
    tokens: {
      [tokenId: string]: {
        isUsed: number;
      };
    }[];
  }[];
};

// https://stackoverflow.com/questions/76650404/creating-dynamic-routes-from-local-json-file-nextjs-13
export default function FormPage({ params }: { params: { user: string; project: string; form: string; tokenId: string } }) {
  const loadUserProjectData = async () => {
    try {
      // Dynamic import of the JSON file based on the project name
      const dataModule = await import(`@/app/database/${params.user}/projects.json`);
      return dataModule.default;
    } catch (error) {
      console.error("Error loading JSON data:", error);
      return null;
    }
  };

  const loadUserFormData = async () => {
    try {
      // Dynamic import of the forms JSON file based on the user and project names
      const dataModule = await import(`@/app/database/${params.user}/${params.project}/forms.json`);
      return dataModule.default;
    } catch (error) {
      console.error("Error loading forms JSON data:", error);
      return null;
    }
  };

  const renderPage = async () => {
    const userProjectData = await loadUserProjectData();
    const userFormData = await loadUserFormData();

    if (!userProjectData || !userFormData) {
      notFound();
      return null;
    }

    // Assuming formList is an object of type FormData
    const formData: FormData = userFormData;

    // Find the form object with the specified key
    const formObject = formData.forms.find((form) => form.name === params.form);

    if (!formObject) {
      notFound();
      return null;
    }

    // Check if the specified "tokenId" exists in the formObject
    const tokenIdExists = formObject.tokens.find((token) => token[params.tokenId]);

    if (!tokenIdExists) {
      notFound();
      return null;
    }

    // Render the form's questions here
    return (
      <div>
        {formObject ? (
          <FormRenderer formObject={formObject} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );    
  };

  return renderPage();
}



/*
<form>
  {formObject.questions.map((question, index) => (
  <div className="mb-4" key={index}>
    <h2 className="block text-gray-700 font-medium mb-2">
      {question.description}{question.mandatory && <span style={{ color: 'red' }}>*</span>} 
    </h2>
    {question.questionType === 0 && (
      <div>
        <p>Multiple Choice</p>
        {question.options.map((option, optionIndex) => (
          <label key={optionIndex}>
            <input type="radio" name={`question-${index}`} value={option} />
            {option}
          </label>
        )}
        </div>
        )}
        {question.questionType === 1 && (
          <div className="flex flex-col space-y-2 w-full">
              <input type="range" className="w-full" min="1" max={question.range} step="1"/>
              <ul className="flex justify-between w-full px-[10px]">
                  <li className="flex justify-center relative"><span className="absolute">1<br></br>Strongly disagree</span></li>
                  <li className="flex justify-center relative"><span className="absolute">2<br></br>Disagree</span></li>
                  <li className="flex justify-center relative"><span className="absolute">3<br></br>Neutral</span></li>
                  <li className="flex justify-center relative"><span className="absolute">4<br></br>Agree</span></li>
                  <li className="flex justify-center relative"><span className="absolute">5<br></br>Strongly agree</span></li>
              </ul>
          </div>
        )}
        {question.questionType === 2 && (
          <div>
            <input className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400" type="text" />
          </div>
        )}
      </div>
    ))}
  </form>
*/