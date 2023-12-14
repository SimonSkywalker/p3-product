import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react';
import '@testing-library/react';
import '@testing-library/jest-dom'
import LoginPage from '@/app/(admin)/login/page'
import {renderHook} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { loginFormSchema } from '@/app/(admin)/lib/validations/loginForm'
import {expect, jest, test} from '@jest/globals'
import { useRouter } from "next/navigation";
import { act } from 'react-dom/test-utils';
import {APIHandle} from '../src/app/(admin)/classes/handlerClass'
import {LoginException} from '../src/app/(admin)/exceptions/LoginException.ts'


describe("LoginPage",()=>{
    
    it('Username named filled with userdata that is formatted correctly', async() => {

        const user = userEvent.setup();
    
        await act(()=>{
            render(<LoginPage />); 
        })        
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

        await act(()=>{
            render(<LoginPage />); 
        })        
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
        await act(()=>{
            render(<LoginPage />); 
        })        
        const Username = screen.getByLabelText("Username") // ACT
        await user.type(Username,'Simona')

        const password = screen.getByLabelText("Password") // ACT
        await user.type(password,'Sec')

        const submitB = screen.getByTitle('submitButton')
        await user.click(submitB);
        expect(await screen.queryByText('String must contain at least 5 character(s)')).toBeInTheDocument();

    })
    it('Should not navgiate to to the next page given the wrong user',async() => {

        const user = userEvent.setup();
        const mockPush = jest.fn();

        // Set up the useRouter mock implementation
        useRouter.mockReturnValue({ push: mockPush });

        APIHandle.APIRequestLogin.mockRejectedValue(new LoginException('Wrong Credentials'));
        await act(()=>{
            render(<LoginPage />); 
        })
        
        const Username = screen.getByLabelText("Username") // ACT
        await user.type(Username,'Tes')

        const password = screen.getByLabelText("Password") // ACT
        await user.type(password,'12345')

        const submitB = screen.getByTitle('submitButton')
        await user.click(submitB);
        
       

        expect(await screen.queryByText('String must contain at least 3 character(s)')).toBeNull();
        expect(await screen.queryByText('String must contain at least 5 character(s)')).toBeNull();

        
        
        await waitFor(async () => {
            // Assert that the error message is displayed
            const errmsg = await screen.getByText('Wrong credentials, try again.')
            expect(errmsg).toBeInTheDocument();
          });
     
    })
    it('Should navgiate to to the next page given the right user',async() => {

        const user = userEvent.setup();
        const mockPush = jest.fn();

        // Set up the useRouter mock implementation
        useRouter.mockReturnValue({ push: mockPush });

        APIHandle.APIRequestLogin = jest.fn().mockImplementation(() => Promise.resolve({ token: 'mocked-token' }));
    
        await act(()=>{
            render(<LoginPage />); 
        })    
        const Username = screen.getByLabelText("Username") // ACT
        await user.type(Username,'Test2')

        const password = screen.getByLabelText("Password") // ACT
        await user.type(password,'12345')

        const submitB = screen.getByTitle('submitButton')
        await user.click(submitB);
        
       

        expect(await screen.queryByText('String must contain at least 3 character(s)')).toBeNull();
        expect(await screen.queryByText('String must contain at least 5 character(s)')).toBeNull();

        await waitFor( () => {
    
            expect(mockPush).toHaveBeenCalledWith('/projectCreation'); // Check the push call
        });
     
    })
    
    
        
})