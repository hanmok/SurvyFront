// export type SelectableOption = {
//     id: number | undefined;
//     questionId: number;
//     position: number;
//     value: string;
// };

import { randomNumber } from "../utils/GetRandomNumber";

export interface SelectableOption {
    id: number | undefined;
    questionId: number | undefined;
    position: number;
    value: string;
}

export const makeSelectableOption = (
    questionId: number,
    position: number,
    value: string
): SelectableOption => {
    const selectableOption: SelectableOption = {
        id: randomNumber,
        questionId: questionId,
        position: position,
        value: value,
    };
    return selectableOption;
};
