// import { CustomAnswer } from "../features/selector/selectorSlice";
import { CustomAnswer } from "../interfaces/CustomAnswer";
import { printObject } from "../utils/printObject";
import { API_BASE_URL } from "./API";
import _ from "lodash";

export async function postAnswer(
    surveyId: number,
    questionId: number,
    selectableOptionId: number,
    answerText: string,
    userId: number
): Promise<ApiResponse> {
    const url = `${API_BASE_URL}/answer`;
    const data = {
        surveyId,
        questionId,
        selectableOptionId,
        answerText,
        userId,
    };
    const snakeData = _.mapKeys(data, (value, key) => _.snakeCase(key));
    printObject(snakeData, "[AnswerAPI] postAnswer");

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(snakeData),
        });

        if (!response.ok) {
            throw new Error("postSelectionAnswer error!!");
        }

        const responseData: ApiResponse = await response.json();
        console.log(`status: ${responseData.statusCode}`);

        return responseData;
    } catch (error) {
        console.error("postSelectionAnswer error!", error);
        throw error;
    }
}

// export async function postTextAnswer(
//     customAnswer: CustomAnswer,
//     userId: number
// ): Promise<ApiResponse> {
//     const url = `${API_BASE_URL}/custom-answer`;

//     const { selectableOptionId, sequence, answerText } = customAnswer;
//     const data = { selectableOptionId, sequence, answerText, userId };
//     // console.log(`data from postTextAnswer: ${data}`);
//     const snakeData = _.mapKeys(data, (value, key) => _.snakeCase(key));
//     printObject(snakeData, "postTextAnswer snake");
//     try {
//         const response = await fetch(url, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(snakeData),
//         });

//         if (!response.ok) {
//             console.log("postTextAnswer error!!");
//             // console.error
//             throw new Error("postTextAnswer Network response was not ok");
//         }
//         const responseData: ApiResponse = await response.json();
//         return responseData;
//     } catch (error) {
//         console.error("postTextAnswer Error", error);
//         throw error;
//     }
// }

export async function createParticipate(
    surveyId: number,
    userId: number
    // sectionId: number
): Promise<ApiResponse> {
    const url = `${API_BASE_URL}/participating`;
    // const data = { surveyId, userId, sectionId };
    const data = { surveyId, userId };

    const snakeData = _.mapKeys(data, (value, key) => _.snakeCase(key));

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(snakeData),
        });

        if (!response.ok) {
            console.log("createParticipate error!!");
            throw new Error("Network response was not ok");
        }

        const responseData: ApiResponse = await response.json();
        console.log(`status: ${responseData.statusCode}`);

        return responseData;
    } catch (error) {
        console.error("createParticipate error", error);
        throw error;
    }
}
