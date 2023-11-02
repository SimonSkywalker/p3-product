export default function Form({
  params,
}: {
  params: { form: string; formId: string };
}) {
  return <h1>form = {params.form} & formId = {params.formId}</h1>;
}