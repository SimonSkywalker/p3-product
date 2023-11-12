"use client"
import React, { lazy, Suspense, useState, useEffect } from 'react';

const MultipleChoiceComponent = lazy(() => import('./MultipleChoiceComponent'));
const SliderComponent = lazy(() => import('./SliderComponent'));
const TextInputComponent = lazy(() => import('./TextInputComponent'));
const SkippedComponent = lazy(() => import('./SkippedComponent'));

function FormRenderer({ formObject }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const totalQuestions = formObject.questions.length;
  const [isResponseProvided, setIsResponseProvided] = useState(false);
  const [isSkippedResponse, setIsSkippedResponse] = useState(false);

  useEffect(() => {
    //console.log(Boolean(userResponses[currentQuestionIndex]));
    const isResponseEmpty = !userResponses[currentQuestionIndex] || userResponses[currentQuestionIndex].length === 0;
    setIsResponseProvided(!isResponseEmpty);

    try {
      const isSkippedResponse = Boolean(userResponses[currentQuestionIndex][0] === -1);
      setIsSkippedResponse(isSkippedResponse);
    } catch (error) {
      
    }
      
  }, [currentQuestionIndex, userResponses]);

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const submitAnswers = () => {
    //code goes here, chatgpt
  }

  const handleUserInput = (response) => {
    // Update the userResponses array with the latest response
    setUserResponses((prevResponses) => {
      const newResponses = [...prevResponses];
      newResponses[currentQuestionIndex] = response;
      return newResponses;
    });
  };

  return (
    <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-8 max-w-2xl">
      <h1 className="text-2xl font-medium text-center">{formObject.name}</h1>
      <p className="text-l font-medium mb-4 text-center">{formObject.description}</p>
      <div className="relative flex pb-5 items-center">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="flex-shrink mx-4 text-gray-400">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      {formObject.questions.map((question, index) => (
        index === currentQuestionIndex && (
          <Suspense key={index} fallback={<div>Loading...</div>}>
            {question.questionType === 0 && !isSkippedResponse && (
              <MultipleChoiceComponent
              jsonData={question}
              onUserInput={handleUserInput}
              currentQuestionIndex={currentQuestionIndex}
              userResponses={userResponses}
              />
            )}
            {question.questionType === 1 && !isSkippedResponse && (
              <SliderComponent
              jsonData={question}
              onUserInput={handleUserInput}
              currentQuestionIndex={currentQuestionIndex}
              userResponses={userResponses}
              />
            )}
            {question.questionType === 2 && !isSkippedResponse && (
              <TextInputComponent
              jsonData={question}
              onUserInput={handleUserInput}
              currentQuestionIndex={currentQuestionIndex}
              userResponses={userResponses}
              />
            )}
            {isSkippedResponse && (
              <SkippedComponent
              jsonData={question}
              />
            )}
          </Suspense>
        )
      ))}
      <div className="flex justify-between mt-4">
        {currentQuestionIndex > 0 && (
          <button 
            onClick={goToPreviousQuestion}>
              Previous Question
          </button>
        )}
        {currentQuestionIndex < totalQuestions - 1 && (
          <button 
            onClick={goToNextQuestion}
            disabled={!isResponseProvided && formObject.questions[currentQuestionIndex].mandatory}>
              Next Question
          </button>
        )}
        {currentQuestionIndex === totalQuestions - 1 && (
          <button 
            onClick={submitAnswers}
            disabled={!isResponseProvided && formObject.questions[currentQuestionIndex].mandatory}>
              Sumbit Answers
          </button>
        )}
        {!formObject.questions[currentQuestionIndex].mandatory && !isSkippedResponse && (
          <button
            onClick={() => {
              handleUserInput([-1]); // Set the response to -1
              goToNextQuestion();
            }}
          >
            Skip
          </button>
        )}
        {!formObject.questions[currentQuestionIndex].mandatory && isSkippedResponse && (
          <button
            onClick={() => {
              let initialValue;

              if (formObject.questions[currentQuestionIndex].questionType === 0) {
                // For question type 0, set handleUserInput to an empty array
                initialValue = [];
              } else if (formObject.questions[currentQuestionIndex].questionType === 1) {
                // For question type 1, set handleUserInput to the range value
                initialValue = Math.ceil(formObject.questions[currentQuestionIndex].range / 2);
              } else if (formObject.questions[currentQuestionIndex].questionType === 2) {
                // For question type 2, set handleUserInput to an empty text string
                initialValue = '';
              }

              handleUserInput(initialValue);
            }}
          >
            Don't Skip
          </button>
        )}
      </div>
      <button onClick={() => console.log(userResponses)}>Log User Responses</button>
    </div>
  );
}

export default FormRenderer;