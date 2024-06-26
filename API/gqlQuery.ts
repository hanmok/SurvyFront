import { gql } from "@apollo/client";

export const participatedSurveyQuery = gql`
    query ParticipatedSurveys($userId: ID!) {
        user(id: $userId) {
            participated_surveys {
                title
                reward
                id
                created_at
            }
        }
    }
`;

export const postedSurveyQuery = gql`
    query postedSurveys($userId: ID!) {
        user(id: $userId) {
            posted_surveys {
                code
                title
                participation_goal
                current_participation
                id
                created_at
            }
        }
    }
`;

export const getSurveyQuery = gql`
    query Survey($surveyId: ID!) {
        survey(id: $surveyId) {
            title
            current_participation
            sections {
                sequence
                questions {
                    id
                    position
                    text
                    question_type {
                        id
                    }
                    selectable_options {
                        id
                        position
                        value
                        is_extra
                    }
                }
            }
        }
    }
`;

export const getAnswersQuery = gql`
    query Answers($surveyId: ID!) {
        answers(survey_id: $surveyId) {
            id
            question {
                id
            }
            selectable_option {
                id
                value
            }
            user {
                id
            }
            answer_text
        }
    }
`;

export const getParticipatingQuery = gql`
    query Participatings($surveyId: ID!) {
        participatings(survey_id: $surveyId) {
            user {
                id
            }
            sequence
        }
    }
`;
