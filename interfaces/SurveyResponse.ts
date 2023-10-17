import { Answer, GQLAnswer } from "./Answer";
import { Survey } from "./Survey";

export interface SurveyResponse {
    survey: Survey;
}

export interface AnswerResponse {
    // answers: Answer[];
    answers: GQLAnswer[];
}
