"use client"
import React, { lazy, Suspense, useState, useEffect } from 'react';

const MultipleChoiceComponent = lazy(() => import('./MultipleChoiceComponent'));
const SliderComponent = lazy(() => import('./SliderComponent'));
const TextInputComponent = lazy(() => import('./TextInputComponent'));

function FormRenderer({ formObject }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const totalQuestions = formObject.questions.length;

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
            {question.questionType === 0 && (
              <MultipleChoiceComponent
              jsonData={question}
              onUserInput={handleUserInput}
              currentQuestionIndex={currentQuestionIndex}
              userResponses={userResponses}
              />
            )}
            {question.questionType === 1 && (
              <SliderComponent
              jsonData={question}
              onUserInput={handleUserInput}
              currentQuestionIndex={currentQuestionIndex}
              userResponses={userResponses}
              />
            )}
            {question.questionType === 2 && (
              <TextInputComponent
              jsonData={question}
              onUserInput={handleUserInput}
              currentQuestionIndex={currentQuestionIndex}
              userResponses={userResponses}
              />
            )}
          </Suspense>
        )
      ))}
      <div className="flex justify-between mt-4">
        {currentQuestionIndex > 0 && (
          <button onClick={goToPreviousQuestion}>Previous Question</button>
        )}
        {currentQuestionIndex < totalQuestions - 1 && (
          <button onClick={goToNextQuestion}>Next Question</button>
        )}
      </div>
      <button onClick={() => console.log(userResponses)}>Log User Responses</button>
    </div>
  );
}

export default FormRenderer;