import DatabaseAccess from "@/app/formCreation/DatabaseAccess"
import Form from "@/app/formCreation/Form"
import {expect, jest, test} from '@jest/globals'
import _ from "lodash"
import z, { ZodError } from "zod";
import TokenBuilder from "@/app/formCreation/TokenBuilder"
import Token from "@/app/formCreation/Token"
import Question, { MultipleChoice, QuestionTypes, Slider } from "@/app/formCreation/question"
import FormBuilder from "@/app/formCreation/FormBuilder";
import FormValidator from "@/app/formCreation/FormValidator"

const testForm1 : Form = new Form();
testForm1.name = "work satisfaction";
const testForm2 : Form = new Form();
testForm2.name = "favorite movie";
const testForm3 : Form = new Form();
testForm3.name = "burger";

const forms : DatabaseAccess = new DatabaseAccess([testForm1, testForm2, testForm3]);


describe('databaseAccess', ()=>{

    it("Can correctly find a duplicate name in database", () => {
        //Testform 4 has a duplicate name
        const testForm4 : Form = new Form();
        testForm4.name = "favorite movie";
        //Testform 5 does not
        const testForm5 : Form = new Form();
        testForm5.name = "pizza";
        expect(forms.checkDuplicate(testForm4)).toEqual(true);
        expect(forms.checkDuplicate(testForm5)).toEqual(false);

    })

    it("Can correctly identify the index of an object with a name", () => {

        expect(forms.getIndexFromDatabase("work satisfaction")).toEqual(0);
        expect(forms.getIndexFromDatabase("favorite movie")).toEqual(1);
        expect(forms.getIndexFromDatabase("burger")).toEqual(2);

    })

    it("Can add an object to the database", () => {
        let beforeSize : number = forms.objects.length;
        let newForms : DatabaseAccess = _.cloneDeep(forms);
        const testForm4 : Form = new Form();
        testForm4.name = "pizza";
        newForms.addToDatabase(testForm4);
        //After adding, the number of objects should be 1 more than before
        expect(newForms.objects.length).toEqual(beforeSize+1);
        //After adding, the last object should be equal to the added object
        expect(newForms.objects[newForms.objects.length-1]).toEqual(testForm4);
    })

    it("Can remove an object from the database", () => {
        let beforeSize : number = forms.objects.length;
        let newForms : DatabaseAccess = _.cloneDeep(forms);

        newForms.removeFromDatabase("favorite movie");
        //After removal, the number of objects should be 1 smaller than before
        expect(newForms.objects.length).toEqual(beforeSize-1);
        expect(newForms.objects[0]).toEqual(forms.objects[0]);
        //Since the second object was removed, the new second object should be the old third object.
        expect(newForms.objects[1]).toEqual(forms.objects[2]);

    })

    it("When trying to remove an object that doesn't exist, nothing should happen", () => {
        let newForms : DatabaseAccess = _.cloneDeep(forms);

        newForms.removeFromDatabase("asfdsdsadas");
        expect(newForms).toEqual(forms);
    })

})



