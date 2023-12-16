import { API_BASE_URL } from "../API";
import BaseApi from "../BaseAPI";

export class SurveyService extends BaseApi {
    async getParticipatedSurveyIds(
        userId: number,
        accessToken: string
    ): Promise<ApiResponse<number[]>> {
        const url = `${API_BASE_URL}/participating/user/${userId}/participated-surveys`;
        return this.fetchData<number[]>(url, "GET", undefined, accessToken);
    }

    async fetchParticipatedSurveys(
        userId: number,
        accessToken: string
    ): Promise<ApiResponse<number[]>> {
        const url = `${API_BASE_URL}/user/${userId}/participated-surveys`;
        return this.fetchData<number[]>(url, "GET", undefined, accessToken);
    }

    async getPostedSurveyIds(
        userId: number,
        accessToken: string
    ): Promise<ApiResponse<number[]>> {
        const url = `${API_BASE_URL}/posting/user/${userId}/posted-surveys`;
        return this.fetchData<number[]>(url, "GET", undefined, accessToken);
    }
}
