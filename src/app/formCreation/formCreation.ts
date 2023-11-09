import Link from "next/link";
import NoObjectException from "../exceptions/NoObjectException";
import WrongTypeException from "../exceptions/WrongTypeException";
import DatabaseAccess from "./DatabaseAccess";
import FileSystemService from "./FileSystemService";

class Token {
    private _tokenID: String;
    private _isUsed: boolean;

    public get tokenID(): String {
        return this._tokenID;
    }
    public set tokenID(value: String) {
        this._tokenID = value;
    }

    public get isUsed(): boolean {
        return this._isUsed;
    }
    public set isUsed(value: boolean) {
        this._isUsed = value;
    }

    constructor(ID : String){
        this._tokenID = ID;
        this._isUsed = false;
    }

    //This function takes as input two numbers, amount and length
    //It returns as 
    public static createTokenArray(amount:number, length:number) : Array<Token> {
        let tokens = new Array<Token>;

        const characters : String = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for(let i = 0; i < amount ; i++) {
            let randomString : String = "";
            for(let j = 0; j < length; j++){
                randomString += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            let newToken : Token = new Token(randomString);
            tokens.push(newToken);
        }
        return tokens;
    }

}


export default Token;