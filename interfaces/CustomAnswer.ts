/** selectableOptionId, questionId, answerText */
export interface CustomAnswer {
    selectableOptionId: number;
    questionId: number;
    answerText: string;
    questionIndex: number;
}

export const makeCustomAnswer = (
    selectableOptionId: number,
    questionId: number,
    answerText: string,
    questionIndex: number
) => {
    const customAnswer: CustomAnswer = {
        selectableOptionId,
        questionId,
        answerText,
        questionIndex,
    };
    return customAnswer;
};
