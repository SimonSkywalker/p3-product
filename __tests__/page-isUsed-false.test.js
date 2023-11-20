import AgreeDisagree from '../src/app/[user]/[project]/[form]/[tokenId]/AgreeDisagreeComponent'
import AlreadyUsedPage from '../src/app/[user]/[project]/[form]/[tokenId]/AlreadyUsedPageComponent'
import FinalPage from '../src/app/[user]/[project]/[form]/[tokenId]/FinalPageComponent'
import FirstPage from '../src/app/[user]/[project]/[form]/[tokenId]/FirstPageComponent'
import FormRenderer from '../src/app/[user]/[project]/[form]/[tokenId]/FormRenderer'
import MultipleChoice from '../src/app/[user]/[project]/[form]/[tokenId]/MultipleChoiceComponent'
import Page from '../src/app/[user]/[project]/[form]/[tokenId]/page'
import Skipped from '../src/app/[user]/[project]/[form]/[tokenId]/SkippedComponent'
import Slider from '../src/app/[user]/[project]/[form]/[tokenId]/SliderComponent'
import SubmitPage from '../src/app/[user]/[project]/[form]/[tokenId]/SubmitPageComponent'
import TextInput from '../src/app/[user]/[project]/[form]/[tokenId]/TextInputComponent'

//import Slider from "rc-slider";

