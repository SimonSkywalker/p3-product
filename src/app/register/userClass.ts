import userList from '@/app/database/userLogins.json'





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
        /**
     * findDuplicate
        list: list     */
    public isDuplicate(list: typeof userList):boolean {
        
        list.forEach(user => {
            if(user.Username == this.username){
                return true;
            }
        })
        
        return false
    }

    public createUser(){

        if(this.isDuplicate(userList)){
            throw Error('this user exist')
        }
        console.log('you good');
        
        
    }

    public deleteUser(){

    }

    public static main(username: String, password:String){
        let u:User = new User(username, password);
        u.createUser;
    }

}


