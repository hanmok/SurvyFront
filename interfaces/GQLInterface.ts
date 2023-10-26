export interface GQLQuestionType {
    id: number;
    name: string;
}

export interface GQLPosting {
    id: number;
    user: GQLUser;
    survey: GQLSurvey;
    surveys: [GQLSurvey] | undefined;
}

export interface GQLParticipating {
    id: number;
    sequence: number;
    user: GQLUser;
    survey: GQLSurvey;
}

export interface GQLSection {
    id: number;
    survey: GQLSurvey;
    title: string;
    reward: number | undefined;
    questions: [GQLQuestion];
    sequence: number;
}

export interface GQLQuestion {
    id: number;
    section: GQLSection;
    position: number;
    text: string;
    questionType: GQLQuestionType;
    survey: GQLSurvey;
    selectableOptions: [GQLSelectableOption];
}

export interface GQLSelectableOption {
    id: number;
    question: GQLQuestion;
    position: number;
    value: string;
    section: GQLSection;
    isExtra: number;
}

export interface GQLUser {
    id: number;
    username: string;
    collectedReward: number;
    birthDate: string;
    nickname: string;
    isMale: number;
    deviceToken: string;
    postedSurveys: [GQLSurvey];
    participatedSurveys: [GQLSurvey];
}

export interface GQLSurvey {
    id: number;
    title: string;
    currentParticipation: number;
    participationGoal: number;
    createdAt: string;
    endedAt: string;
    reward: number;
    code: string;
    isPublic: number;
    isCompleted: number;
    sections: [GQLSection];
}

export interface GQLAnswer {
    id: number;
    question: GQLQuestion;
    selectableOption: GQLSelectableOption;
    user: GQLUser;
    survey: GQLSurvey;
    answerText: string;
}
