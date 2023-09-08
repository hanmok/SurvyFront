export interface Survey {
    id: number | undefined;
    userId: number | undefined;
    title: string;

    participationGoal: number;
    currentParticipation: number;
    rewardRange: string | undefined;
    initialSectionId: number | undefined;
}

export const makeSurvey = (
    userId: number,
    title: string,
    participationGoal: number
) => {
    const survey: Survey = {
        id: undefined,
        userId: userId,
        title: title,
        participationGoal: participationGoal,
        rewardRange: undefined,
        currentParticipation: 0,
        initialSectionId: undefined,
    };
    return survey;
};
// export interface Question {
//     id: number;
//     title: string;
//     selectableOptionTitles: string[];
//     isOptional: boolean;
// }
