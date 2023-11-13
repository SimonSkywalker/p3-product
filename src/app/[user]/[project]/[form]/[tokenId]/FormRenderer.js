"use client"
import React, { lazy, Suspense, useState, useEffect } from 'react';
import axios from 'axios'; // Import the axios library

const FirstPageComponent = lazy(() => import('./FirstPageComponent'));
const MultipleChoiceComponent = lazy(() => import('./MultipleChoiceComponent'));
const AgreeDisagreeComponent = lazy(() => import('./AgreeDisagreeComponent'));
const SliderComponent = lazy(() => import('./SliderComponent'));
const TextInputComponent = lazy(() => import('./TextInputComponent'));
const SkippedComponent = lazy(() => import('./SkippedComponent'));
const SubmitPageComponent = lazy(() => import('./SubmitPageComponent'));
const FinalPageComponent = lazy(() => import('./FinalPageComponent'));
const AlreadyUsedPageComponent = lazy(() => import('./AlreadyUsedPageComponent'));

function FormRenderer({ formObject, params }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const totalQuestions = formObject.questions.length;
  const [isResponseProvided, setIsResponseProvided] = useState(false);
  const [isSkippedResponse, setIsSkippedResponse] = useState(false);

  const [isOnFirstPage, setIsOnFirstPage] = useState(true);
  const [isOnSubmitPage, setIsOnSubmitPage] = useState(false);
  const [isOnFinalPage, setIsOnFinalPage] = useState(false);
  const [isOnAlreadyUsedPage, setIsOnAlreadyUsedPage] = useState(formObject.tokens.find((tokens) => tokens.hasOwnProperty(params.tokenId))?.[params.tokenId].isUsed);

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
      if (isOnSubmitPage) {
        setIsOnSubmitPage(false);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    }
  };

  const goToNextQuestion = () => {
    if (isOnFirstPage === true) {
      setIsOnFirstPage(false);
    } else if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsOnSubmitPage(false);
    }
  };

  const goToSubmitPage = () => {
    setIsOnSubmitPage(true);
  };

  const goToFinalPage = () => {
    setIsOnFinalPage(true);
  };  

  const submitAnswers = () => {
    // Show a confirmation dialog to the user
    const confirmed = window.confirm('Are you sure you want to submit your answers?');

    if (confirmed) {
      // User confirmed, proceed with Axios request
      // Make a POST request to the API route
      axios
        .post('/api/submitResponses', { userResponses, params })
        .then((response) => {
          console.log(response.data.message); // Output the response from the server
          goToFinalPage();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      // User canceled the action
      console.log('Submission canceled.');
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
      {isOnFirstPage || isOnSubmitPage || isOnFinalPage || isOnAlreadyUsedPage ? (
        <div className="relative flex pb-5 items-center">
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        ) : null // Optional: Render null if none of the conditions are true
      }
      {!isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
        <div className="relative flex pb-5 items-center">
          <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
      )}
      {isOnFirstPage && !isOnAlreadyUsedPage && (
        <FirstPageComponent/>
      )}
      {formObject.questions.map((question, index) => (
        index === currentQuestionIndex && (
          <Suspense key={index} fallback={<div>Loading...</div>}>
            {question.questionType === 0 && !isSkippedResponse && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
              <MultipleChoiceComponent
              jsonData={question}
              onUserInput={handleUserInput}
              currentQuestionIndex={currentQuestionIndex}
              userResponses={userResponses}
              />
            )}
            {question.questionType === 1 && question.type === 0 && !isSkippedResponse && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
              <AgreeDisagreeComponent
              jsonData={question}
              onUserInput={handleUserInput}
              currentQuestionIndex={currentQuestionIndex}
              userResponses={userResponses}
              />
            )}
            {question.questionType === 1 && question.type === 1 && !isSkippedResponse && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
              <SliderComponent
              jsonData={question}
              onUserInput={handleUserInput}
              currentQuestionIndex={currentQuestionIndex}
              userResponses={userResponses}
              />
            )}
            {question.questionType === 2 && !isSkippedResponse && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
              <TextInputComponent
              jsonData={question}
              onUserInput={handleUserInput}
              currentQuestionIndex={currentQuestionIndex}
              userResponses={userResponses}
              />
            )}
            {isSkippedResponse && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
              <SkippedComponent
              jsonData={question}
              />
            )}
            {isOnSubmitPage && !isOnFirstPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
              <SubmitPageComponent
              jsonData={formObject}
              />
            )}
            {!isOnFirstPage && isOnFinalPage && !isOnAlreadyUsedPage && (
              <FinalPageComponent/>
            )}
            {isOnAlreadyUsedPage && (
              <AlreadyUsedPageComponent/>
            )}
          </Suspense>
        )
      ))}
      <div className="flow-root justify-between mt-4">
      {isOnFirstPage && !isOnAlreadyUsedPage && (
          <button 
            onClick={goToNextQuestion}
            className="float-right">
              Let's Go
          </button>
        )}
        {currentQuestionIndex > 0 && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
          <button 
            onClick={goToPreviousQuestion}
            className="float-left">
              Previous Question
          </button>
        )}
        {currentQuestionIndex < totalQuestions - 1 && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
          <button 
            onClick={goToNextQuestion}
            disabled={!isResponseProvided && formObject.questions[currentQuestionIndex].mandatory}
            className="float-right">
              Next Question
          </button>
        )}
        {currentQuestionIndex === totalQuestions - 1 && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
          <button 
            onClick={goToSubmitPage}
            disabled={!isResponseProvided && formObject.questions[currentQuestionIndex].mandatory}
            className="float-right">
              Submit
          </button>
        )}
        {currentQuestionIndex < totalQuestions - 1 && !formObject.questions[currentQuestionIndex].mandatory && !isSkippedResponse && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
          <button
            onClick={() => {
              handleUserInput([-1]); // Set the response to -1
              goToNextQuestion();
            }}
            className="float-right mr-5"
          >
            Skip
          </button>
        )}
        {currentQuestionIndex === totalQuestions - 1 && !formObject.questions[currentQuestionIndex].mandatory && !isSkippedResponse && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
          <button
            onClick={() => {
              handleUserInput([-1]); // Set the response to -1
              goToSubmitPage();
            }}
            className="float-right mr-5"
          >
            Skip and Submit
          </button>
        )}
        {!formObject.questions[currentQuestionIndex].mandatory && isSkippedResponse && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
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
            className="float-right mr-5"
          >
            Don't Skip
          </button>
        )}
        {!isOnFirstPage && isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
          <button 
            onClick={goToPreviousQuestion}
            className="float-left"
          >
            Not Quite Done Yet
          </button>
        )}
        {!isOnFirstPage && isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
          <button 
            onClick={submitAnswers}
            className="float-right"
          >
            Submit My Answers
          </button>
        )}
        {/* Virker ikke
        https://stackoverflow.com/questions/2076299/how-to-close-current-tab-in-a-browser-window
        isOnFinalPage || isOnAlreadyUsedPage ? (
          <button 
            onClick={() => 
              window.close()
            }
            className="float-right"
          >
            Close Page
          </button>
        ) : null // Optional: Render null if none of the conditions are true */}
      </div>
      {/*
        <button onClick={() => console.log(userResponses)}>Log User Responses</button>
      */}
    </div>
  );
}

export default FormRenderer;