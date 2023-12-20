import BaseApi from "../BaseAPI";
import { API_BASE_URL } from "../API";
import _ from "lodash";

export class ParticipatingService extends BaseApi {
    async create(
        surveyId: number,
        userId: number,
        accessToken: string
    ): Promise<ApiResponse<any>> {
        const url = `${API_BASE_URL}/participating`;
        const data = { surveyId, userId };
        const snakeData = _.mapKeys(data, (value, key) => _.snakeCase(key));

        return this.fetchData(url, "POST", snakeData, accessToken);
    }

    async patch(
        accessToken: string,
        userId: number,
        surveyId: number,
        isHonest: boolean
    ) {
        const url = `${API_BASE_URL}/participating/user/${userId}/survey/${surveyId}`;
        const body = { is_honest: isHonest };
        return this.fetchData(url, "PATCH", body, accessToken);
    }
}
