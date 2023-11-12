
interface FormData {
    
    title: string;
    isActive: boolean;
    icon: string;
}


class ProjectFormHandler extends FormData {
  

  private formData: FormData = {
    title: '',
    isActive: true,
    icon: '',
  };


  public setTitle(title: string){
    this.formData.title = title;
  }

  public setIcon(icon: string){
    this.formData.icon = icon;
  }

  public getTitle(){
    return this.formData.title;
  }

  public getIcon(){
    return this.formData.icon;
  }

  public getForm(){
    return this.formData;
  }


}

export default ProjectFormHandler;

