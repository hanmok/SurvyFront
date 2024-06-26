import { Genre } from "./Genre";
import { Question } from "./Question";
import { Section } from "./Section";
/** id, title, createdAt, ... */
export interface Survey {
    id: number | undefined;
    userId: number | undefined;
    title: string;
    participationGoal: number;
    currentParticipation: number | undefined;
    initialSectionId: number | undefined;
    targetMinAge: number;
    targetMaxAge: number;
    genreIds: number[];
    geoIds: number[];
    isTargetMale: number | null;
    reward: number;
    cost: number;
    numOfSections: number;
    sections: Section[];
    genres: Genre[];
    createdAt: string;
    expectedTimeInSec: number;
}

export class SurveyBuilder {
    private survey: Survey;

    constructor(
        public userId: number,
        public title: string,
        public participationGoal: number,
        public targetMinAge: number,
        public targetMaxAge: number,
        public genreIds: number[],
        public geoIds: number[],
        public isTargetMale: number | undefined,
        public reward: number,
        public cost: number,
        public numOfSections: number,
        public expectedTimeInSec: number
    ) {
        this.survey = {
            userId,
            title,
            participationGoal,
            targetMinAge,
            targetMaxAge,
            genreIds,
            geoIds,
            isTargetMale,
            reward,
            cost,
            initialSectionId: undefined,
            currentParticipation: 0,
            createdAt: "",
            id: undefined,
            numOfSections,
            sections: [],
            genres: [],
            expectedTimeInSec,
        };
    }

    build(): Survey {
        return this.survey;
    }
}

export interface SurveyProps {
    surveyTitle: string;
    sections: Section[];
    questions: Question[];
    expectedTimeInSec: number;
}
