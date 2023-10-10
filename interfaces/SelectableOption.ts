// export type SelectableOption = {
//     id: number | undefined;
//     questionId: number;
//     position: number;
//     value: string;
// };

import { makeRandomNumber, randomNumber } from "../utils/GetRandomNumber";

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
    return selectableOption;
};
