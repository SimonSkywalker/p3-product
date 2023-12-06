"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { APIHandle } from "../../../classes/handlerClass";
import { Token } from "../../../classes/tokenClass";
import Cookies from "js-cookie";
import Menu1 from "./Menu1";
import Menu2 from "./Menu2";

interface ChartParams {
  params: {
    user: string;
    project: string;
  }
}

export default function VisPage({params}:ChartParams) {
  const router = useRouter();
  const [user, setUser] = useState({Id:"", project: params.project, forms:[], selectedForm: "", roles:[], questions:[]});
  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      router.push('/');
      return;
    }

    Token.validateToken(token).catch((error) => {
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
  /*
  const handleChange =  (value: string) => {

    console.log(value)

    // Checkboxes: Toggle the selected state of the clicked option
    if (formData['roles'].includes(value)) {
      // Remove the option if it's already selected
      setFormData(formData.filter();
    } else {
      // Add the option if it's not selected
      setFormData([...formData, value]);
    }
  }  */
  let otherForms: any = []
  if (typeof user?.selectedForm != 'undefined') {
    otherForms = user?.forms.filter(function(e) { return e !== user?.selectedForm })
  }

  const listForm = user?.forms.map((form: any) => (
    <option value={form} key={form}>{form}</option>
  ));
  const listFormOp = otherForms.map((form: any) => (
    <option value={form} key={form}>{form}</option>
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
      <form action="/api/createCharts" className="space-y-5 flex flex-col justify-center text-center">
        <div>
          <h3 className="block text-sm font-semibold text-gray-800">Select form for visualization</h3>
          <select name="form" className="bg-white-300" defaultValue={'DEFAULT'} 
          onChange={handleSelect}>
            <option disabled value="DEFAULT">-- select option --</option>
            {listForm}
          </select>
        </div>
        <div>
          <h3 className="block text-sm font-semibold text-gray-800">Select other form for comparison (optional)</h3>
          <select name="otherForm" className="bg-white-300" defaultValue={'DEFAULT'}>
          <option disabled value="DEFAULT">-- select option --</option>
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
          </div>
      </form>
      </div>
    </div>
  );
}
