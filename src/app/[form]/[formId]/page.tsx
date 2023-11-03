import formList from '@/app/database/forms.json'
import {notFound} from "next/navigation";

// Define the type/structure for the JSON data
type FormData = {
  [key: string]: {
    tokens: {
      [tokenId: string]: {
        isUsed: number;
      };
    }[];
  };
};

// https://stackoverflow.com/questions/76650404/creating-dynamic-routes-from-local-json-file-nextjs-13
export default function formPage({ params }: { params: { form: string; formId: string } }) {
  // We assuming formList is an object of type FormData
  const formsObject: FormData = formList.forms[0];

  // Find the form object with the specified key
  const formObject = formsObject[params.form];

  if (!formObject) {
    notFound();
  }

  // Check if the specified "tokenId" (based on formId) exists in the formObject
  const tokenIdExists = formObject.tokens.find(token => token[params.formId]);

  if (!tokenIdExists) {
    notFound();
  }

  return (
    <main>
      <p>formName Here: {params.form}</p>
      <p>tokenId Here: {params.formId}</p>
    </main>
  );
}