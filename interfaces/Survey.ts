import { Genre } from "./Genre";
import { Question } from "./Question";
import { Section } from "./Section";

export interface Survey {
    id: number | undefined;
    userId: number | undefined;
    title: string;
    participationGoal: number;
    currentParticipation: number | undefined;
    initialSectionId: number | undefined;
    // geoCode: number;
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
}

export const makeSurvey = (
    userId: number,
    title: string,
    participationGoal: number,
    // geoCode: number,
    targetMinAge: number,
    targetMaxAge: number,
    genreIds: number[],
    geoIds: number[],
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
        // geoCode: geoCode,
        targetMinAge: targetMinAge,
        targetMaxAge: targetMaxAge,
        genreIds: genreIds,
        geoIds: geoIds,
        isTargetMale: isTargetMale,
        reward: reward,
        cost: cost,
        numOfSections,
        sections: [],
        genres: [],
    };
    return survey;
};

export interface SurveyProps {
    surveyTitle: string;
    sections: Section[];
    questions: Question[];
}
