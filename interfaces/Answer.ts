/** selectableOptionId, sequence, answerText */

/** questionId, selectableOptionId, userId, surveyId, answerText */

export interface Answer {
    questionId: number;
    selectableOptionId: number;
    userId: number;
    surveyId: number;
    answerText: string | undefined;
}

// export interface GQLAnswer {
//     id: number;
//     question: { id: number };
//     selectableOption: { id: number; value: string };
//     answerText: string | undefined;
// }
