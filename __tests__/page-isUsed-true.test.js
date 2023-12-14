import AgreeDisagree from '@/app/(guest)/[user]/[project]/[form]/[tokenId]/AgreeDisagreeComponent'
import AlreadyUsedPage from '@/app/(guest)/[user]/[project]/[form]/[tokenId]/AlreadyUsedPageComponent'
import FinalPage from '@/app/(guest)/[user]/[project]/[form]/[tokenId]/FinalPageComponent'
import FirstPage from '@/app/(guest)/[user]/[project]/[form]/[tokenId]/FirstPageComponent'
import FormRenderer from '@/app/(guest)/[user]/[project]/[form]/[tokenId]/FormRenderer'
import MultipleChoice from '@/app/(guest)/[user]/[project]/[form]/[tokenId]/MultipleChoiceComponent'
import Page from '@/app/(guest)/[user]/[project]/[form]/[tokenId]/page'
import Skipped from '@/app/(guest)/[user]/[project]/[form]/[tokenId]/SkippedComponent'
import Slider from '@/app/(guest)/[user]/[project]/[form]/[tokenId]/SliderComponent'
import SubmitPage from '@/app/(guest)/[user]/[project]/[form]/[tokenId]/SubmitPageComponent'
import TextInput from '@/app/(guest)/[user]/[project]/[form]/[tokenId]/TextInputComponent'

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
         * First page (make sure "isUsed"-boolean is set to true when starting)
         */
        await act(() => {
            render(<Page
                params={params}
            />)
        });

        let h1List = screen.getAllByRole('heading', {level: 1})
        let p = document.querySelector('p')
        let h3List = screen.getAllByRole('heading', {level: 3})
        
        expect(h1List[0]).toHaveTextContent('20-10');
        expect(p).toHaveTextContent('Dette er en beskrivelse af 20-10');
    
        expect(h1List[1]).toHaveTextContent('This link has already submitted answers!');

        expect(h3List[0]).toHaveTextContent('If you have not yet answered, you should contact your project leader for a new link.');
        expect(h3List[1]).toHaveTextContent('However, if you have answered the questions already, you can safely close this page.');
        expect(h3List[2]).toHaveTextContent('Thank you again!');

    })
})