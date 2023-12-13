"use client"
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/react';
import '@testing-library/jest-dom'
import LoginPage from '@/app/(admin)/login/page'
import {renderHook} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { loginFormSchema } from '@/app/(admin)/lib/validations/loginForm'
import {expect, jest, test} from '@jest/globals'
import { useRouter } from "next/navigation";
//const useRouter = jest.fn()
describe("LoginPage",()=>{
    
    it('Username named filled with userdata that is formatted correctly', async() => {

        const user = userEvent.setup();
    
        render(<LoginPage />); 
        
        const Username = screen.getByLabelText("Username") // ACT
        await user.type(Username,'Simona')

        const password = screen.getByLabelText("Password") // ACT
        await user.type(password,'Secret')

        const submitB = screen.getByTitle('submitButton')
        await user.click(submitB);
        
        expect(await screen.queryByText('String must contain at least 3 character(s)')).toBeNull();
        expect(await screen.queryByText('String must contain at least 5 character(s)')).toBeNull();
      
     
    })

    it('Username named filled with userdata that is formatted wrong', async() => {

        const user = userEvent.setup();

        render(<LoginPage />); 
        
        const username = screen.getByLabelText("Username") // ACT
        await user.type(username,'Si')
        //expect(username).toHaveValue('Si') // ASSERT

        const password = screen.getByLabelText("Password") // ACT
        await user.type(password,'Secret')
        //expect(password).toHaveValue('Secret') // ASSERT

        const submitB = screen.getByTitle('submitButton')
        await user.click(submitB);
        
        expect(await screen.queryByText('String must contain at least 3 character(s)')).toBeInTheDocument();
       
        
    })

    it('Password filled with userdata that is formatted wrong', async () =>{
        const user = userEvent.setup();
        render(<LoginPage />); 
        
        const Username = screen.getByLabelText("Username") // ACT
        await user.type(Username,'Simona')

        const password = screen.getByLabelText("Password") // ACT
        await user.type(password,'Sec')

        const submitB = screen.getByTitle('submitButton')
        await user.click(submitB);
        expect(await screen.queryByText('String must contain at least 5 character(s)')).toBeInTheDocument();

    })

    it('Should navgiate to to the next page given the right user',async() => {

        const user = userEvent.setup();
        const mockPush = jest.fn();

    // Set up the useRouter mock implementation
    useRouter.mockReturnValue({ push: mockPush });
        render(<LoginPage />); 
        
        const Username = screen.getByLabelText("Username") // ACT
        await user.type(Username,'Test2')

        const password = screen.getByLabelText("Password") // ACT
        await user.type(password,'12345')

        const submitB = screen.getByTitle('submitButton')
        await user.click(submitB);
        
       

        expect(await screen.queryByText('String must contain at least 3 character(s)')).toBeNull();
        expect(await screen.queryByText('String must contain at least 5 character(s)')).toBeNull();

        waitFor(async () => {
            expect(screen.getByLabelText('Username')).toHaveValue('Test2');
            expect(screen.getByLabelText('Password')).toHaveValue('12345');
            expect(useRouter).toHaveBeenCalled(); // Make sure useRouter is called
            expect(mockPush).toHaveBeenCalledWith('/projectCreation'); // Check the push call
        });
     
    })
    
        
})
