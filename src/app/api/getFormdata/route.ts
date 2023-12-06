const jwt = require("jsonwebtoken");
import { checkList } from "@/app/classes/userClass";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs/promises"
import FormBuilder from "@/app/formCreation/FormBuilder";
import Form from "@/app/formCreation/form";

export async function POST(request: NextRequest, response: NextResponse){
    const token = cookies().get('token');
    const decoded = jwt.verify(token?.value, process.env.JWT_SECRET);
    const {selectedForm} = await request.json();
    const projectName = (cookies().get('projectName')?.value as string).replace(/(?<!\\)-/g," ").replace(/\\-/g,"-");

    
    const forms = await checkList.findForms(decoded.userId, projectName);
    const selectForm = forms.find((form: any) => form._name == selectedForm)
    const formObject =  new FormBuilder().formFromObject(selectForm)
    const roleslist: any[] | undefined = checkList.findRoles(formObject)
    const path = process.cwd() + `/src/app/database/${decoded.userId}/${projectName}/${selectedForm}/responses.json`;
    
    
    const responseFile = await fs.readFile(path, "utf8")
    .then((responses) => {
        return JSON.parse(responses);
    })
    .catch((error) => {
        // Handle errors
        console.error('Error reading forms:', error);
        return [];
    });
    if(cookies().get('otherForm')){
        const otherForm = cookies().get('otherForm')?.value;
        const forms2 = await checkList.findForms(decoded.userId, projectName);
        const selectForm2 = forms.find((form: any) => form._name == otherForm)
        const formObject2 =  new FormBuilder().formFromObject(selectForm2)
        const roleslist2: any[] | undefined = checkList.findRoles(formObject2)
        const path2 = process.cwd() + `/src/app/database/${decoded.userId}/${projectName}/${otherForm}/responses.json`;
        
        
        const responseFile2 = await fs.readFile(path2, "utf8")
        .then((responses) => {
            return JSON.parse(responses);
        })
        .catch((error) => {
            // Handle errors
            console.error('Error reading forms:', error);
            return [];
        });
        return new NextResponse(JSON.stringify({formdata: {roles: roleslist, selectedForm: selectedForm, questions: formObject.questions}, formdata2:{roles: roleslist2, selectedForm: otherForm, questions: formObject2.questions}, mResponse: responseFile, oResponse: responseFile2}), {status: 200})

    }else{
        return new NextResponse(JSON.stringify({formdata: {roles: roleslist, selectedForm: selectedForm, questions: formObject.questions}, mResponse: responseFile}), {status: 200})
    }
} 