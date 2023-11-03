import { Metadata } from 'next'

import formList from '@/app/database/forms.json';
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: { 
  params: { form: string; formId: string } 
}): Promise<Metadata> { 
  return { 
      title: params.form, 
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
export default function formPage({ params }: { params: { form: string; formId: string } }) {
  // Assuming formList is an object of type FormData
  const formData: FormData = formList;

  // Find the form object with the specified key
  const formObject = formData.forms.find((form) => form.name === params.form);

  if (!formObject) {
    notFound();
  }

  // Check if the specified "tokenId" (based on formId) exists in the formObject
  const tokenIdExists = formObject.tokens.find((token) => token[params.formId]);

  if (!tokenIdExists) {
    notFound();
  }

  return (
    <main>
      <p>formName Here: {formObject.name}</p>
      <p>formDescription: {formObject.description}</p>
      <p>tokenId Here: {params.formId}</p>
    </main>
  );
}