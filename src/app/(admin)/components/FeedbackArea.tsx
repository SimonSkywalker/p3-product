import React, { useEffect } from "react"

interface FeedbackProps {
    questionName: string
    questionIndex: number
    questions: any[]
    answerCount: {}
    answerCount2: {}
  }
  
  export default function FeedbackArea({ questionName, questionIndex, questions, answerCount, answerCount2 } : FeedbackProps) {
     const handleTextArea = (feedback: {}) =>{
        let html = [];
        let counter = -1;
        for (const [key, value] of Object.entries(feedback) as any) {
            if (value.answer != -1) {
                counter += 1;
                html.push(
                <div className="border border-gray-200 flex flex-col items-center justify-center p-8 space-y-10 text-center bg-white" key={counter}>
                    <div className="max-w-2xl mx-auto text-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900">{key}</h2>
                        <h4 className="text-md text-gray-500">Roles: {value.role.join(', ')}</h4>
                        <p className="my-4">{value.answer}</p>
                    </div>   
                </div>
                )
            }
        }

        return html
    } 
    return (
        <>
            <h1 className="mt-10 text-xl font-semibold capitalize ">{questionName}</h1>
            <div className="grid grid-cols-2 gap-2">
                <div className="grid  grid-rows-2 gap-4 bg-white">
                    {handleTextArea(answerCount)}
                </div>
                {Object.keys(answerCount2).length !== 0 && (
                <div className="grid  grid-rows-2  gap-4 bg-white">
                    {handleTextArea(answerCount2)}
                </div>
                )}
            </div>
        </>
    )
}

