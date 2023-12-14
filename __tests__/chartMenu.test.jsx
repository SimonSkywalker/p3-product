import ChartMenu from "@/app/(admin)/[user]/[project]/chart/page"
import userEvent from "@testing-library/user-event"
import '@testing-library/react';
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import {expect, jest, test} from '@jest/globals'
import { useRouter } from "next/navigation"
import { APIHandle } from "@/app/(admin)/classes/handlerClass"
import { TokenValidator } from "@/app/(admin)/classes/tokenClass";
import { useState } from "react";
import {server} from '../mocks/server'

const params ={ 
    params:{
    user: 'Test2', 
    project: 'Project-1', 
}}

describe("ChartMenu",()=>{
  window.alert = jest.fn();

    it("render menu", async ()=>{
      const user = userEvent.setup()
      const mockPush = jest.fn();
        useRouter.mockReturnValue({ push: mockPush });
        // Mock APIHandle.APIRequestUser to resolve with sample data


        // Render the component
        render(<ChartMenu params={params} />);
        const formSelect = await screen.findByTitle('FirstFormS');
        const options = formSelect.childNodes
        // Assert that the default option is rendered
        await expect(formSelect).toHaveValue(options[0].value);
        await waitFor(async()=>{
          // Wait for the select options to be available
          user.selectOptions(formSelect, '20-10');
        expect(formSelect).toHaveValue('20-10');
        })


        // Assert that other options are rendered
        const roles = ['role1', 'role2', 'role3'];

       await waitFor(()=>{
      
        roles.forEach(async (role) => {
          const rolesCheckbox = await screen.getByLabelText(role, { exact: false, selector: 'input[type="checkbox"]' });
          expect(rolesCheckbox).toBeInTheDocument();
        });
 
      
      })
        // Change the value of the select and assert the change
        
      
    })
    
})