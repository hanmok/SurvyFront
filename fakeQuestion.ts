import { QuestionType } from "./QuestionType";

export const fakeQuestions = [
    {
        id: 1,
        position: 0,
        text: "내 설문조사 질문 1",
        expectedTimeInSec: 0,
        required: 1,
        questionType: QuestionType.SingleSelection,
        selectableOptions: [
            {
                id: 1,
                questionId: 1,
                value: "User Input Option 1",
                position: 0,
            },
            {
                id: 2,
                questionId: 1,
                value: "User Input Option 2",
                position: 1,
            },
        ],
    },
    {
        id: 2,
        position: 1,
        text: "내 설문조사 질문 2",
        expectedTimeInSec: 0,
        required: 1,
        questionType: QuestionType.MultiSelection,
        selectableOptions: [
            {
                id: 3,
                questionId: 2,
                value: "User Input Option 3",
                position: 0,
            },
            {
                id: 4,
                questionId: 2,
                value: "User Input Option 4",
                position: 1,
            },
        ],
    },
];
