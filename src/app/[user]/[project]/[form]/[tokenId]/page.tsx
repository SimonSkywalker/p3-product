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
          <FormRenderer 
            formObject={formObject} 
            params={params}
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );    
  };

  return renderPage();
}