import { GQLSurvey } from "../interfaces/GQLInterface";

export interface PostedSurveyResponse {
    user: {
        posted_surveys: GQLSurvey[];
    };
}
