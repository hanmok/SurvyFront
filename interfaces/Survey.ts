import { Question } from "./Question";
import { Section } from "./Section";

export interface Survey {
    id: number | undefined;
    userId: number | undefined;
    title: string;
    participationGoal: number;
    currentParticipation: number;
    initialSectionId: number | undefined;
    geoCode: number;
    targetMinAge: number;
    targetMaxAge: number;
    genreIds: number[];
    isTargetMale: boolean | null;
    reward: number;
    cost: number;
}

export const makeSurvey = (
    userId: number,
    title: string,
    participationGoal: number,
    geoCode: number,
    targetMinAge: number,
    targetMaxAge: number,
    genreIds: number[],
    isTargetMale: boolean | undefined,
    reward: number,
    cost: number
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
    };
    return survey;
};

export interface SurveyProps {
    surveyTitle: string;
    sections: Section[];
    questions: Question[];
}
