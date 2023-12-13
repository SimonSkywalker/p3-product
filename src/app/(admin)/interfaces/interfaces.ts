import Token from "@/app/(admin)/formCreation/Token";
import Question from "@/app/(admin)/formCreation/question";

export interface ProjectInterface {
    title: string;
    isActive: boolean;
    icon: string;
}

export interface actionProject {
    itemTitle: string,
    itemIndex: number,
}
  
export interface modalOperator {
    currentModalTitle: string,
    isOpen: boolean,
}

export interface FormObject{
     _name: string,
     _description: string,
     _questions: Array<Question>,
     _tokens: Array<Token>,
     _isActive: boolean;
     _parent: string;

}


