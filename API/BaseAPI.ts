import showToast from "../components/common/toast/Toast";
import showAdminToast from "../components/common/toast/showAdminToast";
import { logObject } from "../utils/Log";

export interface ApiOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}

export async function fetchData<T>(
    url: string,
    options: ApiOptions,
    message?: string
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(url, options);
        logObject(
            `api called, url:${url}, method: ${options.method}, options`,
            options.body
        );

        if (response.ok === false) {
            logObject("response is not ok", response);
            // throw new Error("Network response was not ok");
            showAdminToast("error", `response is not ok`);
        }
        // ok 가 false 이면, response 도 없나?
        const apiResponse: ApiResponse<T> = await response.json();
        logObject(`API ${message} Result`, apiResponse);

        const statusCode = apiResponse.statusCode;

        if (statusCode >= 200 && statusCode < 300) {
            logObject("response data:", apiResponse.data);
            // return apiResponse.data;
            return apiResponse;
        } else {
            console.error(apiResponse.message);
            showToast("error", apiResponse.message);
            return apiResponse;
        }
    } catch (error) {
        console.error(`${url} API call failed: ${error.message}`);
        showAdminToast("error", `${url} API failed`);
    }
}

class BaseApi {
    protected async fetchData<T>(
        url: string,
        // options: ApiOptions,  // body 포함
        method: string,
        body?: object,
        accessToken?: string,
        refreshToken?: string
    ): Promise<ApiResponse<T>> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }
        if (refreshToken) {
            headers["refresh-token"] = refreshToken;
        }

        const options: RequestInit = {
            method,
            headers,
        };
        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);

            if (response.ok === false) {
                showAdminToast("error", "response is not okay");
            }
            const apiResponse: ApiResponse<T> = await response.json();
            const statusCode = apiResponse.statusCode;

            if (statusCode >= 200 && statusCode < 300) {
                logObject("response data:", apiResponse.data);
            } else {
                console.error(apiResponse.message);
                showAdminToast("error", apiResponse.message);
            }
            return apiResponse;
        } catch (error) {
            console.error(`${url} API Call failed: ${error.message}`);
            showAdminToast("error", `${url} API failed`);
        }
    }
}

export default BaseApi;
