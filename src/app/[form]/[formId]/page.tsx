import formList from '@/app/database/forms.json'
import {notFound} from "next/navigation";

// https://stackoverflow.com/questions/76650404/creating-dynamic-routes-from-local-json-file-nextjs-13
export async function generateStaticParams() {
  const formsArray = formList.forms;

  const keys = formsArray.map((formObj) => {
    return Object.keys(formObj);
  });

  // Flatten the array of arrays into a single array of keys
  const flattenedKeys = keys.flat();

  return flattenedKeys.map((key) => ({
    form: key,
  }));
}

export default function UniquePage({ params: { form } }: { params: { form: string; formId: string } }) {
  // Assuming formList is an array of objects with keys in the "forms" array
  const formsArray = formList.forms;

  // Find the form object with the specified key
  const project = formsArray.find((formObj) => {
    return Object.keys(formObj).some((key) => key === form);
  });

  if (!project) {
    notFound();
  }

  return (
    <main>
      <p>formName Here: {form}</p>
    </main>
  );
}


/*
export default function Form({
  params,
}: {
  params: { form: string; formId: string };
}) {
  return <h1>form = {params.form} & formId = {params.formId}</h1>;
}
*/