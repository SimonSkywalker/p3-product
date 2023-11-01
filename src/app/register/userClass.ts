class User{
    
    private _username: string;
    
    private _password: string;
    
    private _displayName: string;
    
    
    constructor(username:string,password:string){
        this._username = username;
        this._password = password;
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
        
    }
}
