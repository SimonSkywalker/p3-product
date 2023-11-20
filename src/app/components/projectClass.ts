import { ProjectInterface, projectObject } from '../interfaces/interfaces';


export class Project {

    protected _projectdata: ProjectInterface = {
        title: '',
        isActive: true,
        icon: '',
    }

    constructor() {
        this._projectdata.title = '';
        this._projectdata.isActive = true;
        this._projectdata.icon = '';
        
    }

    public setTitle(title: string){
        this._projectdata.title = title;
    }

    public setIcon(icon: string){
        this._projectdata.icon = icon;
    }

    public setIsActive(isActive: boolean){
        this._projectdata.isActive = isActive;
    }

    public getTitle(){
        return this._projectdata.title;
    }

    public getIcon(){
        return this._projectdata.icon;
    }

    public getIsActive(){
        console.log("Render: ",this._projectdata)
        return this._projectdata.isActive;
    }

    public getproject(){
        return this._projectdata;
    }
    
    public setproject(value: ProjectInterface) {
        this._projectdata = value;
    }
}

export class ProjectObject extends Project {

    
    private _beingEdited: boolean;

    constructor(objectA: ProjectInterface) {
        super();
        this._projectdata.title = objectA.title;
        this._projectdata.isActive = objectA.isActive;
        this._projectdata.icon = objectA.icon;
        this._beingEdited = false;    
    };

    public getBeingEdited() {
        return this._beingEdited;
    }

    public setBeingEdited(beingEdited: boolean) {
        this._beingEdited = beingEdited;
    }
  
}


//export default Project;
