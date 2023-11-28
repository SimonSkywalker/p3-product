import { ProjectInterface, projectObject } from '../interfaces/interfaces';
import fs from 'fs';


export class Project {

    protected _projectdata: ProjectInterface = {
        title: '',
        isActive: true,
        icon: "",
    }

    public constructor() {
    }
    
    public setTitle(title: string){
        this._projectdata.title = title;
    }

    public setIcon(icon: string){
        if (icon.trim() !== '') {
            this._projectdata.icon = icon;
        }
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

        return this._projectdata.isActive;
    }

    public getProject(){
        return this._projectdata;
    }
    
    public setProject(value: ProjectInterface) {
        this._projectdata = value;
    }

    public convertToProjectObject(): ProjectObject {
        const projectObject = new ProjectObject(this._projectdata);
        // Additional setup or customization for ProjectObject if needed
        return projectObject;
    }

    public createFolder() {
        const folderName = this._projectdata.title;
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
    }

    // Method to delete the folder for the project
    public deleteFolder() {
        const folderName = this._projectdata.title;
        if (fs.existsSync(folderName)) {
            fs.rmdirSync(folderName, { recursive: true });
        }
    }

}

export class ProjectObject extends Project {

    
    private _beingEdited: boolean;
    private _previousTitle: string;
   

    constructor(objectA: ProjectInterface) {
        super();
        this._projectdata.title = objectA.title;
        this._projectdata.isActive = objectA.isActive;
        this._projectdata.icon = objectA.icon;
        this._beingEdited = false;    
        this._previousTitle = "";
    };

    public getBeingEdited() {
        return this._beingEdited;
    }

    public setBeingEdited(beingEdited: boolean) {
        this._beingEdited = beingEdited;
    }

    public getpreviousTitle(): string {
        return this._previousTitle;
    }
    public setpreviousTitle(previousTitle: string) {
        this._previousTitle = previousTitle;
    }
  
    public getProjectDataArray(): [string, boolean, string] {
        const { title, isActive, icon } = this._projectdata;
        return [title, isActive, icon];
    }

}


//export default Project;
