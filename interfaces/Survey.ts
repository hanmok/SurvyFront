import { Question } from "./Question";
import { Section } from "./Section";

export interface Survey {
    id: number | undefined;
    userId: number | undefined;
    title: string;
    participationGoal: number;
    currentParticipation: number | undefined;
    initialSectionId: number | undefined;
    geoCode: number;
    targetMinAge: number;
    targetMaxAge: number;
    genreIds: number[];
    isTargetMale: number | null;
    reward: number;
    cost: number;
    numOfSections: number;
    sections: Section[];
}

export const makeSurvey = (
    userId: number,
    title: string,
    participationGoal: number,
    geoCode: number,
    targetMinAge: number,
    targetMaxAge: number,
    genreIds: number[],
    isTargetMale: number | undefined,
    reward: number,
    cost: number,
    numOfSections: number
) => {
    const survey: Survey = {
        id: undefined,
        userId: userId,
        title: title,
        participationGoal: participationGoal,
        // rewardRange: undefined,
        currentParticipation: 0,
        initialSectionId: undefined,
        geoCode: geoCode,
        targetMinAge: targetMinAge,
        targetMaxAge: targetMaxAge,
        genreIds: genreIds,
        isTargetMale: isTargetMale,
        reward: reward,
        cost: cost,
        numOfSections,
        sections: [],
    };
    return survey;
};

export interface SurveyProps {
    surveyTitle: string;
    sections: Section[];
    questions: Question[];
}
