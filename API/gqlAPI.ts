import { logObject } from "../utils/Log";
import { GQL_URL } from "./API";
// import { fetchAllPostedSurveys, greeting } from "./gqlQuery";
import {
    // getParticipatedSurveysQuery,
    // getPostedSurveysQuery,
    greeting,
} from "./gqlQuery";
import { getSurveyQuery } from "./gqlQuery";

// return type 도 정해줘야 할 것 같은데 ??
const makeGQL = async (query, message) => {
    const response = await fetch(GQL_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: query,
        }),
    });
    const { data } = await response.json();
    logObject(`[${message}]`, data);
    return data;
};

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

// export async function getSurvey(surveyId: number) {
//     const response = await fetch(GQL_URL, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             query: getSurveyQuery(surveyId),
//         }),
//     });
//     const { data } = await response.json();
//     // const result = JSON.stringify(data);
//     // logObject(`[getPostedSurveys]: `, result);
//     logObject("[getSurvey] fetch data: ", data);
//     return data;
// }

// export async function getPostedSurveys(userId: number) {
//     const response = await fetch(GQL_URL, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             query: getPostedSurveysQuery(userId),
//         }),
//     });
//     const { data } = await response.json();
//     logObject("[getPostedSurveysQuery] fetch data: ", data);
//     return data;
// }

// export async function getParticipatedSurveys(userId: number) {
//     const response = await fetch(GQL_URL, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             query: getParticipatedSurveysQuery(userId),
//         }),
//     });
//     const { data } = await response.json();
//     logObject("[getPostedSurveysQuery] fetch data: ", data);
//     return data;
// }
