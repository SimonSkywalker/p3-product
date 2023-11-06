import userList from '@/app/database/userLogins.json'
import {promises as fs} from "fs"
import bcrypt from 'bcrypt';

export class User{

    private _username: String;
    
    private _password: String;
    
    private _displayName: String;

    constructor(username:String,password:String){

        this._username = username;
        this._password =  password;
        this._displayName = username;
    }
    
    public get username(): String {
        return this._username;
    }
    public set username(value: String) {
        this._username = value;
    }
    
    public get password(): String {
        return this._password;
    }
    public set password(value: String) {
        this._password = value;
    }

    public get displayName(): String {
        return this._displayName;
    }
    public set displayName(value: String) {
        this._displayName = value;
    }
       
    public toString(): void{
        console.log("username: " + this.username, "password: " + this.password);
    }
    

    public createUser(){
            
            if(checkList.isDuplicate(userList, this.username)){
                throw new Error('this user exist')
            }
            
            userList.push({Username: (this.username as string), Password: (this.password as string)})

            dataManipulation.saveListData(userList);    
        
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

    public static main(username: String, password:String){
        try{
        let u:User = new User(username, password);
        u.createUser();
        u.toString();
        } catch (error) {
            throw error
        }
    }

}


class checkList{

     /**
     * isDuplicate
        list: list
        Username: String     */

    public static isDuplicate(list: typeof userList, Username: String):boolean {

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
}

