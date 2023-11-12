
export class Project{

    private title: String;

    private isActive: boolean;

    private icon: String;

    

    constructor(){

        this.title = '';
        this.isActive = true;
        this.icon = '';

    }

    public getTitle(): String {
        return this.title;
    }

    public setTitle(value: String) {
        this.title = value;
    }

    public getIsActive(): boolean {
        return this.isActive;
    }

    public setIsActive(value: boolean) {
        this.isActive = value;
    }

    public getIcon(): String {
        return this.icon;
    }

    public setIcon(value: String) {
        this.icon = value;
    }






}