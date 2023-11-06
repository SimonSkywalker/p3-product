import userList from '@/app/database/userLogins.json'
import {promises as fs} from "fs"
import bcrypt from 'bcrypt';
import { RegisterException } from '../exceptions/RegisterException';

export class User{

    private _username: string;
    
    private _password: string;
    
    private _displayName: string;


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

    public createUser(){
            
            if(checkList.isDuplicate(userList, this.username)){
                throw new RegisterException();
            }
            
            userList.push({Username: this.username, Password: this.password, DisplayName: this.displayName});

            dataManipulation.saveListData(userList);
            dataManipulation.makeUserFolder(this.username);   
        
    }

    public findUser() {
        userList.some((element) => {
            if (element.Username === this.username) {

                let user:User = new User(this.username,this.password)
                return user;
            }
    })
}



    public deleteUser(){



    }

   

}


class checkList{

     /**
     * isDuplicate
        list: list
        Username: string     */

    public static isDuplicate(list: typeof userList, Username: string):boolean {

        let bool = false;

        list.some((element) => {

            if (element.Username === Username) {

                bool = true;

            }
    
        });

        return bool;
    }
}

class dataManipulation{

    public static saveListData(list: typeof userList){

        fs.writeFile(process.cwd() +'/src/app/database/userLogins.json', JSON.stringify(list, null, 4));
    }

    public static makeUserFolder(user: string){
        fs.mkdir(process.cwd() +'/src/app/database/'+user);
        
    }
}

