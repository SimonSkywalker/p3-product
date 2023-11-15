import { ProjectInterface } from '../interfaces/interfaces';

class Project implements ProjectInterface {
    title: string = '';
    isActive: boolean = true;
    icon: string = '';
    beingEdited: boolean = false;

    public setTitle(title: string){
        this.title = title;
    }

    public setIcon(icon: string){
        this.icon = icon;
    }

    public getTitle(){
        return this.title;
    }

    public getIcon(){
        return this.icon;
    }

    public getIsActive(){
        return this.isActive;
    }

    public getProject(){
        return {
            title: this.title,
            isActive: this.isActive,
            icon: this.icon,
        };
    }
}

export default Project;
