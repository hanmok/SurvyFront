import { CustomAnswer } from "../features/selector/selectorSlice";
import { printObject } from "../utils/printObject";
import { API_BASE_URL } from "./API";
import _ from "lodash";

export async function postSelectionAnswer(
    surveyId: number,
    userId: number,
    questionId: number,
    selectableOptionId: number
): Promise<ApiResponse> {
    const url = `${API_BASE_URL}/answer`;
    const data = { surveyId, userId, questionId, selectableOptionId };
    printObject(data, "postSelectionAnswer");
    const snakeData = _.mapKeys(data, (value, key) => _.snakeCase(key));
    printObject(snakeData, "postSelectionAnswer snake");

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(snakeData),
        });

        if (!response.ok) {
            console.log("postSelectionAnswer error!!");
            throw new Error("postSelectionAnswer error!!");
        }

        const responseData: ApiResponse = await response.json();
        console.log(`status: ${responseData.statusCode}`);

        return responseData;
    } catch (error) {
        console.log("postSelectionAnswer error!");
        console.log(error);
        throw error;
    }
}

export async function postTextAnswer(
    customAnswer: CustomAnswer,
    userId: number
): Promise<ApiResponse> {
    const url = `${API_BASE_URL}/custom-answer`;

    const { selectableOptionId, sequence, answerText } = customAnswer;
    const data = { selectableOptionId, sequence, answerText, userId };
    // console.log(`data from postTextAnswer: ${data}`);
    printObject(data, "postTextAnswer");
    const snakeData = _.mapKeys(data, (value, key) => _.snakeCase(key));
    // console.log(`snakeData form postTextAnswer: ${snakeData}`);
    printObject(snakeData, "postTextAnswer snake");
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(snakeData),
        });

        if (!response.ok) {
            console.log("postTextAnswer error!!");
            throw new Error("postTextAnswer Network response was not ok");
        }
        const responseData: ApiResponse = await response.json();
        return responseData;
    } catch (error) {
        console.log("postTextAnswer error");
        throw error;
    }
}

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
        console.log("createParticipate error");
        throw error;
    }
}
