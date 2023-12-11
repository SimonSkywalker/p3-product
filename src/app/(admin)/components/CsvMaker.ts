import WrongTypeException from "@/app/(admin)/exceptions/WrongTypeException";
import Form from "@/app/(admin)/formCreation/Form";

class CsvMaker {


    /**
     * Converts a 2D array of objects into an array of comma-separated strings using the toString method
     * @param array A 2-Dimensional array of objects
     * @returns An array of strings with values from the input array separated by comma
     */
    public static arrayToCsv(array : Array<Array<any>>) : string {
        let csvText : string = "";
        for(let i = 0; i < array.length; i++) {
            let csvLine : string = "";
            for(let j = 0; j < array[i].length; j++) {
                csvLine += array[i][j].toString();
                if (j < array[i].length+1)
                    csvLine += ","
            }
            csvText += csvLine + "\n";
        }
        return csvText;
    }

    /**
     * A quick method to download a text file for a user without adding it to the server
     * @param filename name of file
     * @param text text of file
     * https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server/18197341#18197341 
     */
    public static download(filename : string, text :string) {
        if(filename == ""){
            filename = "form.csv"
        }
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
      }

}

export default class ResponseCsvMaker extends CsvMaker {

    /**
     * Converts an array of responses to a 2D array to be converted to CSV
     * @param responses An array of ResponseData
     * @param form The form the responses are responding to, for question titles
     * @returns A 2D array containing values corresponding 
     */
    public static responsesToArray(responses : Array<ResponseData>, form : Form) : Array<Array<any>>{
        let finalArray : Array<Array<any>> = [[]];
        finalArray[0][0] = "Respondents";
        for(let i = 0; i < responses.length; i++){
            finalArray[0].push(responses[i].tokenID);
        }
        for(let i = 0; i < form.questions.length; i++){
            finalArray.push([]);
            finalArray[i+1][0] = form.questions[i].description;
            for(let j = 0; j < responses.length; j++){
                finalArray[i+1].push(responses[j].answers[i]);
            }
        }
        return finalArray;
    }

}

export class ResponseData {
    private _answers: Array<AnswerData> = [];
    
    private _tokenID: string = "";

    public get tokenID(): string {
        return this._tokenID;
    }

    public set tokenID(value: string) {
        this._tokenID = value;
    }

    public get answers(): Array<AnswerData> {
        return this._answers;
    }

    /**
     * Converts an object with the fields from the ResponseData class to a ResponseData instance
     * @param form The form being responded to, necessary to know the number of questions
     * @param response The response
     * @returns An instance of ResponseData with the relevant fields from the response
     */
    public static responseFromObject(response : any) : ResponseData {
        let responseData = new ResponseData;
        console.log(response.tokenID);
        responseData._tokenID = Object.keys(response)[0];
        if(response[responseData._tokenID].questions == undefined)
            throw new WrongTypeException;
        let answers = Object.values(response[responseData._tokenID].questions);
        for(let i = 0; i < answers.length; i++){
            responseData.answers.push(new AnswerData);
            if(answers[i] != undefined)
                responseData.answers[i].setAnswer(answers[i] as string);
        }
        return responseData;
    }


}

export class AnswerData {
    private _singleAnswer: string = "";
    private _multipleAnswer: Array<string> = [];



    
    /**
     * Used to get the correct answer data
     * @returns The answer contained in the answer data, or error if none exists (returns singleAnswer if both exist)
     */
    public getAnswer() : string | Array<string>{
        if(this._singleAnswer)
            return this._singleAnswer
        if(this._multipleAnswer.length > 0)
            return this._multipleAnswer
        else throw Error;
    }

    /**
     * Sets the object's singleAnswer or multipleAnswer field to the correct answer
     * @param answer The answer, being a string or a string array
     */
    public setAnswer(answer : string | Array<string>) : void {
        if(typeof answer == 'string')
            this._singleAnswer = answer;
        else
            this._multipleAnswer = answer;
    }

    public toString() : string {
        if(this._singleAnswer != "")
            return this._singleAnswer;
        //Adding quotes so that in csv, they will count as one entity
        if(this._multipleAnswer.length > 0)
            return '"' + this._multipleAnswer.join(",") + '"';
        else throw Error;
    }

}