describe('TokenBuilder', () => {

    it("Can set the number of tokens to a non-negative amount", () => {
        const tokenBuilder : TokenBuilder = new TokenBuilder();
        tokenBuilder.setTokens(3);        
        expect(tokenBuilder.getTokens().length).toEqual(3);
        tokenBuilder.setTokens(5);
        expect(tokenBuilder.getTokens().length).toEqual(5);
        tokenBuilder.setTokens(3);
        expect(tokenBuilder.getTokens().length).toEqual(3);
        tokenBuilder.setTokens(0);
        expect(tokenBuilder.getTokens().length).toEqual(0);
        expect(()=>{tokenBuilder.setTokens(-1)}).toThrow();
    })

    it("Can get a token from an object with the same fields", () => {

        const correctObjects : any[] = [{_tokenID: "ptuihn325467", _isUsed: false}, {_tokenID: "werewtgdfds", _isUsed: true}, {_tokenID: "56789oytres", _isUsed: false}]
        const tokenBuilder : TokenBuilder = new TokenBuilder();
        const tokens : Token[] = tokenBuilder.TokenFromObjects(correctObjects);
        for(let i = 0; i < tokens.length; i++){
            expect(tokens[i]).toBeInstanceOf(Token);
            expect(tokens[i].tokenID).toEqual(correctObjects[i]._tokenID);
        }
    })
    
    it("Throws an error if the objects do not have the exact fields", () => {
        const tokenBuilder : TokenBuilder = new TokenBuilder();
        const wrongObjects : any[] = [{_tokenID: "ptuihn325467"}, {_tokenID: "werewtgdfds", _isUsed: true}, {_tokenID: "56789oytres", _isUsed: false}]
        expect(()=>{tokenBuilder.TokenFromObjects(wrongObjects)}).toThrow();
    })
})

describe('Form', () => {

    it("Can add new questions of all 3 types", () => {
        const testForm : Form = new Form;
        testForm.addQuestion(QuestionTypes.multipleChoice);
        testForm.addQuestion(QuestionTypes.slider);
        testForm.addQuestion(QuestionTypes.textInput);
        expect(testForm.questions[0]).toBeInstanceOf(MultipleChoice);
        expect(testForm.questions[1]).toBeInstanceOf(Slider);
        expect(testForm.questions[2]).toBeInstanceOf(Question);
    })

    it("Can remove a single question and keep the others numbered correctly", () => {
        const testForm : Form = new Form;
        testForm.addQuestion(QuestionTypes.multipleChoice);
        testForm.addQuestion(QuestionTypes.slider);
        testForm.addQuestion(QuestionTypes.textInput);
        const beforeLength = testForm.questions.length;
        testForm.removeQuestion(1);
        expect(testForm.questions.length).toEqual(beforeLength - 1);
        expect(testForm.questions[0].questionType).toEqual(QuestionTypes.multipleChoice);
        expect(testForm.questions[0].number).toEqual(1);
        expect(testForm.questions[1].questionType).toEqual(QuestionTypes.textInput);
        expect(testForm.questions[1].number).toEqual(2);
    })

    it("Can turn spaces into dashes and assure there are none in the edges", () => {
        const testForm : Form = new Form;
        testForm.name = "Hee hee hoo hoo";
        testForm.cleanName();
        expect(testForm.name).toEqual("Hee-hee-hoo-hoo");
        testForm.name = "             yahoo  Itsa me          ";
        testForm.cleanName();
        expect(testForm.name).toEqual("yahoo--Itsa-me");
        testForm.name ="This is a test-form";
        testForm.cleanName();
        expect(testForm.name).toEqual("This-is-a-test\\-form");
    })

    it("Can display name where \\- is a dash and a dash is a space", () => {
        const testForm : Form = new Form;
        testForm.name = "Hee-hee-hoo-hoo";
        expect(testForm.getUncleanName()).toEqual("Hee hee hoo hoo");
        testForm.name = "This-is-a-test\\-form";
        expect(testForm.getUncleanName()).toEqual("This is a test-form");
    })

    it("Can create a child of itself with the exact same questions", () => {
        const testForm : Form = new Form;  
        testForm.addQuestion(QuestionTypes.multipleChoice);
        testForm.addQuestion(QuestionTypes.slider);
        testForm.addQuestion(QuestionTypes.textInput);
        testForm.questions[0].description = "foo";
        testForm.questions[1].description = "bar";
        testForm.questions[2].description = "foobar";

        const newForm : Form = testForm.createChild();
        expect(newForm.name).toEqual("Copy-of-Untitled-form");
        expect(newForm.questions).toEqual(testForm.questions);
    })

    it("Can find exact matches between questions", () => {

    })
})

