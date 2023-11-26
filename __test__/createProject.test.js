import { act, render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProjectPage from '@/app/projectCreation/page'
import {renderHook} from '@testing-library/react'

/*
describe("ProjectPage",()=>{

    test('sets title in newProject', () => {
        render(<ProjectPage />);
    
        // Assuming your button has a specific text or another identifier
        const createNewButton = screen.getByText('+');

        // Trigger the button click event
        fireEvent.click(createNewButton);
    
        // Now, you can find the input field for the title
        const titleInput = screen.getByPlaceholderText('Project Name');
    
        // Assuming you have some specific title
        const testTitle = 'Test Project';
    
        // Set the value in the input field
        fireEvent.change(titleInput, { target: { value: testTitle } });
    
        const newProjectTitle = screen.getByText(testTitle);

        expect(newProjectTitle).toBeInTheDocument();
      });
    
})
*/

describe("ProjectPage",()=>{

    jest.setTimeout(30000);
    it('renders correct content', async () => {

        /**
         * First page (make sure "isUsed"-boolean is set to false when starting)
         */
        await act(() => {
            render(<ProjectPage />)
        })
    })})