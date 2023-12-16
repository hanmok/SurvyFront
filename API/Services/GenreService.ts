import { Genre } from "../../interfaces/Genre";
import { API_BASE_URL } from "../API";
import BaseApi from "../BaseAPI";

export class GenreService extends BaseApi {
    async getAllGenres(accessToken: string): Promise<ApiResponse<Genre[]>> {
        const url = `${API_BASE_URL}/genre`;
        return this.fetchData<Genre[]>(url, "GET", undefined, accessToken);
    }
}
