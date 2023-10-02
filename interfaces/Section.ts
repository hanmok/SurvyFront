import { makeRandomNumber } from "../utils/GetRandomNumber";

export interface Section {
    id: number | undefined;
    surveyId: number | undefined;
    title: string | undefined;
    expectedTimeInSec: number;
    reward: number;
}

export const makeSection = (
    title: string,
    reward: number,
    expectedTimeInSec: number
): Section => {
    const section: Section = {
        id: makeRandomNumber(),
        title: title,
        reward: reward,
        surveyId: undefined,
        expectedTimeInSec: expectedTimeInSec,
    };
    return section;
};
