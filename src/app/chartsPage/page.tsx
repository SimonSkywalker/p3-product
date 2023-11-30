'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import Example from '../linechart'
import Example2 from '../Pie'
import { useEffect, useState } from 'react'
import { Token } from "../classes/tokenClass";
import Cookies from "js-cookie";
import { QuestionHandler, dataMaker } from '../classes/chartMaker'
import { APIHandle } from '../classes/handlerClass'

export default function ChartPage(response: any) {
    const router = useRouter()
    const [chartData, setChartData] = useState({
        roles: [{} as any],
        questions: [{} as any],
      });
    const [answerData, setAnswerData] = useState(new dataMaker)
    
    const formData = response.searchParams;
    let myNewArray: any = {};

    if (Object.keys(formData).length === 0) {
        router.push('/chart');
      return;
    }

    const agreeDisagreeRanges = {
        9: [
          "Strongly Disagree",
          "Disagree",
          "Moderately Disagree",
          "Slightly Disagree",
          "Neutral",
          "Slightly Agree",
          "Moderately Agree",
          "Agree",
          "Strongly Agree"
        ],
        7: [
          "Strongly Disagree",
          "Disagree",
          "Somewhat Disagree",
          "Neutral",
          "Somewhat Agree",
          "Agree",
          "Strongly Agree"
        ],
        5: [
          "Strongly Disagree",
          "Disagree",
          "Neutral",
          "Agree",
          "Strongly Agree"
        ],
        3: [
          "Disagree",
          "Neutral",
          "Agree"
        ]
      };

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
        
        let info = new dataMaker()
        APIHandle.APIRequestRQ(formData.form)
        .then((data) => {
                setChartData({
                ...chartData,
                roles: data.formdata.roles,
                questions: data.formdata.questions
                })
                
                answerData.makeArray(data.mResponse, formData.rolePicks)
                info.makeArray(data.mResponse, formData.rolePicks)
                console.log(answerData.dataArray);
            })
        .catch((error) => {
                console.error(`Error: ${error}`);
            });
    },[])
    myNewArray = {};
    answerData.dataArray.forEach((element : any, i: number) => {
        const roles = element.roles;
        const questions = element.questions;

        Object.keys(questions).forEach((key: any) => {

            if (!myNewArray[key]) {
                myNewArray[key] = {};
            }
            if (!myNewArray[key]["roleAnswers"]) {
                myNewArray[key]["roleAnswers"] = {};
            }
            if (!myNewArray[key]["roleAnswersCount"]) {
                myNewArray[key]["roleAnswersCount"] = {};   
            }

            formData.rolePicks.forEach((newElement : any) => {

                if (!myNewArray[key]["roleAnswers"][newElement]) {
                    myNewArray[key]["roleAnswers"][newElement] = [];   
                }
                if (!myNewArray[key]["roleAnswersCount"][newElement]) {
                    myNewArray[key]["roleAnswersCount"][newElement] = {};  
                }

                const value = questions[key];
                if (roles.includes(newElement)) {
                    if (Array.isArray(value)) {
                        myNewArray[key]["roleAnswers"][newElement].push(...value);

                        value.forEach((newValue : any) => {

                            if (!myNewArray[key]["roleAnswersCount"][newElement][newValue]) {
                                myNewArray[key]["roleAnswersCount"][newElement][newValue] = 0;
                                
                            }

                            myNewArray[key]["roleAnswersCount"][newElement][newValue] += 1;
                        })           
                    }
                } 
            });    

            

            myNewArray[key]["questionType"] = chartData.questions[key].questionType;
            if (chartData.questions[key].type) {
                myNewArray[key]["type"] = chartData.questions[key].type;
            }
            if (chartData.questions[key].range) {
                myNewArray[key]["range"] = chartData.questions[key].range;
            }

            if (chartData.questions[key].questionType == 1) {
                if (chartData.questions[key].type == 0) {
                    let rangeKey: keyof typeof agreeDisagreeRanges = chartData.questions[key].range;
                    myNewArray[key]["questionLabels"] = agreeDisagreeRanges[rangeKey];
                } else if (chartData.questions[key].type == 1) {
                    let valueRange = Array.from({length: chartData.questions[key].range}, (_, i) => i + 1);
                    myNewArray[key]["questionLabels"] = valueRange;
                }
            }
        });
    });

    console.log(myNewArray);
    
    if (typeof formData.questionPicks === "string") {
        formData.questionPicks = [formData.questionPicks];
    }
    if (typeof formData.rolePicks === "string") {
        formData.rolePicks = [formData.rolePicks];
    }

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