"use client"
// FormRenderer.tsx
import React, { lazy, Suspense, useState, useEffect } from 'react';
import axios from 'axios'; // Import the axios library

// Lazy-loaded components
const FirstPageComponent = lazy(() => import('./FirstPageComponent'));
const MultipleChoiceComponent = lazy(() => import('./MultipleChoiceComponent'));
const AgreeDisagreeComponent = lazy(() => import('./AgreeDisagreeComponent'));
const SliderComponent = lazy(() => import('./SliderComponent'));
const TextInputComponent = lazy(() => import('./TextInputComponent'));
const SkippedComponent = lazy(() => import('./SkippedComponent'));
const SubmitPageComponent = lazy(() => import('./SubmitPageComponent'));
const FinalPageComponent = lazy(() => import('./FinalPageComponent'));
const AlreadyUsedPageComponent = lazy(() => import('./AlreadyUsedPageComponent'));

// Define interfaces
interface FromRendererProps {
  formObject: FormObject;
  params: Params;
}

interface FormObject {
  name: string;
  description: string;
  questions: Question[];
  tokens: Token[];
}

interface Question {
  description: string;
  mandatory: boolean;
  userDisplay: boolean;
  questionType: number;
  saveRole: boolean;
  options: any[string];
  type: number;
  range: number;
}

interface Token {
  [key: string]: {
    isUsed: boolean;
  };
}

interface Params {
  user: string; 
  project: string; 
  form: string; 
  tokenId: string
}

interface UserResponse {
  [key: number]: any;
}

