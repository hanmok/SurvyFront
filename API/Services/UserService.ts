import { UserDetail } from "../../interfaces/UserDetail";
import { Genre } from "../../interfaces/Genre";
import { UserState } from "../../interfaces/UserState";
import { API_BASE_URL } from "../API";
import BaseApi from "../BaseAPI";
import _ from "lodash";

export type UserResponse = ApiResponse<UserState>;

// Create a class for user-related actions
export class UserService extends BaseApi {
    async signin(
        username: string,
        password: string
    ): Promise<ApiResponse<UserState>> {
        const url = `${API_BASE_URL}/user/signin`;
        const body = { username, password };

        return this.fetchData<UserState>(url, "POST", body, undefined);
    }

    async signup(
        username: string,
        password: string,
        phoneNumber: string,
        birthDate: string,
        isMale: number
    ): Promise<ApiResponse<any>> {
        const url = `${API_BASE_URL}/user/signup`;
        const data = {
            username,
            password,
            phoneNumber,
            birthDate,
            isMale,
        };

        const body = _.mapKeys(data, (value, key) => _.snakeCase(key));

        return this.fetchData(url, "POST", body, undefined);
    }

    async signOut(accessToken: string): Promise<ApiResponse<any>> {
        const url = `${API_BASE_URL}/user/signout`;
        return this.fetchData(url, "POST", undefined, accessToken);
    }

    async autoSignin(refreshToken: string): Promise<ApiResponse<UserState>> {
        const url = `${API_BASE_URL}/user/auto-signin`;

        return this.fetchData<UserState>(
            url,
            "POST",
            undefined,
            undefined,
            refreshToken
        );
    }

    async getUserDetail(accessToken: string): Promise<ApiResponse<UserDetail>> {
        const url = `${API_BASE_URL}/user/details`;
        return this.fetchData<UserDetail>(url, "GET", undefined, accessToken);
    }

    async getUserGenres(
        accessToken: string,
        userId: number
    ): Promise<ApiResponse<Genre[]>> {
        const url = `${API_BASE_URL}/user-genre/user/${userId}`;
        return this.fetchData<Genre[]>(url, "GET", undefined, accessToken);
    }

    async removeUser(userId: number, accessToken: string) {
        const url = `${API_BASE_URL}/user/${userId}`;
        return this.fetchData(url, "DELETE", undefined, accessToken);
    }

    async updatePassword(username: string, password: string) {
        const url = `${API_BASE_URL}/user/update-password`;
        const body = { username, password };

        return this.fetchData(url, "PATCH", body);
    }

    async updateUserGenres(
        userId: number,
        accessToken: string,
        genreIds: number[]
    ) {
        const url = `${API_BASE_URL}/user-genre/user/${userId}/genres`;

        const data = {
            user_id: userId,
            genre_ids: genreIds,
        };
        const body = _.mapKeys(data, (value, key) => _.snakeCase(key));

        return this.fetchData(url, "POST", body, accessToken);
    }

    async hasDuplicateUsername(username: string) {
        let url = `${API_BASE_URL}/user/check-username`;

        const queryParams = new URLSearchParams({ username });
        url = `${url}?${queryParams.toString()}`;

        return this.fetchData<any>(url, "GET");
    }
    /** 400 if exist */
    async checkPhoneDuplicate(phone: string) {
        let url = `${API_BASE_URL}/user/check-phone`;

        const queryParams = new URLSearchParams({ phone });
        url = `${url}?${queryParams.toString()}`;

        return this.fetchData<any>(url, "GET");
    }

    async updateHomeAddress(userId: number, geoId: number | null) {
        let url = `${API_BASE_URL}/user/${userId}/home`;
        if (geoId) {
            url += `/${geoId}`;
        }

        return this.fetchData(url, "PATCH");
    }

    async checkValidationOfUsernamePhoneNumber(
        username: string,
        phoneNumber: string
    ) {
        const url = `${API_BASE_URL}/user/check-username-phone`;
        const data = { username, phoneNumber };
        const body = _.mapKeys(data, (value, key) => _.snakeCase(key));

        return this.fetchData(url, "POST", body);
    }

    async updateOfficeAddress(userId: number, geoId: number | null) {
        let url = `${API_BASE_URL}/user/${userId}/office`;

        if (geoId) {
            url += `/${geoId}`;
        }
        console.log(`url: ${url}`);

        return this.fetchData(url, "PATCH");
    }

    async sendEmailAuthCode(username: string) {
        const url = `${API_BASE_URL}/user/send-mail`;
        const body = { username };

        return this.fetchData(url, "POST", body);
    }

    async verifyEmailAuth(username: string, code: string) {
        const url = `${API_BASE_URL}/user/find-password/verify-email`;
        const body = { username, code };
        return this.fetchData(url, "POST", body);
    }

    async sendSMSAuthCodeForPassword(username: string, phoneNumber: string) {
        const url = `${API_BASE_URL}/user/find-password/send-sms`;
        const data = { username, phoneNumber };
        const body = _.mapKeys(data, (value, key) => _.snakeCase(key));
        return this.fetchData(url, "POST", body);
    }

    async sendSMSAuthCodeForId(phoneNumber: string) {
        const url = `${API_BASE_URL}/user/find-id/send-sms`;
        const data = { phoneNumber };
        const body = _.mapKeys(data, (value, key) => _.snakeCase(key));
        return this.fetchData(url, "POST", body);
    }

    async verifyAuthCodeForId(phoneNumber: string, code: string) {
        const url = `${API_BASE_URL}/user/find-id/verify-sms`;
        const data = { phoneNumber, code };
        const body = _.mapKeys(data, (value, key) => _.snakeCase(key));
        return this.fetchData<string>(url, "POST", body);
    }

    async sendSMSAuthCodeForSignup(phoneNumber: string) {
        const url = `${API_BASE_URL}/user/signup/send-sms`;
        const data = { phoneNumber };
        const body = _.mapKeys(data, (value, key) => _.snakeCase(key));
        return this.fetchData(url, "POST", body);
    }

    async verifyAuthCodeForSignup(phoneNumber: string, code: string) {
        const url = `${API_BASE_URL}/user/signup/verify-sms`;
        const data = { phoneNumber, code };
        const body = _.mapKeys(data, (value, key) => _.snakeCase(key));
        return this.fetchData<string>(url, "POST", body);
    }

    async verifySMSAuth(username: string, code: string) {
        const url = `${API_BASE_URL}/user/find-password/verify-sms`;
        const body = { username, code };

        return this.fetchData(url, "POST", body);
    }
}
