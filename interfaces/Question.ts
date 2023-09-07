import { QuestionType } from "../QuestionType";
import { randomNumber } from "../utils/GetRandomNumber";
import { SelectableOption } from "./SelectableOption";

export interface Question {
    id: number | undefined;
    expectedTimeInSec: number | undefined;
    required: number | undefined;
    position: number;
    text: string;
    questionType: QuestionType;
    selectableOptions: SelectableOption[];
}

export const makeQuestion = (
    position: number,
    text: string,
    questionType: QuestionType,
    selectableOptions: SelectableOption[]
): Question => {
    const question: Question = {
        // id: Math.floor(Math.random() * 1000000),
        id: randomNumber,
        expectedTimeInSec: undefined,
        required: 1,
        position: position,
        text: text,
        questionType: questionType,
        selectableOptions: selectableOptions,
    };
    return question;
};