export default function FormRenderer({ formObject, params } : FromRendererProps) {
  // State variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
  const totalQuestions = formObject.questions.length;
  const [isResponseProvided, setIsResponseProvided] = useState(false);
  const [isSkippedResponse, setIsSkippedResponse] = useState(false);

  // Page state variables
  const [isOnFirstPage, setIsOnFirstPage] = useState(true);
  const [isOnSubmitPage, setIsOnSubmitPage] = useState(false);
  const [isOnFinalPage, setIsOnFinalPage] = useState(false);
  const [isOnAlreadyUsedPage, setIsOnAlreadyUsedPage] = useState<boolean>(
    formObject.tokens.find((tokens) => tokens.hasOwnProperty(params.tokenId))?.[params.tokenId]?.isUsed || false
  );

  // useEffect to check for changes in userResponses and update isResponseProvided and isSkippedResponse
  useEffect(() => {
    const isResponseEmpty = !userResponses[currentQuestionIndex] || Object.keys(userResponses[currentQuestionIndex]).length === 0;
    setIsResponseProvided(!isResponseEmpty);

    try {
      const isSkippedResponse = Boolean(userResponses[currentQuestionIndex][0] === -1);
      setIsSkippedResponse(isSkippedResponse);
    } catch (error) {
      // Do nothing
    }
  }, [currentQuestionIndex, userResponses]);

  // Function to navigate to the previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      if (isOnSubmitPage) {
        setIsOnSubmitPage(false);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    }
  };

  // Function to navigate to the next question or submit page
  const goToNextQuestion = () => {
    if (isOnFirstPage === true) {
      setIsOnFirstPage(false);
    } else if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsOnSubmitPage(false);
    }
  };

  // Function to navigate to the submit page
  const goToSubmitPage = () => {
    setIsOnSubmitPage(true);
  };

  // Function to navigate to the final page
  const goToFinalPage = () => {
    setIsOnFinalPage(true);
  };

  // Function to submit answers
  const submitAnswers = () => {
    // Show a confirmation dialog to the user
    const confirm = window.confirm('Are you sure you want to submit your answers?');

    if (confirm) {
      // User confirmed, proceed with Axios request
      // Make a POST request to the API route
      axios
        .post('/api/submitResponses', { userResponses, params })
        .then((response) => {
          goToFinalPage();
        })
        .catch((error) => {
          alert(`Error: ${error}`);
        });
    }
  };

  // Function to handle user input and update userResponses
  const handleUserInput = (response: UserResponse) => {
    // Update the userResponses array with the latest response
    setUserResponses((prevResponses) => {
      const newResponses = [...prevResponses];
      newResponses[currentQuestionIndex] = response;
      return newResponses;
    });
  };

  // Return the JSX structure for the component
  return (
    <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-8 max-w-2xl">
      <h1 className="text-2xl font-medium text-center">{formObject.name}</h1>
      <p className="text-l font-medium mb-4 text-center">{formObject.description}</p>
      {isOnFirstPage || isOnSubmitPage || isOnFinalPage || isOnAlreadyUsedPage ? (
        <div className="relative flex pb-5 items-center">
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        ) : null // Render null if none of the conditions are true
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
              <SubmitPageComponent/>
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
      {(
        <div className="relative flex items-center mt-5">
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        )
      }
      <div className="flow-root justify-between mt-3">
      {isOnFirstPage && !isOnAlreadyUsedPage && (
          <button 
            onClick={goToNextQuestion}
            className="float-right bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded cursor-pointer">
              Let's Go
          </button>
        )}
        {currentQuestionIndex > 0 && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
          <button 
            onClick={goToPreviousQuestion}
            className="float-left bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded cursor-pointer">
              Previous Question
          </button>
        )}
        {currentQuestionIndex < totalQuestions - 1 && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
          <button 
            onClick={goToNextQuestion}
            disabled={!isResponseProvided && formObject.questions[currentQuestionIndex].mandatory}
            className={`float-right bg-transparent py-2 px-4 border border-green-500 rounded ${!isResponseProvided && formObject.questions[currentQuestionIndex].mandatory ? 'text-green-700 font-semibold opacity-50 cursor-not-allowed' : 'hover:bg-green-500 text-green-700 font-semibold hover:text-white cursor-pointer'}`}>
              Next Question
          </button>
        )}
        {currentQuestionIndex === totalQuestions - 1 && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
          <button 
            onClick={goToSubmitPage}
            disabled={!isResponseProvided && formObject.questions[currentQuestionIndex].mandatory}
            className={`float-right bg-transparent py-2 px-4 border border-green-500 rounded ${!isResponseProvided && formObject.questions[currentQuestionIndex].mandatory ? 'text-green-700 font-semibold opacity-50 cursor-not-allowed' : 'hover:bg-green-500 text-green-700 font-semibold hover:text-white cursor-pointer'}`}>
              Submit
          </button>
        )}
        {currentQuestionIndex < totalQuestions - 1 && !formObject.questions[currentQuestionIndex].mandatory && !isSkippedResponse && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
          <button
            onClick={() => {
              handleUserInput([-1]); // Set the response to -1
              goToNextQuestion();
            }}
            className="float-right mr-5 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">
              Skip
          </button>
        )}
        {currentQuestionIndex === totalQuestions - 1 && !formObject.questions[currentQuestionIndex].mandatory && !isSkippedResponse && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
          <button
            onClick={() => {
              handleUserInput([-1]); // Set the response to -1
              goToSubmitPage();
            }}
            className="float-right mr-5 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer"
          >
            Skip and Submit
          </button>
        )}
        {!formObject.questions[currentQuestionIndex].mandatory && isSkippedResponse && !isOnFirstPage && !isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
          <button
            onClick={() => {
              let initialValue: any;

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
            className="float-right mr-5 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer"
          >
            Don't Skip
          </button>
        )}
        {!isOnFirstPage && isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
          <button 
            onClick={goToPreviousQuestion}
            className="float-left bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded cursor-pointer"
          >
            Not Quite Done Yet
          </button>
        )}
        {!isOnFirstPage && isOnSubmitPage && !isOnFinalPage && !isOnAlreadyUsedPage && (
          <button 
            onClick={submitAnswers}
            className="float-right bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded cursor-pointer"
          >
            Submit My Answers
          </button>
        )}
        {/* Not working (browser limitation)
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
        ) : null // Render null if none of the conditions are true */}
      </div>
      {/* //Can be used to log the userResponses-array
        <button onClick={() => console.log(userResponses)}>Log User Responses</button>
      */}
    </div>
  );
}