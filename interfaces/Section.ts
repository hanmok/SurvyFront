import { makeRandomNumber } from "../utils/GetRandomNumber";
import { Question } from "./Question";

export interface Section {
    id: number | undefined;
    surveyId: number | undefined;
    expectedTimeInSec: number | undefined;
    reward: number | undefined;
    sequence: number;
    questions: Question[] | undefined;
    // title: string | undefined;
}

// Section 을 처음 만들 땐, reward, expectedTimeInSec 모두 없음. Title 도 일단 보류.
// export const makeSection = (sequence: number): Section => {
//     const section: Section = {
//         id: makeRandomNumber(),
//         surveyId: undefined,
//         sequence: sequence,
//         reward: undefined,
//         expectedTimeInSec: undefined,
//         questions: [],
//     };
//     return section;
// };

export class SectionBuilder {
    private section: Section;

    constructor(sequence: number) {
        this.section = {
            id: makeRandomNumber(),
            surveyId: undefined,
            sequence,
            reward: undefined,
            questions: [],
            expectedTimeInSec: undefined,
        };
    }
    build(): Section {
        return this.section;
    }
}
