import {expect, jest, test} from '@jest/globals'
import _ from "lodash"
import z, { ZodError } from "zod";
import ResponseCsvMaker from '@/app/(admin)/components/CsvMaker';
import { ResponseData } from '@/app/(admin)/components/CsvMaker';
import Form from '@/app/(admin)/formCreation/Form';


describe('ResponseCsvMaker', () => {
    it("Works", () => {
        const testForm : Form = new Form;
        testForm.addQuestion(0);
        testForm.addQuestion(1);
        testForm.addQuestion(2);
        testForm.questions[0].description = "This is the first question";
        testForm.questions[1].description = "This is the second question";
        testForm.questions[2].description = "This is the third question";
        const response1 : any = {tokenID : "heehoo", questions : {1: "yes", 2: "no", 3 : ["one", "three", "seven"]}};
        const response2 : any = {tokenID : "hoohee", questions : {1: "somewhat", 2: "arguably", 3 : ["your mom", "your dad", "your child"]}};
        const response3 : any = {tokenID : "heehaa", questions : {1: "indubitably", 2: "no doubt", 3 : ["die hard", "die hard with a vengeance"]}};
        const responses = [ResponseData.responseFromObject(response1), ResponseData.responseFromObject(response2), ResponseData.responseFromObject(response3)];
        console.log(ResponseCsvMaker.arrayToCsv(ResponseCsvMaker.responsesToArray(responses, testForm)))
    })
})