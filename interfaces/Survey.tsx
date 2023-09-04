export interface Survey {
    id: number;
    title: string;
    participationGoal: number;
    currentParticipation: number;
    rewardRange: string;
    initialSectionId: number;
}

// export interface Question {
//     id: number;
//     title: string;
//     selectableOptionTitles: string[];
//     isOptional: boolean;
// }
