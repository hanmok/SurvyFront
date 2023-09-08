import { QuestionType } from "./QuestionType";

export const fakeQuestions = [
    {
        id: 456456,
        sectionId: 264,
        position: 0,
        text: "내 설문조사 질문 1",
        expectedTimeInSec: 0,
        questionType: QuestionType.SingleSelection,
        selectableOptions: [
            {
                id: 78954,
                questionId: 456456,
                value: "User Input Option 1",
                position: 0,
            },
            {
                id: 153486,
                questionId: 456456,
                value: "User Input Option 2",
                position: 1,
            },
        ],
    },
    {
        id: 123123,
        position: 1,
        sectionId: 264,
        text: "내 설문조사 질문 2",
        expectedTimeInSec: 0,
        questionType: QuestionType.MultiSelection,
        selectableOptions: [
            {
                id: 468513,
                questionId: 123123,
                value: "User Input Option 3",
                position: 0,
            },
            {
                id: 468531,
                questionId: 123123,
                value: "User Input Option 4",
                position: 1,
            },
        ],
    },
];
