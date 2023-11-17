// import { CustomAnswer } from "../features/selector/selectorSlice";
import { CustomAnswer } from "../interfaces/CustomAnswer";
import { log, logObject } from "../utils/Log";
import { printObject } from "../utils/printObject";
import { API_BASE_URL } from "./API";
import _ from "lodash";

export interface QuestionInOrder {
    id: number;
    position: number;
    text: string;
}

export interface SheetData {
    questionInOrder: QuestionInOrder[];
    userResponses: string[][];
}

export async function postAnswer(
    surveyId: number,
    questionId: number,
    selectableOptionId: number,
    answerText: string,
    userId: number,
    accessToken: string
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

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(snakeData),
        });

        if (!response.ok) {
            logObject("postingData", snakeData);
            throw new Error("postAnswer error!!");
        }

        const responseData: ApiResponse = await response.json();
        console.log(`status: ${responseData.statusCode}`);

        return responseData;
    } catch (error) {
        console.error("postAnswer error!", error);
        throw error;
    }
}

export async function createParticipate(
    surveyId: number,
    userId: number,
    accessToken: string
    // sectionId: number
): Promise<ApiResponse> {
    const url = `${API_BASE_URL}/participating`;
    const data = { surveyId, userId };

    const snakeData = _.mapKeys(data, (value, key) => _.snakeCase(key));
    logObject("createParticipate called, ", snakeData);
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
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

export async function getResultSheet(
    surveyId: number,
    accessToken: string
): Promise<ApiResponse<SheetData>> {
    const url = `${API_BASE_URL}/survey/${surveyId}/sheet`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) {
            throw new Error("get All Response error!!");
        }

        const responseData: ApiResponse<SheetData> = await response.json();
        return responseData;
    } catch (error) {
        throw error;
    }
}
