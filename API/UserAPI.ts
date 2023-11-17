import { API_BASE_URL } from "./API";
import { logObject } from "../utils/Log";
import { UserState } from "../interfaces/UserState";

export type UserResponse = ApiResponse<UserState>;

export async function getParticipatedSurveyIds(
    userId: number,
    accessToken: string
): Promise<number[]> {
    const url = `${API_BASE_URL}/participating/user/${userId}/participated-surveys`;
    const data = { userId };

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const responseData: ApiResponse<number[]> = await response.json();
        return responseData.data;
    } catch (error) {
        throw error;
    }
}

export async function getPostedSurveyIds(
    userId: number,
    accessToken: string
): Promise<number[]> {
    const url = `${API_BASE_URL}/posting/user/${userId}/posted-surveys`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const responseData: ApiResponse<number[]> = await response.json();
        return responseData.data;
    } catch (error) {
        throw error;
    }
}

export async function signin(
    username: string,
    password: string
): Promise<UserResponse> {
    const url = `${API_BASE_URL}/user/signin`;
    const data = { username, password };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const responseData: UserResponse = await response.json();
        console.log(`userResponse id: ${responseData.data.userId}`);

        return responseData;
    } catch (error) {
        console.error("login error", error);
        throw error;
    }
}

export async function signOut(accessToken: string) {
    const url = `${API_BASE_URL}/user/signout`;
    // const data = { accessToken };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function autoSignin(refreshToken: string): Promise<UserResponse> {
    const url = `${API_BASE_URL}/user/auto-signin`;
    // const data = { refreshToken };
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "refresh-token": refreshToken,
            },
            // body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const responseData: UserResponse = await response.json();
        console.log(`userResponse from autoSignin: ${responseData}`);
        return responseData;
    } catch (error) {
        console.error("login error", error);
        throw new Error(error.message);
    }
}

export async function getUserDetail(accessToken: string) {
    try {
        const url = `${API_BASE_URL}/user/details`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Handle the response data
        const ret = await response.json();
        logObject("User Details", ret);
        return ret;
    } catch (error) {
        // Handle errors
        console.error("Error fetching user details:", error.message);
    }
}

export async function removeUser(userId: number, accessToken: string) {
    const url = `${API_BASE_URL}/user/${userId}`;

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function fetchParticipatedSurveys(
    userId: number,
    accessToken: string
): Promise<number[]> {
    const url = `${API_BASE_URL}/user/${userId}/participated-surveys`;

    try {
        console.log(`calling api: ${url}`);
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        console.log(`response.json: ${response.json}`);
        const responseData: number[] = await response.json();
        console.log(`fetched surveyIds: ${responseData}`);

        return responseData;
    } catch (error) {
        console.error("fetch participated surveys", error);
        throw error;
    }
}
