import { makeRandomNumber, randomNumber } from "../utils/GetRandomNumber";
import { logObject } from "../utils/Log";

export interface SelectableOption {
    id: number | undefined;
    questionId: number | undefined;
    position: number;
    value: string;
    isExtra: number | undefined;
}

export const makeSelectableOption = (
    questionId: number,
    position: number,
    value: string,
    isExtra: number
): SelectableOption => {
    const selectableOption: SelectableOption = {
        id: makeRandomNumber(),
        questionId: questionId,
        position: position,
        value: value,
        isExtra: isExtra,
    };
    logObject("make selectableOption called, ", selectableOption);
    return selectableOption;
};

export class SelectableOptionBuilder {
    private selectableOption: SelectableOption;

    constructor(
        questionId: number,
        position: number,
        value: string,
        isExtra: number
    ) {
        this.selectableOption = {
            id: makeRandomNumber(),
            questionId,
            position,
            value,
            isExtra,
        };
    }
    build(): SelectableOption {
        return this.selectableOption;
    }
}
