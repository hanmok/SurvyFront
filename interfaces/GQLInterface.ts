import { log, logObject } from "../utils/Log";

export interface GQLQuestionType {
    id: string;
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
/** id, username, collectedReward, ... */
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
    sections: [GQLSection]; // FIXME: 이게 맞아? 일단.. 잘 되고 있으니까 놔두기.
}

// export function isGQLSurvey(item: any): item is GQLSurvey {
//     return (
//         item &&
//         typeof item.id === "number" &&
//         typeof item.title === "string" &&
//         typeof item.currentParticipation === "number"
//     )
// }

export function isGQLSurvey(item: any): item is GQLSurvey {
    const ret = typeof item?.id === "string" && typeof item?.title === "string";
    // &&
    typeof item?.currentParticipation === "number" &&
        typeof item?.participationGoal === "number" &&
        // typeof item?.createdAt === "string" &&
        // typeof item?.endedAt === "string" &&
        // typeof item?.reward === "number" &&
        typeof item?.code === "string";
    // typeof item?.isPublic === "number" &&
    // typeof item?.isCompleted === "number" &&
    // Array.isArray(item?.sections) &&
    // item.sections.every(
    //     (section: GQLSection) =>
    //         typeof section?.id === "number" &&
    //         typeof section?.title === "string"
    // )
    logObject("obj:", item);
    log(`isGQL? : ${ret}`);
    return ret;
}

/** id, question, selectableOption, user, survey, answerText */
export interface GQLAnswer {
    id: number;
    question: GQLQuestion;
    selectableOption: GQLSelectableOption;
    user: GQLUser;
    survey: GQLSurvey;
    answerText: string;
}
