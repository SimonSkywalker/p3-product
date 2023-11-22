import userList from '@/app/(database)/userLogins.json'
import * as fs from "fs/promises";
import { RegisterException } from '../exceptions/RegisterException';

interface Question {
    description: string;
    mandatory: boolean;
    userDisplay: boolean;
    questionType: number;
    saveRole: boolean;
    options?: string[]; // options is an optional array of strings
    type?: number;
    range?: number;
  }
  
  interface Token {
    [key: string]: {
      isUsed: boolean;
    };
  }
  
  interface FormObject {
    name: string;
    description: string;
    questions: Question[];
    tokens: Token[];
  }

/**
 * Class to make a User with a usename,password & 
 */
export class User{

    private _username: string;
    
    private _password: string;
    
    private _displayName: string;

       
    /**
     * constructor to define classes values
     * @param username Username given from input
     * @param password Password given from input
     */
    constructor(username:string,password:string){

        this._username = username;
        this._password =  password;
        this._displayName = username;
    }
    
    public get username(): string {
        return this._username;
    }
    public set username(value: string) {
        this._username = value;
    }
    
    public get password(): string {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
    }

    public get displayName(): string {
        return this._displayName;
    }
    public set displayName(value: string) {
        this._displayName = value;
    }
    /**
     * This method checks if user already exists in the database
     * - If it does, it throws a custom Error
     * - If it does not, it write to database & make a folder for their projects
     */
    public createUser(){
            //Checks if user already exists
            if(checkList.isDuplicate(userList, this.username)){
                throw new RegisterException();
            }
            
            //Writes to database
            userList.push({Username: this.username, Password: this.password, DisplayName: this.displayName});
            dataManipulation.saveListData(userList);
            dataManipulation.makeUserFolder(this.username);   
        
    }

    /**
     * During login, findUser checks the database
     * for if an user with the given username exists
     * and returns this user with it values
     */
    public findUser() {
        userList.some((element) => {
            if (element.Username === this.username) {
                let user:User = new User(this.username,this.password)
                return user;
            }
    })
}


    /**
     * For futureworks
     */
    public deleteUser(){
    }

   

}

/**
 * This class objective is
 * to go through a list
 * and check for a specific thing
 * that is defined through its methods
 */
export class checkList{

     /**
      * This method checks  for a duplicate member in a given list 
        @param list A list of all users
        @param Username The name user that is to be checked
        @return A true || false     */
    public static isDuplicate(list: typeof userList, Username: string):boolean {

        let bool = false;
        list.some((element) => {
            if (element.Username === Username) {
                bool = true;
            }
        });
        return bool;
    }

    public static findForms(userId: string, project: string) {
        const formsFilePath = process.cwd() + `/src/app/(database)/${userId}/${project}/forms.json`;
    
        // Return the Promise
        return fs.readFile(formsFilePath, "utf8")
            .then((formsFile) => {
                const formsFileparsed = JSON.parse(formsFile);
                return formsFileparsed.forms.map((form: { name: string }) => form.name);
            })
            .catch((error) => {
                // Handle errors
                console.error('Error reading forms:', error);
                return [];
            });
    }

    public static findRoles(userId: string, project: string, Form: string) {
        const formsFilePath = process.cwd() + `/src/app/(database)/${userId}/${project}/forms.json`;
    
        // Return the Promise
        return fs.readFile(formsFilePath, "utf8")
            .then((formsFile) => {
                const formsFileparsed = JSON.parse(formsFile);
                const formObject = formsFileparsed.forms.find((form: FormObject) => form.name === '20-10');
                
                // Find questions where saveRole is true and get options as an array
                const questionsWithSaveRoleAndIndex = formObject.questions
                .filter((question: Question) => question.saveRole)
                .reduce((result: Record<string, string[]>, question: Question, index: number) => {
                    const options = question.options as string[]; // Type assertion
                    result[index] = options;
                    return result;
                }, {});

                console.log(questionsWithSaveRoleAndIndex);
            })
            .catch((error) => {
                // Handle errors
                console.error('Error reading forms:', error);
                return [];
            });
    }
}

/**
 * Class for changing or making new data in the database
 */
class dataManipulation{

    /**
     * This method saves the list of user in its corresponding json file in database
     * @param list of users that is to be save to the database
     */
    public static saveListData(list: typeof userList){
        fs.writeFile(process.cwd() +'/src/app/(database)/userLogins.json', JSON.stringify(list, null, "\t"));
    }

    /**
     * Makes a folder for a new user
     * @param user to be made a folder for
     */
    public static makeUserFolder(user: string){
        fs.mkdir(process.cwd() +'/src/app/(database)/'+user);
        
    }
}

