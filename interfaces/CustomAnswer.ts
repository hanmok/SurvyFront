/** selectableOptionId, questionId, answerText */
export interface CustomAnswer {
    selectableOptionId: number;
    questionId: number;
    answerText: string;
}

export const makeCustomAnswer = (
    selectableOptionId: number,
    questionId: number,
    answerText: string
) => {
    const customAnswer: CustomAnswer = {
        selectableOptionId,
        questionId,
        answerText,
    };
    return customAnswer;
};
