import { makeRandomNumber } from "../utils/GetRandomNumber";
import { log, logObject } from "../utils/Log";
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
// export const makeSection = (
//     sequence: number
//     // title: string,
//     // reward: number,
//     // expectedTimeInSec: number,
// ): Section => {
//     const section: Section = {
//         id: makeRandomNumber(),
//         surveyId: undefined,
//         sequence: sequence,
//         reward: undefined,
//         expectedTimeInSec: undefined,
//         questions: [],
//         // title: title,
//         // reward: reward,
//         // expectedTimeInSec: expectedTimeInSec,
//     };
//     return section;
// };

export class SectionBuilder {
    section: Section;
    constructor(sequence: number) {
        // this.section = makeSection(sectionNumber);
        // log(`section number passed ${sectionNumber}`);
        // logObject("section created", this.section);
        this.section = {
            id: undefined,
            surveyId: undefined,
            expectedTimeInSec: undefined,
            reward: undefined,
            sequence,
            questions: undefined,
        };
    }

    setQuestions(questions: Question[]) {
        this.section.questions = questions;
        return this;
    }

    build() {
        logObject("returning section", this.section);
        return this.section;
    }
}
