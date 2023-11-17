import { logObject } from "../utils/Log";
import { API_BASE_URL } from "./API";
import { Genre } from "../interfaces/Genre";
import { fetchData } from "./BaseAPI";

export async function getAllGenres(accessToken: string): Promise<Genre[]> {
	const url = `${API_BASE_URL}/genre`;

	return fetchData<Genre[]>(url, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
}
