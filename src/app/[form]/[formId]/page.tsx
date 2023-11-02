export default function ProductDetail({
  params,
}: {
  params: { form: string; formId: string };
}) {
  return <h1>form = {params.form} & formId = {params.formId}</h1>;
}