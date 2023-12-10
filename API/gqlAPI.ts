import { logObject } from "../utils/Log";
import { GQL_URL } from "./API";

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
export default makeGQL;
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
