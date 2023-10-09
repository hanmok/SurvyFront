// import { fetchAllPostedSurveys } from "./gqlQuery";
import { gql } from "@apollo/client";

export const greeting = gql`
    query {
        greeting
    }
`;

// export const greeting = "query { greeting }";

export const participatedSurveyQuery = gql`
    query ParticipatedSurveys($userId: ID!) {
        user(id: $userId) {
            participated_surveys {
                title
                reward
                id
            }
        }
    }
`;

// 이렇게 사용하기!
export const postedSurveyQuery = gql`
    query postedSurveys($userId: ID!) {
        user(id: $userId) {
            posted_surveys {
                code
                title
                created_at
                participation_goal
                current_participation
            }
        }
    }
`;

export const getSurveyQuery = gql`
    query Survey($surveyId: ID!) {
        survey(id: $surveyId) {
            sections {
                sequence
                questions {
                    id
                    position
                    text
                    question_type_id
                    selectable_options {
                        id
                        position
                        value
                    }
                }
            }
        }
    }
`;
