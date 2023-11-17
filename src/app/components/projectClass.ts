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

    public getTitle(){
        return this._projectdata.title;
    }

    public getIcon(){
        return this._projectdata.icon;
    }

    public getIsActive(){
        return this._projectdata.isActive;
    }

    public get project(){
        return this._projectdata;
    }
    
    public set project(value: ProjectInterface) {
        this._projectdata = value;
    }
}

export class ProjectObject extends Project {

    constructor(objectA: ProjectInterface) {

        super();
        this._projectdata.title = objectA.title;
        this._projectdata.isActive = objectA.isActive;
        this._projectdata.icon = objectA.icon;
        
    }

     _projectdata: projectObject = {
        ...this._projectdata,
        beingEdited: false,
        
    };

    

    public get projectO(): projectObject {
        return this._projectdata;
    }
    
    public set projectO(value: projectObject) {
        this._projectdata = value;
    }
        

  
}


//export default Project;
