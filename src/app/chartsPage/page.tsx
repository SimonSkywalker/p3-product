'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import Example from '../linechart'
import Example2 from '../Pie'
import { useEffect, useState } from 'react'
import { Token } from "../classes/tokenClass";
import Cookies from "js-cookie";
import { QuestionHandler, chartMaker } from '../classes/chartMaker'
import { APIHandle } from '../classes/handlerClass'

export default function ChartPage(response: any) {
    const router = useRouter()
    const [chartData, setChartData] = useState({
        roles: [],
        questions: [],
      });
    //console.log(response.searchParams);
    
    const formData = response.searchParams;

    if (Object.keys(formData).length === 0) {
        router.push('/chart');
      return;
    }

    useEffect(()=>{
        const token = Cookies.get('token');

        if (!token) {
          router.push('/');
          return;
        }
    Token.validateToken(token).catch((error) => {
      console.error(error);
      router.replace("/login");
    });
    
    APIHandle.APIRequestRQ(formData.form)
    .then((data) => {
            setChartData({
            ...chartData,
            roles: data.formdata.roles,
            questions: data.formdata.questions
            })

            console.log(data.mResponse);
            let info = new chartMaker()
            info.makeArray(data.mResponse, formData.rolePicks)
            console.log(info.dataArray);
        })
    .catch((error) => {
            console.error(`Error: ${error}`);
        });
    }, [formData])

    //formData, check if info[i].roles is in formdata.rolePicks
    
    if (typeof formData.questionPicks === "string") {
        formData.questionPicks = [formData.questionPicks];
    }
    if (typeof formData.rolePicks === "string") {
        formData.rolePicks = [formData.rolePicks];
    }
    //console.log(QuestionHandler.questionIndexGetter(formData.questionPicks, chartData.questions));

    return(
        <main>
            {formData.questionPicks.map((option: string, optionIndex: number) => (
            <div className='overflow-x-auto' key={optionIndex}>
                <ul className='space-x-5 flex flex-row'>
                    <li>
                    <Example2
                        questionName={option}
                        questionIndex={optionIndex}
                        roles={formData.rolePicks}
                    />
                    </li>
                </ul>
            </div>
            ))}
        </main>
    );
}