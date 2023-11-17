export interface ApiOptions {
	method?: string;
	headers?: Record<string, string>;
	body?: string;
}

export async function fetchData<T>(
	url: string,
	options: ApiOptions
): Promise<T> {
	try {
		const response = await fetch(url, options);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		// return response.json().data;
		const apiResponse = await response.json();
		return apiResponse.data;
	} catch (error) {
		console.log(`${url} API call failed: ${error.message}`);
		throw error;
	}
}
