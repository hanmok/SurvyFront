export interface CustomAnswer {
    selectableOptionId: number;
    sequence: number;
    answerText: string;
}

export interface Answer {
    questionId: number;
    selectableOptionId: number;
    userId: number;
    surveyId: number;
    answerText: string | undefined;
}
