import { Withdrawal } from "../../interfaces/Withdrawal";
import { API_BASE_URL } from "../API";
import BaseApi from "../BaseAPI";

export class WithdrawalService extends BaseApi {
    async create(
        accessToken: string,
        user_id: number,
        amount: number
    ): Promise<ApiResponse<Withdrawal>> {
        const url = `${API_BASE_URL}/withdrawal`;
        const body = { user_id, amount };
        return this.fetchData<Withdrawal>(url, "POST", body, accessToken);
    }

    async fetch(
        accessToken: string,
        userId: number
    ): Promise<ApiResponse<Withdrawal[]>> {
        const url = `${API_BASE_URL}/withdrawal/${userId}`;
        return this.fetchData<Withdrawal[]>(url, "GET", undefined, accessToken);
    }

    async patch(accessToken: string, id: number) {
        const url = `${API_BASE_URL}/withdrawal/${id}`;
        return this.fetchData(url, "PATCH", undefined, accessToken);
    }
}
