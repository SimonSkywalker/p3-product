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
interface MemberResponse{
    tokenid: Responses
}

interface Responses {
    roles:{}
    question:{}
}

export class QuestionHandler {
    public static questionIndexGetter(questionPick: string, questionList: Question[] ) {
        return questionList.findIndex((question) => question.description === questionPick);
    }
}

export class chartMaker{
    
    private _dataSet: Responses = {
        roles:{},
        question:{}
    };
    
    public get dataSet() {
        return this._dataSet;
    }
    public set dataSet(value: any) {   
        this._dataSet = value;
    }
    private _dataArray: MemberResponse[] = [];
    public get dataArray(): MemberResponse[] {
        return this._dataArray;
    }
    public set dataArray(value: MemberResponse[]) {
        this._dataArray = value;
    }

    makeArray(responses: any[], pickedRoles: any[]) {
        responses.forEach((element, i) => {
            Object.entries(element).forEach(([key, value]) => {
                const roles = (value as any)?.roles;
                const questions = (value as any)?.questions;

                const flattenedRoles = Object.values(roles || {}).flatMap(roleArray => roleArray || []);
                
                // Check if any role from pickedRoles is present in flattenedRoles
                const rolesMatched = pickedRoles.some(role => flattenedRoles.includes(role));

                if (rolesMatched) {
                    this.dataSet = {
                        roles: flattenedRoles,
                        questions: questions || {},
                    };
                    
                    this._dataArray.push(this.dataSet);
                }
            });
        });
        //console.log(this.dataArray);
    }
}