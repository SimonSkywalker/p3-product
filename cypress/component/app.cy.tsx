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

describe('Page.cy.tsx', () => {
  it('playground', () => {
    cy.mount(<FirstPage />)
    cy.get('h1').should('have.text', 'Welcome!')
    cy.get('h3').should('have.text', 'Please press the "Let\'s Go"-button when you are ready to begin.')
  })
})