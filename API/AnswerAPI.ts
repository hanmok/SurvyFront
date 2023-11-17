// import { CustomAnswer } from "../features/selector/selectorSlice";
import { CustomAnswer } from "../interfaces/CustomAnswer";
import { log, logObject } from "../utils/Log";
import { printObject } from "../utils/printObject";
import { API_BASE_URL } from "./API";
import _ from "lodash";
import { fetchData } from "./BaseAPI";

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
) {
	const url = `${API_BASE_URL}/answer`;
	const data = {
		surveyId,
		questionId,
		selectableOptionId,
		answerText,
		userId,
	};

	const snakeData = _.mapKeys(data, (value, key) => _.snakeCase(key));

	return fetchData(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(snakeData),
	});
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

	return fetchData(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(snakeData),
	});
}

export async function getResultSheet(
	surveyId: number,
	accessToken: string
): Promise<SheetData> {
	const url = `${API_BASE_URL}/survey/${surveyId}/sheet`;
	return fetchData<SheetData>(url, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
}
