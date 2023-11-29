import Link from "next/link";
import NoObjectException from "../exceptions/NoObjectException";
import WrongTypeException from "../exceptions/WrongTypeException";
import FileFinder from "./FileFinder";
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

}


export default Token;