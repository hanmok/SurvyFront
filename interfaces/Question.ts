import { QuestionType } from "../QuestionType";
import { makeRandomNumber, randomNumber } from "../utils/GetRandomNumber";
import { SelectableOption } from "./SelectableOption";

export interface Question {
    id: number | undefined;
    expectedTimeInSec: number | undefined;
    sectionId: number | undefined;
    position: number;
    text: string;
    questionType: QuestionType;
    selectableOptions: SelectableOption[];
}

export const makeQuestion = (
    position: number,
    text: string,
    questionType: QuestionType,
    sectionId: number,
    selectableOptions: SelectableOption[]
): Question => {
    const question: Question = {
        // id: Math.floor(Math.random() * 1000000),
        // id: randomNumber,

        id: makeRandomNumber(),
        expectedTimeInSec: undefined,
        position: position,
        sectionId: sectionId,
        text: text,
        questionType: questionType,
        selectableOptions: selectableOptions,
    };
    return question;
};
