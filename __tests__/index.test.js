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

import { act, mount, render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

const params = {
    user: 'sinagaming69', 
    project: 'burger', 
    form: '20-10', 
    tokenId: 'tokenId1'
}

describe('page.tsx', () => {
    it('renders correct content', async () => {

        /**
         * First page
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

        expect(p).toHaveTextContent(/Dette er en beskrivelse af 20-10/i);

        expect(h1List).toHaveLength(2); // Ensure there are two h1 elements
    
        // Check the content of each h1 element
        expect(h1List[0]).toHaveTextContent(/20-10/i);
        expect(h1List[1]).toHaveTextContent(/Welcome!/i);

        expect(h3).toHaveTextContent(/Please press the "Let's Go"-button when you are ready to begin./i);

        expect(letsGoButton).toHaveTextContent(/Let's Go/i);
    
        await act(() => {
            fireEvent.click(letsGoButton);
        });

        /**
         * Radio buttons page
         */

        let questionSpan = document.querySelector('span')
        let radioButtons = screen.getAllByRole('radio')
        let nextButton = screen.getByRole('button', { name: 'Next' })

        expect(questionSpan).toHaveTextContent(/Question 1 of 5/i);

        expect(nextButton).toHaveTextContent(/Next/i);
        expect(nextButton).toBeDisabled();

        for (let i = 0; i < radioButtons.length; i++) {
            // Expect the radio button to initially not be checked
            expect(radioButtons[i]).not.toBeChecked();
          
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
        
        expect(nextButton).toHaveTextContent(/Next/i);
        expect(nextButton).not.toBeDisabled();

        await act(() => {
            fireEvent.click(nextButton);
        });

        /**
         * Checkbox buttons page
         */

        let previousButton = screen.getByRole('button', { name: 'Previous' })
        let skipButton = screen.getByRole('button', { name: 'Skip' })

    })
})

/*
describe('AgreeDisagree', () => {
    it('renders correct content', () => {
        render(
            <AgreeDisagree
                //jsonData={}
                //onUserInput={} 
                //currentQuestionIndex={} 
                //userResponses={}
            />
        )
    })
})
*/

/*
describe('FirstPage', () => {
    it('renders correct content', () => {
        render(
            <FirstPage
                //params={params}
            />
        )
    
        const h1 = screen.getByRole('heading', {level: 1})
        const h3 = screen.getByRole('heading', {level: 3})
    
        expect(h1).toBeInTheDocument()
        expect(h1).toHaveTextContent(/Welcome!/i);

        expect(h3).toBeInTheDocument()
        expect(h3).toHaveTextContent(/Please press the "Let's Go"-button when you are ready to begin./i);
    })
})

describe('FinalPage', () => {
    it('renders correct content', () => {
        render(
            <FinalPage
                //params={params}
            />
        )
    
        const h1 = screen.getByRole('heading', {level: 1})
        const h3 = screen.getByRole('heading', {level: 3})
    
        expect(h1).toBeInTheDocument()
        expect(h1).toHaveTextContent(/🎉 You have submitted your answers! 🎉/i);
    
        expect(h3).toBeInTheDocument()
        expect(h3).toHaveTextContent(/You can now close this page. Thank you for your time!/i);
    })
})

describe('SubmitPage', () => {
    it('renders correct content', () => {
        render(
            <SubmitPage
                //params={params}
            />
        )
    
        const h1 = screen.getByRole('heading', {level: 1})
        const h3List = screen.getAllByRole('heading', {level: 3})
    
        expect(h1).toBeInTheDocument()
        expect(h1).toHaveTextContent(/🥳 Congratulations! 🥳/i);
    
        expect(h3List).toHaveLength(2); // Ensure there are two h3 elements

        // Check the content of each h3 element
        expect(h3List[0]).toHaveTextContent(/You answered all the questions./i);
        expect(h3List[1]).toHaveTextContent(/Please click the "Submit My Answers"-button when you want to submit your answers./i);
        
    })
})
*/