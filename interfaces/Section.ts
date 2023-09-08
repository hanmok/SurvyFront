import { makeRandomNumber } from "../utils/GetRandomNumber";

export interface Section {
    id: number | undefined;
    surveyId: number | undefined;
    title: string;
    expectedTimeInSec: number;
    reward: number;
}

export const makeSection = (
    // id: number,
    title: string,
    reward: number,
    expectedTimeInSec: number
): Section => {
    const section: Section = {
        // id: makeRandomNumber(),
        id: makeRandomNumber(),
        title: title,
        reward: reward,
        surveyId: undefined,
        expectedTimeInSec: expectedTimeInSec,
    };
    return section;
};
