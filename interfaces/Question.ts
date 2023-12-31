import { makeRandomNumber } from "../utils/GetRandomNumber";
import { SelectableOption } from "./SelectableOption";

/** id, position, text, questionTypeId, questionType, selectableOptions */
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

export class QuestionBuilder {
    private question: Question;

    constructor(
        public position: number,
        public text: string,
        public questionTypeId: number,
        public selectableOptions: SelectableOption[]
    ) {
        this.question = {
            id: makeRandomNumber(),
            position,
            text,
            questionTypeId,
            selectableOptions,
            expectedTimeInSec: undefined,
            sectionId: undefined,
            questionType: undefined,
        };
    }

    build(): Question {
        return this.question;
    }
}
