"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { APIHandle } from "../classes/handlerClass";
import { Token } from "../classes/tokenClass";
import Cookies from "js-cookie";
import Menu1 from "./Menu1";
import Menu2 from "./Menu2";

export default function VisPage() {
  const router = useRouter();
  const [user, setUser] = useState({Id:"", project: "", forms:[], roles:[], questions:[]});

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

    APIHandle.APIRequestUser()
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
        body: JSON.stringify(e.target.value)
    }) 
    .then((response) => response.json())
    .then((data) => {
        setUser({
          ...user,
          roles: data.roles[0],
          questions: data.questions
        })        
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
        
  } 

  console.log(user)

  const listForm = user?.forms.map((form: any) => (
    <option key={form}>{form}</option>
  ));
  const listRoles = user?.roles?.map((role: any, i: number) => (
      <div key={i}>
        <input type="checkbox" id={role} name="rolePicks" />
        <label htmlFor={role}> {role} </label>
      </div>
    ));
    const listQuestions = user?.questions?.map((question: any, i: number) => (
      <div key={i}>
        <input type="checkbox" id={question} name="questionPicks" />
        <label htmlFor={question}> Question {i+1}: {question.description} </label>
      </div>
    ));

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="formDefault">
      <form className="space-y-5 flex flex-col justify-center text-center">
        <div>
          <h3 className="block text-sm font-semibold text-gray-800">Select form for visualization</h3>
          <select className="bg-white-300" defaultValue={'DEFAULT'} 
          onChange={handleSelect}>
            <option disabled value="DEFAULT">-- select option --</option>
            {listForm}
          </select>
        </div>
        <div>
          <h3 className="block text-sm font-semibold text-gray-800">Select other form for comparison (optional)</h3>
          <select className="bg-white-300" defaultValue={'DEFAULT'}>
          <option disabled value="DEFAULT">-- select option --</option>
            {listForm}
          </select>
        </div>
          <Menu1
          roles = {listRoles}
          />
          <Menu2
          questions={listQuestions}
          />
      </form>
      </div>
    </div>
  );
}
