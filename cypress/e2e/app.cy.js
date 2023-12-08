/*
import AgreeDisagree from '../../src/app/[user]/[project]/[form]/[tokenId]/AgreeDisagreeComponent'
import AlreadyUsedPage from '../../src/app/[user]/[project]/[form]/[tokenId]/AlreadyUsedPageComponent'
import FinalPage from '../../src/app/[user]/[project]/[form]/[tokenId]/FinalPageComponent'
import FirstPage from '../../src/app/[user]/[project]/[form]/[tokenId]/FirstPageComponent'
import FormRenderer from '../../src/app/[user]/[project]/[form]/[tokenId]/FormRenderer'
import MultipleChoice from '../../src/app/[user]/[project]/[form]/[tokenId]/MultipleChoiceComponent'
import Page from '../../src/app/[user]/[project]/[form]/[tokenId]/page'
import Skipped from '../../src/app/[user]/[project]/[form]/[tokenId]/SkippedComponent'
import Slider from '../../src/app/[user]/[project]/[form]/[tokenId]/SliderComponent'
import SubmitPage from '../../src/app/[user]/[project]/[form]/[tokenId]/SubmitPageComponent'
import TextInput from '../../src/app/[user]/[project]/[form]/[tokenId]/TextInputComponent'
*/

describe('About Us page', () => {
  it('Navigates to About Us page', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.flex-center > :nth-child(3)').click() // About us page

    cy.url().should('eq', 'http://localhost:3000/about');
  })
})

describe('Register page', () => {
  it('Navigates to Register page and creates a user; "Testing"', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.flex-between > .flex-center > :nth-child(2)').click() // Register page

    cy.url().should('eq', 'http://localhost:3000/register');

    cy.get('#username').type('Testing')
    cy.get('#password').type('Testing')
    cy.get('#repeatPassword').type('Testing')
    cy.get('div.mt-2 > .w-full').click() // Register button

    cy.get('.Toastify__toast-body > :nth-child(2)').contains('Registered Testing')
  })
})

describe('Register page', () => {
  it('Navigates to Register page and creates another user; "Testing"', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.flex-between > .flex-center > :nth-child(2)').click() // Register page

    cy.url().should('eq', 'http://localhost:3000/register');

    cy.get('#username').type('Testing')
    cy.get('#password').type('Testing')
    cy.get('#repeatPassword').type('Testing')
    cy.get('div.mt-2 > .w-full').click() // Register button
    cy.get('.error').contains('Username already exists')

    cy.url().should('eq', 'http://localhost:3000/register');
  })
})

describe('Login page', () => {
  it('Navigates to Login page and tries to login with user; "Testing"', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.flex-between > .flex-center > :nth-child(1)').click() // Login page

    cy.url().should('eq', 'http://localhost:3000/login');

    cy.get('#username').type('Testing')
    cy.get('#password').type('Testing')
    cy.get('div.mt-2 > .w-full').click() // Login button

    cy.url().should('eq', 'http://localhost:3000/projectCreation');
  })
})