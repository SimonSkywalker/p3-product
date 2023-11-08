
export class Project{

    private _title: String;

    private _isActive: boolean;

    private _logo: String;

    

    constructor(title:String, isActive:boolean, logo:String){

        this._title = title;
        this._isActive = isActive;
        this._logo = logo;

    }

    public get title(): String {
        return this._title;
    }

    public set title(value: String) {
        this._title = value;
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    public set isActive(value: boolean) {
        this._isActive = value;
    }

    public get logo(): String {
        return this._logo;
    }

    public set logo(value: String) {
        this._logo = value;
    }






}