import { act, render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

const params = {
    user: 'sinagaming69', 
    project: 'burger', 
    form: '20-10', 
    tokenId: 'tokenId1'
}

describe('page.tsx', () => {
    jest.setTimeout(30000);
    it('renders correct content', async () => {

        /**
         * First page (make sure "isUsed"-boolean is set to false when starting)
         */
        await act(() => {
            render(<Page
                params={params}
            />)
        });

        //https://github.com/testing-library/dom-testing-library/issues/1234
        let p = document.querySelector('p')
        let h1List = screen.getAllByRole('heading', {level: 1})
        let h3 = screen.getByRole('heading', {level: 3})
        let letsGoButton = screen.getByRole('button')

        expect(p).toHaveTextContent('Dette er en beskrivelse af 20-10');

        expect(h1List).toHaveLength(2); // Ensure there are two h1 elements
    
        // Check the content of each h1 element
        expect(h1List[0]).toHaveTextContent('20-10');
        expect(h1List[1]).toHaveTextContent('Welcome!');

        expect(h3).toHaveTextContent('Please press the "Let\'s Go"-button when you are ready to begin.');

        expect(letsGoButton).toHaveTextContent('Let\'s Go');
    
        await act(() => {
            fireEvent.click(letsGoButton);
        });

        /**
         * Radio buttons page
         */

        let questionSpan = document.querySelector('span')
        let radioButtons = screen.getAllByRole('radio')
        let nextButton = screen.getByRole('button', { name: 'Next' })
        h3 = screen.getByRole('heading', {level: 3})

        expect(questionSpan).toHaveTextContent('Question 1 of 5');
        expect(h3).toHaveTextContent('Test af Multiple Choice (radio buttons)*');

        expect(nextButton).toHaveTextContent('Next');
        expect(nextButton).toBeDisabled();

        for (let i = 0; i < radioButtons.length; i++) {
            // Expect the radio button to initially not be checked
            expect(radioButtons[i]).not.toBeChecked();
        }

        for (let i = 0; i < radioButtons.length; i++) {
            // Simulate a click on the radio button
            fireEvent.click(radioButtons[i]);
          
            // Expect the clicked radio button to be checked
            expect(radioButtons[i]).toBeChecked();
          
            // Expect all other radio buttons to not be checked
            for (let j = 0; j < radioButtons.length; j++) {
                if (j !== i) {
                    expect(radioButtons[j]).not.toBeChecked();
                }
            }
        }
        
        expect(nextButton).toHaveTextContent('Next');
        expect(nextButton).not.toBeDisabled();

        await act(() => {
            fireEvent.click(nextButton);
        });

        /**
         * Checkbox buttons page
         */

        let previousButton = screen.getByRole('button', { name: 'Previous' })
        let skipButton = screen.getByRole('button', { name: 'Skip' })
        nextButton = screen.getByRole('button', { name: 'Next' })
        let checkBoxes = screen.getAllByRole('checkbox')
        h3 = screen.getByRole('heading', {level: 3})

        expect(questionSpan).toHaveTextContent('Question 2 of 5');
        expect(h3).toHaveTextContent('Test af Multiple Choice (checkboxes)');

        expect(previousButton).toHaveTextContent('Previous');
        expect(previousButton).not.toBeDisabled();
        expect(skipButton).toHaveTextContent('Skip');
        expect(skipButton).not.toBeDisabled();
        expect(nextButton).toHaveTextContent('Next');
        expect(nextButton).not.toBeDisabled();

        for (let i = 0; i < checkBoxes.length; i++) {
            // Expect the checkboxes to initially not be checked
            expect(checkBoxes[i]).not.toBeChecked();
        }

        for (let i = 0; i < checkBoxes.length; i++) {
            // Simulate a click on the radio button
            fireEvent.click(checkBoxes[i]);
          
            // Expect the clicked radio button to be checked
            expect(checkBoxes[i]).toBeChecked();
        }

        for (let i = 0; i < checkBoxes.length; i++) {
            // Expect the checkboxes to all be checked
            expect(checkBoxes[i]).toBeChecked();
        }

        /**
         * Go back to radio buttons page and back again
         */

        await act(() => {
            fireEvent.click(previousButton);
        });

        nextButton = screen.getByRole('button', { name: 'Next' })
        h3 = screen.getByRole('heading', {level: 3})

        expect(questionSpan).toHaveTextContent('Question 1 of 5');
        expect(h3).toHaveTextContent('Test af Multiple Choice (radio buttons)*');

        await act(() => {
            fireEvent.click(nextButton);
        });

        previousButton = screen.getByRole('button', { name: 'Previous' })
        skipButton = screen.getByRole('button', { name: 'Skip' })
        nextButton = screen.getByRole('button', { name: 'Next' })
        h3 = screen.getByRole('heading', {level: 3})

        expect(questionSpan).toHaveTextContent('Question 2 of 5');
        expect(h3).toHaveTextContent('Test af Multiple Choice (checkboxes)');

        for (let i = 0; i < checkBoxes.length; i++) {
            // Expect the checkboxes to all be checked
            expect(checkBoxes[i]).toBeChecked();
        }

        /**
         * Check if skip button is working
         */

        await act(() => {
            fireEvent.click(skipButton);
        });

        previousButton = screen.getByRole('button', { name: 'Previous' })
        skipButton = screen.getByRole('button', { name: 'Skip' })
        nextButton = screen.getByRole('button', { name: 'Next' })
        h3 = screen.getByRole('heading', {level: 3})

        expect(questionSpan).toHaveTextContent('Question 3 of 5');
        expect(h3).toHaveTextContent('Test af Slider (agreeDisagree)');

        /**
         * Go back to checkboxes buttons page and check if "skip" worked
         */

        await act(() => {
            fireEvent.click(previousButton);
        });

        previousButton = screen.getByRole('button', { name: 'Previous' })
        let dontSkipButton = screen.getByRole('button', { name: 'Don\'t Skip' })
        nextButton = screen.getByRole('button', { name: 'Next' })
        h3 = screen.getByRole('heading', {level: 3})

        expect(questionSpan).toHaveTextContent('Question 2 of 5');
        expect(h3).toHaveTextContent('Test af Multiple Choice (checkboxes)');

        expect(screen.queryByText('You have choosen to skip this question.')).toBeTruthy();
        expect(screen.queryByText('You can click the "Don\'t Skip"-button if you want to answer the question.')).toBeTruthy();

        expect(dontSkipButton).toHaveTextContent('Don\'t Skip');

        /**
         * Check Don't Skip button
         */

        await act(() => {
            fireEvent.click(dontSkipButton);
        });

        previousButton = screen.getByRole('button', { name: 'Previous' })
        skipButton = screen.getByRole('button', { name: 'Skip' })
        nextButton = screen.getByRole('button', { name: 'Next' })
        h3 = screen.getByRole('heading', {level: 3})

        expect(questionSpan).toHaveTextContent('Question 2 of 5');
        expect(h3).toHaveTextContent('Test af Multiple Choice (checkboxes)');

        /**
         * AgreeDisagree (9 steps)
         */

        await act(() => {
            fireEvent.click(nextButton);
        });

        previousButton = screen.getByRole('button', { name: 'Previous' })
        skipButton = screen.getByRole('button', { name: 'Skip' })
        nextButton = screen.getByRole('button', { name: 'Next' })
        h3 = screen.getByRole('heading', {level: 3})
        let sliderText = document.getElementById('exp')

        expect(questionSpan).toHaveTextContent('Question 3 of 5');
        expect(h3).toHaveTextContent('Test af Slider (agreeDisagree)');

        expect(sliderText).toHaveTextContent('Neutral');

        /* Unit test (Does not work with 0, since value should start at 1)
        await act(() => {
            fireEvent.change(screen.getByRole('slider'), { target: { value: '0' }})
        });
        expect(screen.getByRole('slider')).toHaveValue('0');
        */

        await act(() => {
            fireEvent.change(screen.getByRole('slider'), { target: { value: '1' }})
        });
        expect(screen.getByRole('slider')).toHaveValue('1');
        expect(sliderText).toHaveTextContent('Strongly Disagree');

        await act(() => {
            fireEvent.change(screen.getByRole('slider'), { target: { value: '2' }})
        });
        expect(screen.getByRole('slider')).toHaveValue('2');
        expect(sliderText).toHaveTextContent('Disagree');

        await act(() => {
            fireEvent.change(screen.getByRole('slider'), { target: { value: '3' }})
        });
        expect(screen.getByRole('slider')).toHaveValue('3');
        expect(sliderText).toHaveTextContent('Moderately Disagree');

        await act(() => {
            fireEvent.change(screen.getByRole('slider'), { target: { value: '4' }})
        });
        expect(screen.getByRole('slider')).toHaveValue('4');
        expect(sliderText).toHaveTextContent('Slightly Disagree');

        await act(() => {
            fireEvent.change(screen.getByRole('slider'), { target: { value: '5' }})
        });
        expect(screen.getByRole('slider')).toHaveValue('5');
        expect(sliderText).toHaveTextContent('Neutral');

        await act(() => {
            fireEvent.change(screen.getByRole('slider'), { target: { value: '6' }})
        });
        expect(screen.getByRole('slider')).toHaveValue('6');
        expect(sliderText).toHaveTextContent('Slightly Agree');

        await act(() => {
            fireEvent.change(screen.getByRole('slider'), { target: { value: '7' }})
        });
        expect(screen.getByRole('slider')).toHaveValue('7');
        expect(sliderText).toHaveTextContent('Moderately Agree');

        await act(() => {
            fireEvent.change(screen.getByRole('slider'), { target: { value: '8' }})
        });
        expect(screen.getByRole('slider')).toHaveValue('8');
        expect(sliderText).toHaveTextContent('Agree');

        await act(() => {
            fireEvent.change(screen.getByRole('slider'), { target: { value: '9' }})
        });
        expect(screen.getByRole('slider')).toHaveValue('9');
        expect(sliderText).toHaveTextContent('Strongly Agree');

        /* Unit test (Does not work with 10, if there is only 9 steps)
        await act(() => {
            fireEvent.change(screen.getByRole('slider'), { target: { value: '10' }})
        });
        expect(screen.getByRole('slider')).toHaveValue('10');
        */

        /**
         * Slider values (3 steps)
         */

        await act(() => {
            fireEvent.click(nextButton);
        });

        previousButton = screen.getByRole('button', { name: 'Previous' })
        skipButton = screen.getByRole('button', { name: 'Skip' })
        nextButton = screen.getByRole('button', { name: 'Next' })
        h3 = screen.getByRole('heading', {level: 3})

        expect(questionSpan).toHaveTextContent('Question 4 of 5');
        expect(h3).toHaveTextContent('Test af Slider (values)');

        expect(screen.getByRole('slider')).toHaveValue('2');

        /* Unit test (Does not work with 0, since value should start at 1)
        await act(() => {
            fireEvent.change(screen.getByRole('slider'), { target: { value: '0' }})
        });
        expect(screen.getByRole('slider')).toHaveValue('0');
        */

        await act(() => {
            fireEvent.change(screen.getByRole('slider'), { target: { value: '1' }})
        });
        expect(screen.getByRole('slider')).toHaveValue('1');

        await act(() => {
            fireEvent.change(screen.getByRole('slider'), { target: { value: '2' }})
        });
        expect(screen.getByRole('slider')).toHaveValue('2');

        await act(() => {
            fireEvent.change(screen.getByRole('slider'), { target: { value: '3' }})
        });
        expect(screen.getByRole('slider')).toHaveValue('3');

        /* Unit test (Does not work with 4, if there is only 3 steps)
        await act(() => {
            fireEvent.change(screen.getByRole('slider'), { target: { value: '4' }})
        });
        expect(screen.getByRole('slider')).toHaveValue('4');
        */

        /**
         * Skipping and text input test
         */

        await act(() => {
            fireEvent.click(skipButton);
        });

        previousButton = screen.getByRole('button', { name: 'Previous' })
        skipButton = screen.getByRole('button', { name: 'Skip' })
        let submitButton = screen.getByRole('button', { name: 'Submit' })
        h3 = screen.getByRole('heading', {level: 3})
        let textField = screen.getByRole('textbox')

        expect(questionSpan).toHaveTextContent('Question 5 of 5');
        expect(h3).toHaveTextContent('Test af Text Input');

        expect(submitButton).toHaveTextContent('Submit');

        await act(() => {
            fireEvent.change(textField, {target: {value: 'Hej med dig!'}})
        });
        expect(textField).toHaveTextContent('Hej med dig!');

        /**
         * About to submit page
         */

        await act(() => {
            fireEvent.click(submitButton);
        });

        h1List = screen.getAllByRole('heading', {level: 1})
        let h3List = screen.getAllByRole('heading', {level: 3})
        let goBackButton = screen.getByRole('button', { name: 'Go Back' })
        let submitMyAnswersButton = screen.getByRole('button', { name: 'Submit My Answers' })

        expect(h1List[1]).toHaveTextContent('🥳 Congratulations! 🥳');

        expect(h3List[0]).toHaveTextContent('You answered all the questions.');
        expect(h3List[1]).toHaveTextContent('Please click the "Submit My Answers"-button when you want to submit your answers.');

        expect(goBackButton).toHaveTextContent('Go Back');
        expect(submitMyAnswersButton).toHaveTextContent('Submit My Answers');

        /**
         * Test go back on submit page
         */

        await act(() => {
            fireEvent.click(goBackButton);
        });

        previousButton = screen.getByRole('button', { name: 'Previous' })
        skipButton = screen.getByRole('button', { name: 'Skip' })
        submitButton = screen.getByRole('button', { name: 'Submit' })
        h3 = screen.getByRole('heading', {level: 3})
        textField = screen.getByRole('textbox')

        expect(questionSpan).toHaveTextContent('Question 5 of 5');
        expect(h3).toHaveTextContent('Test af Text Input');

        expect(textField).toHaveTextContent('Hej med dig!');

        /**
         * Submitting answers
         */

        await act(() => {
            fireEvent.click(submitButton);
        });

        h1List = screen.getAllByRole('heading', {level: 1})
        h3List = screen.getAllByRole('heading', {level: 3})
        goBackButton = screen.getByRole('button', { name: 'Go Back' })
        submitMyAnswersButton = screen.getByRole('button', { name: 'Submit My Answers' })

        expect(h1List[1]).toHaveTextContent('🥳 Congratulations! 🥳');

        expect(h3List[0]).toHaveTextContent('You answered all the questions.');
        expect(h3List[1]).toHaveTextContent('Please click the "Submit My Answers"-button when you want to submit your answers.');

        expect(submitMyAnswersButton).toHaveTextContent('Submit My Answers');

        /**
         * When submitted
         */

        await act(() => {
            fireEvent.click(submitMyAnswersButton);
        });

        h1List = screen.getAllByRole('heading', {level: 1})
        h3 = screen.getByRole('heading', {level: 3})

        expect(h1List[1]).toHaveTextContent('🎉 You have submitted your answers! 🎉');

        expect(h3).toHaveTextContent('You can now close this page. Thank you for your time!');

    })
})