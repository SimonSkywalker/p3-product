import { fireEvent, render, screen } from '@testing-library/react'
import LoginPage from '@/app/login/page'
import {renderHook} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { loginFormSchema } from '@/app/lib/validations/loginForm'

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
        expect(username).toHaveValue('Si') // ASSERT

        const password = screen.getByLabelText("Password") // ACT
        await user.type(password,'Secret')
        expect(password).toHaveValue('Secret') // ASSERT

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
    
        
})