describe('FormBuilder', () => {
    it("Can create a form from an object with the same fields as a from", () => {
        const formbuilder : FormBuilder = new FormBuilder;
        const object : any = {_name: "Testform", _description: "Yahoo", _questions: [new Question(QuestionTypes.textInput, 1), new MultipleChoice(2), new Slider(3)], _isActive: true, _tokens: [], _parent: "oldForm"};
        const testForm = formbuilder.formFromObject(object);
        expect(testForm.name).toEqual(object._name);
        expect(testForm.description).toEqual(object._description);
        expect(testForm.questions).toEqual(object._questions);
        expect(testForm.isActive).toEqual(object._isActive);
        expect(testForm.tokens).toEqual(object._tokens);
    })

    it("Throws an error if the fields are not exactly the same", () => {
        const formbuilder : FormBuilder = new FormBuilder;
        const object : any = {_name: "Testform", _description: "Yahoo", _questions: [new Question(QuestionTypes.textInput, 1), new Question(QuestionTypes.multipleChoice, 2), new Question(QuestionTypes.slider, 3)], _isActive: true, _tokens: [], _parent: "oldForm"};
        expect(()=> {formbuilder.formFromObject(object)}).toThrow();
    })
})

describe('FormValidator', () => {
    it("Throws an error if name is empty, has more than 127 characters, or has characters outside the danish alphabet, spaces and dashes", () => {
        const testForm : Form = new Form;
        expect(FormValidator.validateForm(testForm));
        testForm.name = "";
        expect(()=> {FormValidator.validateForm(testForm)}).toThrowError(ZodError);
        testForm.name = "´´-.´-.´´p"
        expect(()=> {FormValidator.validateForm(testForm)}).toThrowError(ZodError);
        testForm.name = "Gøød fårm"
        expect(FormValidator.validateForm(testForm));
        testForm.name = "oiewjrgihotrhgiorejgiojfdriobntioerhiterjziorjuriohreiogtrhizrhtuorehtgutnztzoneurihuodithrjuoitremtiorejrgiohntriojtrhipohthrnpoerjhipotrnmfipogtrjiro"
        expect(()=> {FormValidator.validateForm(testForm)}).toThrowError(ZodError);
    })

    it("Throws an error if the description has more than 1023 characters", () => {
        const testForm : Form = new Form;
        testForm.description = "RikwW0RKVjKqJvi7E9mgjefPLm0MJaqEijzz1wJ4jR9Qmt6C0mkL7vQP8QP7Z31W26gNEAqXY7FJpk8mhfRrtfYSXykZaQ4pVf5JXGt0VyiqgL99fehxBTgH65XepzhhEB6ve4trA6zxNct3SiahmL39iBEHEVyJeZtniRC1uM3CqbQKNRMwErE2xq5K38KUFdBJE8iLBvrhRL1tj8c7hfZChLhYF035X1DUX4WAECFTeYvdVizzEiKj5y2y9f2uu26gpMBnFr98QK4PE715ZwY33xT7GWM70j3y4ZcxqtNBnhkBWNu8iVeAuvUWWgzYVuyc3DDKnHSMyjWnD2R2DQqNKEpQ6pKzNdwckYqYuh7XzzDqGZYLpFqvSkaG1JTBeiLpzhK9HSX8UrFhhHgw0gjMCHR97hzg1JZmB4i1EuTn0gzJUtbEfRfGHW8nZ2bPGMq6NxMwCSXRJwafAgmB5YUf4XC6qKXQhghF5RfiBFEM0kCfwWUNB9ffRLcHa6Gq4UVUnwfPq2Nc9CNGi6HtK3Y06MRJKzq1wypmFzh9j7UUjuvGSz1yntUkuZ9rvSjjwk3NQVekFU3KUhhhJixFt7NA08Y2h4n8p7mAxhmcejXS19Z6nnffDz6ATcPF0TFdVnC2y7aHehq93DpXriHAQ0raYkC7G82KDvL04HBwkELhjtqnr9wRfwjZfn2tv5PDS8pfdPRCnkgp8AM1y3b8yNMnTSM0Pn6g2Xx2uhV687Ed9CqR5vCwJaxCrx7CfzqgH73yqxF4zSxGtGr5uLJPHd2DnTz8fS66Th9ZgWL9wRW8Jw0KNz0MK7uxMdjGcMjjg9kb9u9ASUj68618QCDXnNcJZ7Vin8UA1yvT2YHzQ4H8GpzGF2qvPL1xBPfVufyW4LcJBXZ37EPr4XhxAuzywZGPfJDz9Djk5Dk4UwhNBbSUfyF6ktZp8W1zKTPV00G2YDyMNy47DeVYQAaEPTxMrz2fAYk0paSqnkLTJU1Rnvg1WJFcPknN1w4TVH8uZX8E";
        expect(()=> {FormValidator.validateForm(testForm)}).toThrowError(ZodError);
        testForm.description = "This description should by no means be too long, and it can allow all characters lol =)(§/$%)§$U%()§$/Z"
        expect(FormValidator.validateForm(testForm));
        testForm.description = "";
        expect(FormValidator.validateForm(testForm));
    })

    it("Throws an error if a question has no description or a description of more than 1023 characters", () => {
        const testForm : Form = new Form;
        testForm.addQuestion(QuestionTypes.textInput);
        expect(()=> {FormValidator.validateForm(testForm)}).toThrowError(ZodError);
        testForm.questions[0].description = "RikwW0RKVjKqJvi7E9mgjefPLm0MJaqEijzz1wJ4jR9Qmt6C0mkL7vQP8QP7Z31W26gNEAqXY7FJpk8mhfRrtfYSXykZaQ4pVf5JXGt0VyiqgL99fehxBTgH65XepzhhEB6ve4trA6zxNct3SiahmL39iBEHEVyJeZtniRC1uM3CqbQKNRMwErE2xq5K38KUFdBJE8iLBvrhRL1tj8c7hfZChLhYF035X1DUX4WAECFTeYvdVizzEiKj5y2y9f2uu26gpMBnFr98QK4PE715ZwY33xT7GWM70j3y4ZcxqtNBnhkBWNu8iVeAuvUWWgzYVuyc3DDKnHSMyjWnD2R2DQqNKEpQ6pKzNdwckYqYuh7XzzDqGZYLpFqvSkaG1JTBeiLpzhK9HSX8UrFhhHgw0gjMCHR97hzg1JZmB4i1EuTn0gzJUtbEfRfGHW8nZ2bPGMq6NxMwCSXRJwafAgmB5YUf4XC6qKXQhghF5RfiBFEM0kCfwWUNB9ffRLcHa6Gq4UVUnwfPq2Nc9CNGi6HtK3Y06MRJKzq1wypmFzh9j7UUjuvGSz1yntUkuZ9rvSjjwk3NQVekFU3KUhhhJixFt7NA08Y2h4n8p7mAxhmcejXS19Z6nnffDz6ATcPF0TFdVnC2y7aHehq93DpXriHAQ0raYkC7G82KDvL04HBwkELhjtqnr9wRfwjZfn2tv5PDS8pfdPRCnkgp8AM1y3b8yNMnTSM0Pn6g2Xx2uhV687Ed9CqR5vCwJaxCrx7CfzqgH73yqxF4zSxGtGr5uLJPHd2DnTz8fS66Th9ZgWL9wRW8Jw0KNz0MK7uxMdjGcMjjg9kb9u9ASUj68618QCDXnNcJZ7Vin8UA1yvT2YHzQ4H8GpzGF2qvPL1xBPfVufyW4LcJBXZ37EPr4XhxAuzywZGPfJDz9Djk5Dk4UwhNBbSUfyF6ktZp8W1zKTPV00G2YDyMNy47DeVYQAaEPTxMrz2fAYk0paSqnkLTJU1Rnvg1WJFcPknN1w4TVH8uZX8E";
        expect(()=> {FormValidator.validateForm(testForm)}).toThrowError(ZodError);
        testForm.questions[0].description = testForm.description = "This description should by no means be too long, and it can allow all characters lol =)(§/$%)§$U%()§$/Z";
        expect(FormValidator.validateForm(testForm));
        testForm.addQuestion(QuestionTypes.slider);
        testForm.questions[1].description = "";
        expect(()=> {FormValidator.validateForm(testForm)}).toThrowError(ZodError);
    })

    it("Throws an error if a question's option has no description or a description of more than 1023 characters", () => {
        const testForm : Form = new Form;
        testForm.addQuestion(QuestionTypes.multipleChoice);
        testForm.questions[0].description = "hee hee";
        testForm.questions[0].addOption();
        expect(FormValidator.validateForm(testForm))
        testForm.questions[0].renameOption(0, "RikwW0RKVjKqJvi7E9mgjefPLm0MJaqEijzz1wJ4jR9Qmt6C0mkL7vQP8QP7Z31W26gNEAqXY7FJpk8mhfRrtfYSXykZaQ4pVf5JXGt0VyiqgL99fehxBTgH65XepzhhEB6ve4trA6zxNct3SiahmL39iBEHEVyJeZtniRC1uM3CqbQKNRMwErE2xq5K38KUFdBJE8iLBvrhRL1tj8c7hfZChLhYF035X1DUX4WAECFTeYvdVizzEiKj5y2y9f2uu26gpMBnFr98QK4PE715ZwY33xT7GWM70j3y4ZcxqtNBnhkBWNu8iVeAuvUWWgzYVuyc3DDKnHSMyjWnD2R2DQqNKEpQ6pKzNdwckYqYuh7XzzDqGZYLpFqvSkaG1JTBeiLpzhK9HSX8UrFhhHgw0gjMCHR97hzg1JZmB4i1EuTn0gzJUtbEfRfGHW8nZ2bPGMq6NxMwCSXRJwafAgmB5YUf4XC6qKXQhghF5RfiBFEM0kCfwWUNB9ffRLcHa6Gq4UVUnwfPq2Nc9CNGi6HtK3Y06MRJKzq1wypmFzh9j7UUjuvGSz1yntUkuZ9rvSjjwk3NQVekFU3KUhhhJixFt7NA08Y2h4n8p7mAxhmcejXS19Z6nnffDz6ATcPF0TFdVnC2y7aHehq93DpXriHAQ0raYkC7G82KDvL04HBwkELhjtqnr9wRfwjZfn2tv5PDS8pfdPRCnkgp8AM1y3b8yNMnTSM0Pn6g2Xx2uhV687Ed9CqR5vCwJaxCrx7CfzqgH73yqxF4zSxGtGr5uLJPHd2DnTz8fS66Th9ZgWL9wRW8Jw0KNz0MK7uxMdjGcMjjg9kb9u9ASUj68618QCDXnNcJZ7Vin8UA1yvT2YHzQ4H8GpzGF2qvPL1xBPfVufyW4LcJBXZ37EPr4XhxAuzywZGPfJDz9Djk5Dk4UwhNBbSUfyF6ktZp8W1zKTPV00G2YDyMNy47DeVYQAaEPTxMrz2fAYk0paSqnkLTJU1Rnvg1WJFcPknN1w4TVH8uZX8E");
        expect(()=> {FormValidator.validateForm(testForm)}).toThrowError(ZodError);
        testForm.questions[0].renameOption(0, "This description should by no means be too long, and it can allow all characters lol =)(§/$%)§$U%()§$/Z");
        expect(FormValidator.validateForm(testForm));
        testForm.questions[0].renameOption(0, "");
        expect(()=> {FormValidator.validateForm(testForm)}).toThrowError(ZodError);  
    })
})