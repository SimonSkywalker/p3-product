import { Metadata } from 'next';
import { notFound } from "next/navigation";
import dynamic from "next/dynamic"; 
import { useEffect, useState } from 'react';

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
        <h1>{/*formObject.name*/}</h1>
        <p>{/*formObject.description*/}</p>

        {formObject.questions.map((question, index) => (
          <div key={index}>
            <h2>{question.description}</h2>
            {/* Render the question based on its type and options */}
            {/* You can use conditionals to render different question types */}
            {question.questionType === 0 && (
              <div>
                <p>Multiple Choice</p>
                {/*question.options.map((option, optionIndex) => (
                  <label key={optionIndex}>
                    <input type="radio" name={`question-${index}`} value={option} />
                    {option}
                  </label>
                )*/}
              </div>
            )}
            {question.questionType === 1 && (
              <div>
                <p>Slider</p>
                <input type="range" min="0" max="10" step="1" />
              </div>
            )}
            {question.questionType === 2 && (
              <div>
                <p>Text Input</p>
                <input type="text" />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return renderPage();
}