/** selectableOptionId, sequence, answerText */

/** questionId, selectableOptionId, userId, surveyId, answerText */

export interface Answer {
    questionId: number;
    selectableOptionId: number;
    userId: number;
    surveyId: number;
    answerText: string | undefined;
}
