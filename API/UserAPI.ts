import { API_BASE_URL } from "./API";
import { logObject } from "../utils/Log";
import { UserState } from "../interfaces/UserState";
import { UserDetail } from "../features/context/CustomContext";
import { fetchData } from "./BaseAPI";

export type UserResponse = ApiResponse<UserState>;

export async function getParticipatedSurveyIds(
    userId: number,
    accessToken: string
) {
    const url = `${API_BASE_URL}/participating/user/${userId}/participated-surveys`;
    const data = { userId };

    return fetchData<number[]>(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export async function getPostedSurveyIds(
    userId: number,
    accessToken: string
): Promise<number[]> {
    const url = `${API_BASE_URL}/posting/user/${userId}/posted-surveys`;
    return fetchData<number[]>(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export async function signin(
    username: string,
    password: string
): Promise<UserState> {
    const url = `${API_BASE_URL}/user/signin`;
    const data = { username, password };

    return fetchData<UserState>(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function signOut(accessToken: string) {
    const url = `${API_BASE_URL}/user/signout`;
    return fetchData(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export async function autoSignin(refreshToken: string): Promise<UserState> {
    const url = `${API_BASE_URL}/user/auto-signin`;

    return fetchData<UserState>(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "refresh-token": refreshToken,
        },
    });
}

export async function getUserDetail(accessToken: string) {
    const url = `${API_BASE_URL}/user/details`;
    return fetchData<UserDetail>(
        url,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        },
        "userDetail"
    );
}

export async function removeUser(userId: number, accessToken: string) {
    const url = `${API_BASE_URL}/user/${userId}`;

    return fetchData(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export async function fetchParticipatedSurveys(
    userId: number,
    accessToken: string
): Promise<number[]> {
    const url = `${API_BASE_URL}/user/${userId}/participated-surveys`;

    return fetchData<number[]>(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
}
