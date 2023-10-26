// import { Answer, GQLAnswer } from "./Answer";
import { GQLAnswer, GQLParticipating, GQLSurvey } from "./GQLInterface";
import { Survey } from "./Survey";

export interface SurveyResponse {
    survey: Survey;
}

export interface GQLSurveyResponse {
    survey: GQLSurvey;
}

export interface GQLAnswerResponse {
    // answers: Answer[];
    answers: GQLAnswer[];
}

export interface GQLParticipatingResponse {
    participatings: GQLParticipating[];
}
