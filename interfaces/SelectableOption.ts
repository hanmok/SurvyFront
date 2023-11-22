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
