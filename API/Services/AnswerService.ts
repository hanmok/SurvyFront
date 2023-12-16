// import { QuestionInOrder } from "../AnswerAPI";
import { API_BASE_URL } from "../API";
import BaseApi from "../BaseAPI";
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

export class AnswerService extends BaseApi {
    async postAnswer(
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

        const body = _.mapKeys(data, (value, key) => _.snakeCase(key));

        return this.fetchData(url, "POST", body, accessToken);
    }

    async getResultSheet(
        surveyId: number,
        accessToken: string
    ): Promise<ApiResponse<SheetData>> {
        const url = `${API_BASE_URL}/survey/${surveyId}/sheet`;
        return this.fetchData<SheetData>(url, "GET", undefined, accessToken);
    }
}
