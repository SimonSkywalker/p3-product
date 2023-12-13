"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { APIHandle } from "@/app/(admin)/classes/handlerClass";
import { TokenValidator } from "@/app/(admin)/classes/tokenClass";
import Cookies from "js-cookie";
import Menu1 from "./Menu1";
import Menu2 from "./Menu2";
import { toast } from "react-toastify";

interface ChartParams {
  params: {
    user: string;
    project: string;
  }
}

export default function VisPage({params}:ChartParams) {
  
  const router = useRouter();
  const [user, setUser] = useState({Id:"", project: params.project, forms:[], selectedForm: "", roles:[], questions:[]});
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      router.push('/');
      return;
    }

    TokenValidator.validateToken(token).catch((error) => {
      console.error(error);
      router.replace("/login");
    });
    
    Cookies.set('userID', params.user);
    Cookies.set('projectName', params.project);
    if(Cookies.get('otherForm')){
    Cookies.remove("otherForm")}
    APIHandle.APIRequestUser(user.project)
      .then(async(data) => {
        if (data) {
          setUser(await data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [router]);

  const handleSelect =  (e: React.ChangeEvent<HTMLSelectElement>) => {
    
    fetch("/api/getFormdata", {
        method: "POST",
        body: JSON.stringify({selectedForm: e.target.value})
    }) 
    .then((response) => response.json())
    .then((data) => {
      console.log(data.formdata.selectedForm);
      
        setUser({
          ...user,
          selectedForm: data.formdata.selectedForm,
          roles: data.formdata.roles,
          questions: data.formdata.questions
        })
        console.log(data.mResponse)
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
        
  }
  const validateForm = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const checkboxes = document.querySelectorAll<HTMLInputElement>('.checkboxContainer input[type="checkbox"]');
    const isChecked = Array.from(checkboxes).some((checkbox) => checkbox.checked);
    const checkboxes2 = document.querySelectorAll<HTMLInputElement>('.checkboxContainer2 input[type="checkbox"]');
    const isChecked2 = Array.from(checkboxes2).some((checkbox) => checkbox.checked);
    const select = document.getElementById('formSelector') as HTMLSelectElement;
    console.log(select.value);
    

    if (!isChecked || !isChecked2) {
      setErrorMessage('Please select at least one checkbox for both Roles & Questions.');
    } else {
      setErrorMessage('');
      event.currentTarget.submit();
      // Perform other actions or submit the form
    }
  };
  let otherForms: any = []
  if (typeof user?.selectedForm != 'undefined') {
    otherForms = user?.forms.filter(function(e) { return e !== user?.selectedForm })
    
  }

  const listForm = user?.forms.map((form: any) => (
    <option value={form.replace(/(?<!\\)-/g," ").replace(/\\-/g,"-")} key={form}>{form.replace(/(?<!\\)-/g," ").replace(/\\-/g,"-")}</option>
  ));
  const listFormOp = otherForms.map((form: any) => (
    <option value={form.replace(/(?<!\\)-/g," ").replace(/\\-/g,"-")} key={form}>{form.replace(/(?<!\\)-/g," ").replace(/\\-/g,"-")}</option>
  ));
  const listRoles = user?.roles?.map((role: any, i: number) => (
      <div key={i}>
        <input type="checkbox" id={`roles-${i}`} name="rolePicks" value={role}/>
        <label htmlFor={`roles-${i}`}> {role} </label>
      </div>
    ));
    const listQuestions = user?.questions?.map((question: any, i: number) => (
      <div key={i}>
        <input type="checkbox" id={`questions-${i}`} name="questionPicks" value={i} />
        <label htmlFor={`questions-${i}`}> Question {i+1}: {question._description} </label>
      </div>
    ));

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="formDefault">
      <form onSubmit={validateForm} action="/api/createCharts" method="GET" className="space-y-5 flex flex-col justify-center text-center">
        <div>
          <h3 className="block text-sm font-semibold text-gray-800">Select form for visualization</h3>
          <select id="formSelector"name="form" className="bg-white-300" defaultValue={"DEFAULT"}
          onChange={handleSelect}>
            <option  value="DEFAULT" disabled hidden>-- select option --</option>
            {listForm}
          </select>
        </div>
        <div>
          <h3 className="block text-sm font-semibold text-gray-800">Select other form for comparison (optional)</h3>
          <select name="otherForm" className="bg-white-300" defaultValue={'DEFAULT'}>
          <option disabled hidden value="DEFAULT">-- select option --</option>
            {listFormOp}
          </select>
        </div>
          <Menu1
          roles={listRoles}
          />
          <Menu2
          questions={listQuestions}
          />
          <div className="mt-2">
            <button 
              type="submit" 
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 hover:scale-105" 
              title="submitButton">
              Submit
            </button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          </div>
      </form>
      </div>
    </div>
  );
}
