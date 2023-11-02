class Project{
    private _name:String;
    private _isActive: boolean;
    private _logo: String;
    

    constructor(name:String, isActive:boolean, logo:String){
        this._name=name;
        this._isActive=isActive;
        this._logo=logo;

    }
    public get name(): String {
        return this._name;
    }
    public set name(value: String) {
        this._name = value;
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