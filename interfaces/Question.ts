import { makeRandomNumber } from "../utils/GetRandomNumber";
import { SelectableOption } from "./SelectableOption";

export interface Question {
    id: number | undefined;
    expectedTimeInSec: number | undefined;
    sectionId: number | undefined;
    position: number;
    text: string;
    questionTypeId: number;
    questionType: { id: number };
    selectableOptions: SelectableOption[];
}

export const makeQuestion = (
    position: number,
    text: string,
    questionTypeId: number,
    selectableOptions: SelectableOption[]
): Question => {
    const question: Question = {
        id: makeRandomNumber(),
        expectedTimeInSec: undefined,
        sectionId: undefined,
        position: position,
        text: text,
        questionType: undefined,
        questionTypeId: questionTypeId,
        selectableOptions: selectableOptions,
    };
    return question;
};
