'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import PieChart from '@/app/(admin)/components/Pie'
import BarChart from '@/app/(admin)/components/Bar'
import FeedbackArea from '@/app/(admin)/components/FeedbackArea'
import { Suspense, useEffect, useState } from 'react'
import { TokenValidator } from "@/app/(admin)/classes/tokenClass";
import Cookies from "js-cookie";
import { dataMaker } from '@/app/(admin)/classes/chartMaker'
import { APIHandle } from '@/app/(admin)/classes/handlerClass'
import Question, { MultipleChoice } from '@/app/(admin)/formCreation/question'
import { param } from 'cypress/types/jquery'

export default function ChartPage(response: any) {
    const router = useRouter()
    //const searchParams = use
    const [chartData, setChartData] = useState({
        roles: [{} as any],
        questions: [{} as any]
      });
      const [chartData2, setChartData2] = useState({
        roles: [{} as any],
        questions: [{} as any]
      });
    
    const [answerData, setAnswerData] = useState(new dataMaker);
    const [answerData2, setAnswerData2] = useState(new dataMaker);
    const formData = response.searchParams;

    

    useEffect(()=>{
        const token = Cookies.get('token');

        if (!token) {
          router.push('/');
          return;
        }
        TokenValidator.validateToken(token).catch((error) => {
        console.error(error);
        router.replace("/login");
        });
        if(formData.otherForm){
            Cookies.set('otherForm', formData.otherForm);
            APIHandle.APIRequestRQ({selectedForm: formData.form})
            .then((data) => {
                setChartData2({
                ...chartData,
                roles: data.formdata2.roles,
                questions: data.formdata2.questions
                })
                console.log(data)
                answerData2.makeArray(data.oResponse, formData.rolePicks)
                console.log(answerData2.dataArray);

            })
        }

        APIHandle.APIRequestRQ({selectedForm: formData.form})
        .then((data) => {
                setChartData({
                ...chartData,
                roles: data.formdata.roles,
                questions: data.formdata.questions
                })
                console.log(data)
                answerData.makeArray(data.mResponse, formData.rolePicks)
                console.log(answerData.dataArray);

            })

        
        .catch((error) => {
                console.error(`Error: ${error}`);
            });
    },[])
    let sortedDataArray: any = []
    let sortedDataArray2: any = []
    try {
        sortedDataArray = answerData.sortDataArray(formData, chartData);
        sortedDataArray2 = answerData2.sortDataArray(formData, chartData2);
    } catch (error) {
        window.location.reload()
    }
    

    console.log(sortedDataArray);
    console.log(sortedDataArray2);
   
    if (typeof formData.questionPicks === "string") {
        formData.questionPicks = [formData.questionPicks];
    }
    if (typeof formData.rolePicks === "string") {
        formData.rolePicks = [formData.rolePicks];
    }

    console.log(chartData);

    //chartData.questions.forEach((newElement : any) => {
    
    return(
        <main>
            {formData.questionPicks.map((option: number, optionIndex: number) => (
            <div className='overflow-x-auto' key={optionIndex}>
                <ul className='space-x-5 flex flex-row'>
                    <li>
                        { //Multiple choice (radio buttons)
                        (sortedDataArray[option]?.questionType == 0 && sortedDataArray[option]?.type == 0) && (
                            <PieChart
                            questionName={sortedDataArray[option].description}
                            questionIndex={option}
                            roles={formData.rolePicks}
                            answerCount={sortedDataArray[option].roleAnswersCount}
                            answer2Count={formData.otherForm ? sortedDataArray2[option].roleAnswersCount : {}}
                        />
                        )}
                        { //Multiple choice (checkboxes)
                        (sortedDataArray[option]?.questionType == 0 && sortedDataArray[option]?.type == 1) && (
                            <BarChart
                            questionName={sortedDataArray[option].description}
                            questionIndex={option}
                            questions={chartData.questions[option]._options}
                            answerCount={sortedDataArray[option].roleAnswersCount}
                            answer2Count={formData.otherForm ? sortedDataArray2[option].roleAnswersCount : {}}
                        />
                        )}
                        { //Slider (AgreeDisagree)
                        (sortedDataArray[option]?.questionType == 1 && sortedDataArray[option]?.type == 0) && (
                            <BarChart
                            questionName={sortedDataArray[option].description}
                            questionIndex={option}
                            questions={sortedDataArray[option]?.questionLabels}
                            answerCount={sortedDataArray[option].roleAnswersCount}
                            answer2Count={formData.otherForm ? sortedDataArray2[option].roleAnswersCount : {}}
                        />
                        )}
                        { //Slider (values)
                        (sortedDataArray[option]?.questionType == 1 && sortedDataArray[option]?.type == 1) && (
                            <BarChart
                            questionName={sortedDataArray[option].description}
                            questionIndex={option}
                            questions={sortedDataArray[option]?.questionLabels}
                            answerCount={sortedDataArray[option].roleAnswersCount}
                            answer2Count={formData.otherForm ? sortedDataArray2[option].roleAnswersCount : {}}
                        />
                        )}
                        { //Text input
                        (sortedDataArray[option]?.questionType == 2) && (
                            <FeedbackArea
                            questionName={sortedDataArray[option].description}
                            questionIndex={option}
                            questions={formData.rolePicks}
                            answerCount={sortedDataArray[option].roleAnswers}
                            answerCount2={formData.otherForm ? sortedDataArray2[option].roleAnswers : {}}
                        />
                        )}
                    </li>
                </ul>
            </div>
            ))}
        </main>
    );
}