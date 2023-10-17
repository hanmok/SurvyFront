// import { Answer, GQLAnswer } from "./Answer";
import { GQLAnswer, GQLSurvey } from "./GQLInterface";
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
