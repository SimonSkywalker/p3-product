import { promises as fs } from "fs";

export class User{
    
    private _username: String;
    
    private _password: String;
    
    private _displayName: String;
    
    
    constructor(username:String,password:String){
        this._username = username;
        this._password = password;
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
    
    public static async getData(){
        const file = await fs.readFile(process.cwd() + '/app/data.json', 'utf8');
        const data = JSON.parse(file);
        console.log(data);
        
    }

    public createUser(){
        
    }

    public deleteUser(){

    }
}
