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

interface Responses {
    roles:{}
    question:{}
}

const agreeDisagreeRanges = {
    9: [
      "Strongly Disagree",
      "Disagree",
      "Moderately Disagree",
      "Slightly Disagree",
      "Neutral",
      "Slightly Agree",
      "Moderately Agree",
      "Agree",
      "Strongly Agree"
    ],
    7: [
      "Strongly Disagree",
      "Disagree",
      "Somewhat Disagree",
      "Neutral",
      "Somewhat Agree",
      "Agree",
      "Strongly Agree"
    ],
    5: [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    3: [
      "Disagree",
      "Neutral",
      "Agree"
    ]
  };


export class QuestionHandler {
    public static questionIndexGetter(questionPick: string, questionList: Question[] ) {
        return questionList.findIndex((question) => question.description === questionPick);
    }
}

export class dataMaker{
    
    private _dataSet = {
        roles:{},
        question:{}
    };
    private _dataArray: any = [];
    private _sortedDataArray: any = {};
    
    public get dataSet() {
        return this._dataSet;
    }
    public set dataSet(value: any) {   
        this._dataSet = value;
    }
    public get dataArray() {
        return this._dataArray;
    }
    public set dataArray(value) {
        this._dataArray = value;
    }
    public get sortedDataArray(): any {
        return this._sortedDataArray;
    }
    public set sortedDataArray(value: any) {
        this._sortedDataArray = value;
    }

    makeArray(responses: any[], pickedRoles: any[]) {
        this.dataArray = [];
        responses.forEach((element) => {
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
                    
                    this.dataArray.push(this.dataSet);
                }
            });
        });
    }

    sortDataArray(formData: any, chartData: any){
        console.log(this.dataArray);
        this.sortedDataArray = {};
        this.dataArray.forEach((element : any, userIndex: number) => {
            const roles = element.roles;
            const questions = element.questions;
    
            Object.keys(questions).forEach((key: any) => {
    
                if (!this.sortedDataArray[key]) {
                    this.sortedDataArray[key] = {};
                }
                if (!this.sortedDataArray[key]["description"]) {
                    this.sortedDataArray[key]["description"] = chartData.questions[key].description
                }
                if (!this.sortedDataArray[key]["roleAnswers"]) {
                    this.sortedDataArray[key]["roleAnswers"] = {};
                }
                if (!this.sortedDataArray[key]["roleAnswersCount"] && chartData.questions[key].questionType != 2) {
                    this.sortedDataArray[key]["roleAnswersCount"] = {};   
                }
                
                chartData.roles.forEach((newElement : any) => {

                    if (formData.rolePicks.includes(newElement)) {

                        if (chartData.questions[key].questionType != 2) {

                            if (!this.sortedDataArray[key]["roleAnswers"][newElement]) {
                                this.sortedDataArray[key]["roleAnswers"][newElement] = [];   
                            }
                        
                            if (!this.sortedDataArray[key]["roleAnswersCount"][newElement] && chartData.questions[key].questionType != 2) {
                                this.sortedDataArray[key]["roleAnswersCount"][newElement] = 0;  
                            }
                        }

                    }

                })
    
                formData.rolePicks.forEach((newElement : any) => {
                    
                    const value:[] = questions[key];
                    if (roles.includes(newElement)) {
                        if (chartData.questions[key].saveRole && (chartData.questions[key].questionType == 0 && chartData.questions[key].type == 0)) {
                            
                            if (Array.isArray(value) && chartData.questions[key].questionType != 2) {
                                this.sortedDataArray[key]["roleAnswers"][newElement].push(...value);
                                
                                value.forEach((newValue : any) => {
                                    this.sortedDataArray[key]["roleAnswersCount"][newElement] += 1;
                                }) 
                            }
                        } else {

                            if (Array.isArray(value) && chartData.questions[key].questionType != 2) {

                                if (!this.sortedDataArray[key]["roleAnswersCount"][newElement]) {
                                    this.sortedDataArray[key]["roleAnswersCount"][newElement] = {};  
                                }
                                
                                    this.sortedDataArray[key]["roleAnswers"][newElement].push(...value);
                                
                                    if(chartData.questions[key].questionType == 0 && chartData.questions[key].type == 1) {
                                        chartData.questions[key].options.forEach((newValue : any) => {
                                            if (!this.sortedDataArray[key]["roleAnswersCount"][newElement][newValue]) {
                                                this.sortedDataArray[key]["roleAnswersCount"][newElement][newValue] = 0;
                                            }
                                        })      
                                    } else if (chartData.questions[key].questionType == 1) {
                                        if (chartData.questions[key].type == 0) {
                                            let rangeKey: keyof typeof agreeDisagreeRanges = chartData.questions[key].range;
                                            agreeDisagreeRanges[rangeKey].forEach((newValue : any) => {
                                                if (!this.sortedDataArray[key]["roleAnswersCount"][newElement][newValue]) {
                                                    this.sortedDataArray[key]["roleAnswersCount"][newElement][newValue] = 0;
                                                }
                                            })
                                        } else if (chartData.questions[key].type == 1) {
                                            let valueRange = Array.from({length: chartData.questions[key].range}, (_, i) => i + 1);
                                            valueRange.forEach((newValue : any) => {
                                                if (!this.sortedDataArray[key]["roleAnswersCount"][newElement][newValue]) {
                                                    this.sortedDataArray[key]["roleAnswersCount"][newElement][newValue] = 0;
                                                }
                                            })
                                        }
                                    }
                                value.forEach((newValue : any) => {

                                    if (chartData.questions[key].questionType != 2) {
        
                                        if (!this.sortedDataArray[key]["roleAnswersCount"][newElement][newValue]) {
                                            this.sortedDataArray[key]["roleAnswersCount"][newElement][newValue] = 0;
                                        }
            
                                        this.sortedDataArray[key]["roleAnswersCount"][newElement][newValue] += 1;
                                    }
                                })           
                            } else if (chartData.questions[key].questionType == 2) {
                                let userConcat = `User${userIndex + 1}`;

                                if (!this.sortedDataArray[key]["roleAnswers"][userConcat]) {
                                    this.sortedDataArray[key]["roleAnswers"][userConcat] = {};
                                }
                        
                                this.sortedDataArray[key]["roleAnswers"][userConcat] = {
                                    role: roles,
                                    answer: value.toString()
                                };
                            }
                        }
                    } 
                });    
    
                
 
                this.sortedDataArray[key]["questionType"] = chartData.questions[key].questionType;
                if (typeof chartData.questions[key].type != "undefined") {
                    this.sortedDataArray[key]["type"] = chartData.questions[key].type;
                }
                if (typeof chartData.questions[key].range != "undefined") {
                    this.sortedDataArray[key]["range"] = chartData.questions[key].range;
                }
                //Slider questions
                if (chartData.questions[key].questionType == 1) {
                    if (chartData.questions[key].type == 0) {
                        let rangeKey: keyof typeof agreeDisagreeRanges = chartData.questions[key].range;
                        this.sortedDataArray[key]["questionLabels"] = agreeDisagreeRanges[rangeKey];
                    } else if (chartData.questions[key].type == 1) {
                        let valueRange = Array.from({length: chartData.questions[key].range}, (_, i) => i + 1);
                        this.sortedDataArray[key]["questionLabels"] = valueRange;
                    }
                }
            });
        });

        return this.sortedDataArray;
    }
    
}


