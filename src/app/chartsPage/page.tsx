'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import PieChart from '../components/Pie'
import BarChart from '../components/Bar'
import FeedbackArea from '../components/FeedbackArea'
import { Suspense, useEffect, useState } from 'react'
import { Token } from "../classes/tokenClass";
import Cookies from "js-cookie";
import { QuestionHandler, dataMaker } from '../classes/chartMaker'
import { APIHandle } from '../classes/handlerClass'




export default function ChartPage(response: any) {
    const router = useRouter()
    const [chartData, setChartData] = useState({
        roles: [{} as any],
        questions: [{} as any]
      });
    const [answerData, setAnswerData] = useState(new dataMaker)
    
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
                
                answerData.makeArray(data.mResponse, formData.rolePicks)
                console.log(answerData.dataArray);

            })
        .catch((error) => {
                console.error(`Error: ${error}`);
            });
    },[])

    const sortedDataArray = answerData.sortDataArray(formData, chartData);
    console.log(sortedDataArray);
   
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
                            answer2Count={sortedDataArray[option].roleAnswersCount}
                        />
                        )}
                        { //Multiple choice (checkboxes)
                        (sortedDataArray[option]?.questionType == 0 && sortedDataArray[option]?.type == 1) && (
                            <BarChart
                            questionName={sortedDataArray[option].description}
                            questionIndex={option}
                            questions={chartData.questions[option].options}
                            answerCount={sortedDataArray[option].roleAnswersCount}
                            answer2Count={sortedDataArray[option].roleAnswersCount}
                        />
                        )}
                        { //Slider (AgreeDisagree)
                        (sortedDataArray[option]?.questionType == 1 && sortedDataArray[option]?.type == 0) && (
                            <BarChart
                            questionName={sortedDataArray[option].description}
                            questionIndex={option}
                            questions={sortedDataArray[option]?.questionLabels}
                            answerCount={sortedDataArray[option].roleAnswersCount}
                            answer2Count={sortedDataArray[option].roleAnswersCount}
                        />
                        )}
                        { //Slider (values)
                        (sortedDataArray[option]?.questionType == 1 && sortedDataArray[option]?.type == 1) && (
                            <BarChart
                            questionName={sortedDataArray[option].description}
                            questionIndex={option}
                            questions={sortedDataArray[option]?.questionLabels}
                            answerCount={sortedDataArray[option].roleAnswersCount}
                            answer2Count={sortedDataArray[option].roleAnswersCount}
                        />
                        )}
                        { //Text input
                        (sortedDataArray[option]?.questionType == 2) && (
                            <FeedbackArea
                            questionName={sortedDataArray[option].description}
                            questionIndex={option}
                            questions={formData.rolePicks}
                            answerCount={sortedDataArray[option].roleAnswers}
                        />
                        )}
                    </li>
                </ul>
            </div>
            ))}
        </main>
    );
}