import { render, screen } from '@testing-library/react'
import RegisterPage from '@/app/register/page'

describe("RegisterPage",()=>{
    
    it('should create a user if given the right input', () => {

        render(<RegisterPage />) //ARRANGE
    
        const myElem = screen.getByText('Register') // ACT
    
        expect(myElem).toBeInTheDocument() // ASSERT
    })
    


    
})
