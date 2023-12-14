import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/react';
import '@testing-library/jest-dom'
import RegisterPage from '@/app/(admin)/register/page'
import {renderHook} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { registerFormSchema } from '@/app/(admin)/lib/validations/registerForm'
import {expect, jest, test} from '@jest/globals'
import { act } from 'react-dom/test-utils';
import { useRouter } from "next/navigation";
import { APIHandle } from '@/app/(admin)/classes/handlerClass';
describe("RegisterPage",()=>{
    
    it('Username named filled with userdata that is formatted correctly', async() => {

        const user = userEvent.setup();
        const mockPush = jest.fn();

        useRouter.mockReturnValue({ push: mockPush });
        APIHandle.APIRequestRegister = jest.fn().mockImplementation(() => Promise.resolve());

        await act(()=>{
            render(<RegisterPage />); 
        })        
        const Username = screen.getByLabelText("Username") // ACT
        await user.type(Username,'Simona')

        const password = screen.getByLabelText("Password") // ACT
        await user.type(password,'Secret')

        const confirmPassword = screen.getByLabelText("Confirm Password") // ACT
        await user.type(confirmPassword,'Secret')

        const submitB = screen.getByTitle('submitButton')
        await user.click(submitB);
        
        expect(await screen.queryByText('String must contain at least 3 character(s)')).toBeNull();
        expect(await screen.queryByText('String must contain at least 5 character(s)')).toBeNull();
        expect(await screen.queryByText('String must contain at least 5 character(s)')).toBeNull();
        await waitFor( () => {
    
            expect(mockPush).toHaveBeenCalledWith('/login'); // Check the push call
        });
    })

    it('Username named filled with userdata that is formatted wrong', async() => {

        const user = userEvent.setup();

        render(<RegisterPage />); 
        
        const username = screen.getByLabelText("Username") // ACT
        await user.type(username,'Si')
        //expect(username).toHaveValue('Si') // ASSERT

        const password = screen.getByLabelText("Password") // ACT
        await user.type(password,'Secret')
        //expect(password).toHaveValue('Secret') // ASSERT

        const confirmPassword = screen.getByLabelText("Confirm Password") // ACT
        await user.type(confirmPassword,'Secret')
        //expect(confirmPassword).toHaveValue('Secret') // ASSERT

        const submitB = screen.getByTitle('submitButton')
        await user.click(submitB);

        expect(await screen.queryByText('String must contain at least 3 character(s)')).toBeInTheDocument();
        await waitFor( () => {
            expect(mockPush).toHaveBeenCalledWith('/login'); // Check the push call
        });
        
    })

    it('Password filled with userdata that is formatted wrong', async () =>{
        const user = userEvent.setup();
        render(<RegisterPage />); 
        
        const Username = screen.getByLabelText("Username") // ACT
        await user.type(Username,'Simona')

        const password = screen.getByLabelText("Password") // ACT
        await user.type(password,'Sec')

        const confirmPassword = screen.getByLabelText("Confirm Password") // ACT
        await user.type(confirmPassword,'Sec')

        const submitB = screen.getByTitle('submitButton')
        await user.click(submitB);
        const errmsg = await screen.queryAllByText('String must contain at least 5 character(s)')
        expect(errmsg[0]).toBeInTheDocument();
        expect(errmsg[1]).toBeInTheDocument();
    })
    
        
})
