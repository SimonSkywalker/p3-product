
interface Question {
    description: string;
    mandatory: boolean;
    userDisplay: boolean;
    questionType: number;
    saveRole: boolean;
    options?: string[];
    type?: number;
    range?: number;
  }

export class QuestionHandler {
    public static questionIndexGetter(questionPick: string, questionList: Question[] ) {
        console.log(questionList);
        console.log(questionPick);
        return questionList.findIndex((question) => question.description === questionPick);
    }
}

class chartMaker{
    
}