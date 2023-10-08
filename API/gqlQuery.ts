// import { fetchAllPostedSurveys } from "./gqlQuery";
import { gql } from "@apollo/client";

export const greeting = gql`
    query {
        greeting
    }
`;

// export const greeting = "query { greeting }";

export const getSurveyQuery = (surveyId: number) => {
    return `query {
		survey(id: "${surveyId}") {
		  sections {
			id
			sequence
			questions {
			  id
			  text
			}
		  }
		} 
	  }`;
};

export const getPostedSurveysQuery = (userId: number) => {
    return `query { 
		user(id: "${userId}") {
			postedSurveys {
			  title
			  created_at
			}
		  }
	}`;
};
