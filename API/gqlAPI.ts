import { logObject } from "../utils/Log";
import { GQL_URL } from "./API";
// import { fetchAllPostedSurveys, greeting } from "./gqlQuery";
import { getPostedSurveysQuery, greeting } from "./gqlQuery";
import { getSurveyQuery } from "./gqlQuery";

export const fetchGreeting = async () => {
    console.log("fetchGreeting called");
    const response = await fetch(GQL_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: greeting,
        }),
    });

    const { data } = await response.json();
    logObject("gql test, data: ", data);
    return data.greeting;
};

export async function getSurvey(surveyId: number) {
    const response = await fetch(GQL_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: getSurveyQuery(surveyId),
        }),
    });
    const { data } = await response.json();
    // const result = JSON.stringify(data);
    // logObject(`[getPostedSurveys]: `, result);
    logObject("[getSurvey] fetch data: ", data);
    return data;
}

export async function getPostedSurveys(userId: number) {
    const response = await fetch(GQL_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: getPostedSurveysQuery(userId),
        }),
    });
    const { data } = await response.json();
    // const result = JSON.stringify(data);
    // logObject(`[getPostedSurveys]: `, result);
    logObject("[getPostedSurveysQuery] fetch data: ", data);
    return data;
}
