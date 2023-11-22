"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { APIHandle } from "../classes/handlerClass";
import { Token } from "../classes/tokenClass";
import Cookies from "js-cookie";
import { FetchError } from "node-fetch";
import { checkList } from "../classes/userClass";
import Menu1 from "./Menu1";

export default function VisPage() {
  const router = useRouter();
  const [user, setUser] = useState({Id:"", project: "", forms:[], roles:[]});

  const handleSelect =  (e: React.ChangeEvent<HTMLSelectElement>) => {
    
    fetch("/api/getRoles", {
        method: "POST",
        body: JSON.stringify(e.target.value)
    }).then(async (response) => {
        console.log(response)
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
        
  } 

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
      .then(async (data) => {
        if (data) {
          setUser(await data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [router]);

  const listForm = user?.forms.map((form: any) => (
    <option key={form}>{form}</option>
  ));
  /* const listRoles = user?.roles.map((role: any, i: number) => (
    <div key={i}>
      <input type="checkbox" id={role} name={role} />
      <label htmlFor={role}>{role}</label>
    </div>
    )); */
 

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <ul className="space-y-5 flex flex-col justify-center text-center">
        <li>
          <h3>Select form for visualization</h3>
          <select defaultValue={'DEFAULT'} 
          onChange={handleSelect}>
            <option disabled value="DEFAULT">-- select option --</option>
            {listForm}
          </select>
        </li>
        <li>
          <h3>Select other form for comparison (optional)</h3>
          <select defaultValue={'DEFAULT'} 
          onChange={handleSelect}>
          <option disabled value="DEFAULT">-- select option --</option>
            {listForm}
          </select>
        </li>
        <li>
          {/* <Menu1
          roles = {listRoles}
          /> */}
        </li>
      </ul>
    </div>
  );
}
