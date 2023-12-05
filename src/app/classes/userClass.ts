import {promises as fs} from "fs"
import { RegisterException } from '../exceptions/RegisterException';
import { user } from "@nextui-org/react";

interface UserObject{
    Username: string
    Password: string
    DisplayName: string
}

/**
 * Class to make a User with a usename, password & displayname
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
    public async createUser(){
        let userList: UserObject[]
        //Checks for exsting file
        try{
            fs.access(process.cwd() +'/src/app/database/userLogins.json')
            let tmp = await fs.readFile(process.cwd() +'/src/app/database/userLogins.json', 'utf-8').catch()
            userList = JSON.parse(tmp) ;
        }catch{
            userList = []
            }
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
     * for if a user with the given username exists
     * and returns this user with it values
     */
    public findUser(userList: UserObject[]) {
        userList.some((element) => {
             if (element.Username === this.username) {
                let user:User = new User(this.username,this.password)
                return user;
            } 
    })
}


}

/**
 * This class objective is
 * to go through a list
 * and check for a specific thing
 * that is defined through its methods
 */
class checkList{

     /**
      * This method checks  for a duplicate member in a given list 
        @param list A list of all users
        @param Username The name user that is to be checked
        @return A true || false     */
    public static isDuplicate(list: UserObject[], Username: string):boolean {

        let bool = false;
        list.some((element) => {
            if (element.Username === Username) {
                bool = true;
            } 
        });
        return bool;
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
    public static saveListData(list: UserObject[]){
        fs.writeFile(process.cwd() +'/src/app/database/userLogins.json', JSON.stringify(list, null, 4));
    }

    /**
     * Makes a folder for a new user
     * @param user to be made a folder for
     */
    public static makeUserFolder(user: string){
        fs.mkdir(process.cwd() +'/src/app/database/'+user);
        
    }
}

