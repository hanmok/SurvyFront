import { QuestionType } from "../QuestionType";
import { makeRandomNumber, randomNumber } from "../utils/GetRandomNumber";
import { SelectableOption } from "./SelectableOption";

export interface Question {
    id: number | undefined;
    expectedTimeInSec: number | undefined;
    sectionId: number | undefined;
    position: number;
    text: string;
    // questionType: QuestionType;
    questionTypeId: number;
    questionType: { id: number };
    selectableOptions: SelectableOption[];
}

export const makeQuestion = (
    position: number,
    text: string,
    // questionType: QuestionType,
    questionTypeId: number,
    // sectionId: number | undefined,
    selectableOptions: SelectableOption[]
): Question => {
    const question: Question = {
        // id: Math.floor(Math.random() * 1000000),
        // id: randomNumber,

        id: makeRandomNumber(),
        expectedTimeInSec: undefined,
        sectionId: undefined,
        position: position,
        // sectionId: sectionId || undefined,
        text: text,
        // questionType: questionType,
        questionType: undefined,
        questionTypeId: questionTypeId,
        selectableOptions: selectableOptions,
    };
    return question;
};
