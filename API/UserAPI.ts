// import { API_BASE_URL } from "./API";
// import { logObject } from "../utils/Log";
// import { UserState } from "../interfaces/UserState";
// import { UserDetail } from "../features/context/CustomContext";
// import { fetchData } from "./BaseAPI";
// import { UserGenre } from "../interfaces/UserGenre";
// import { Genre } from "../interfaces/Genre";
// import showAdminToast from "../components/common/toast/showAdminToast";

// // export type UserResponse = ApiResponse<UserState>;

// // SurveyService
// // export async function getParticipatedSurveyIds(
// //     userId: number,
// //     accessToken: string
// // ) {
// //     const url = `${API_BASE_URL}/participating/user/${userId}/participated-surveys`;
// //     const data = { userId };

// //     return fetchData<number[]>(url, {
// //         method: "GET",
// //         headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${accessToken}`,
// //         },
// //     });
// // }

// // SurveyService
// // export async function getPostedSurveyIds(
// //     userId: number,
// //     accessToken: string
// // ): Promise<ApiResponse<number[]>> {
// //     const url = `${API_BASE_URL}/posting/user/${userId}/posted-surveys`;
// //     return fetchData<number[]>(url, {
// //         method: "GET",
// //         headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${accessToken}`,
// //         },
// //     });
// // }

// // UserService, Done
// // export async function signin(
// //     username: string,
// //     password: string
// // ): Promise<ApiResponse<UserState>> {
// //     const url = `${API_BASE_URL}/user/signin`;
// //     const data = { username, password };

// //     return fetchData<UserState>(url, {
// //         method: "POST",
// //         headers: {
// //             "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(data),
// //     });
// // }
// // UserService, Done
// // export async function signup(
// //     username: string,
// //     password: string,
// //     phoneNumber: string,
// //     birthDate: string,
// //     isMale: number
// // ) {
// //     const url = `${API_BASE_URL}/user/signup`;
// //     const data = {
// //         username,
// //         password,
// //         phoneNumber,
// //         birthDate,
// //         isMale,
// //     };

// //     return fetchData(url, {
// //         method: "POST",
// //         headers: {
// //             "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(data),
// //     });
// // }
// // UserService, Done
// // export async function signOut(accessToken: string) {
// //     const url = `${API_BASE_URL}/user/signout`;
// //     return fetchData(url, {
// //         method: "POST",
// //         headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${accessToken}`,
// //         },
// //     });
// // }
// // UserService, Done
// // export async function autoSignin(
// //     refreshToken: string
// // ): Promise<ApiResponse<UserState>> {
// //     const url = `${API_BASE_URL}/user/auto-signin`;

// //     return fetchData<UserState>(url, {
// //         method: "POST",
// //         headers: {
// //             "Content-Type": "application/json",
// //             "refresh-token": refreshToken,
// //         },
// //     });
// // }
// // UserService, Done
// // export async function getUserDetail(accessToken: string) {
// //     const url = `${API_BASE_URL}/user/details`;
// //     return fetchData<UserDetail>(
// //         url,
// //         {
// //             method: "GET",
// //             headers: {
// //                 "Content-Type": "application/json",
// //                 Authorization: `Bearer ${accessToken}`,
// //             },
// //         },
// //         "userDetail"
// //     );
// // }

// // UserService, Done
// // export async function getUserGenres(accessToken: string, userId: number) {
// //     const url = `${API_BASE_URL}/user-genre/user/${userId}`;
// //     return fetchData<Genre[]>(
// //         url,

// //         {
// //             headers: {
// //                 "Content-Type": "application/json",
// //                 Authorization: `Bearer ${accessToken}`,
// //             },
// //         },
// //         "userGenre"
// //     );
// // }
// // UserService, Done
// // export async function removeUser(userId: number, accessToken: string) {
// //     const url = `${API_BASE_URL}/user/${userId}`;

// //     return fetchData(url, {
// //         method: "DELETE",
// //         headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${accessToken}`,
// //         },
// //     });
// // }

// // export async function fetchParticipatedSurveys(
// //     userId: number,
// //     accessToken: string
// // ): Promise<ApiResponse<number[]>> {
// //     const url = `${API_BASE_URL}/user/${userId}/participated-surveys`;

// //     return fetchData<number[]>(url, {
// //         method: "GET",
// //         headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${accessToken}`,
// //         },
// //     });
// // }

// // export const updatePassword = async (username: string, password: string) => {
// //     const url = `${API_BASE_URL}/user/update-password`;
// //     const data = { username, password };
// //     try {
// //         return fetchData(url, {
// //             method: "PATCH",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify(data),
// //         });
// //     } catch (error) {
// //         showAdminToast("error", "failed updating password");
// //     }
// // };

// // export async function updateUserGenres(
// //     userId: number,
// //     accessToken: string,
// //     genreIds: number[]
// // ) {
// //     const url = `${API_BASE_URL}/user-genre/user/${userId}/genres`;

// //     // const data = { userId, genreIds };
// //     const snakeData = {
// //         user_id: userId,
// //         genre_ids: genreIds,
// //     };

// //     logObject("sending Data from updateUserGenres", snakeData);
// //     try {
// //         return fetchData(
// //             url,
// //             {
// //                 method: "POST",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                     Authorization: `Bearer ${accessToken}`,
// //                 },
// //                 body: JSON.stringify(snakeData),
// //             },
// //             "updateUserGenres"
// //         );
// //     } catch (error) {
// //         alert(error.message);
// //     }
// // }

// export async function hasDuplicateUsername(username: string) {
//     let url = `${API_BASE_URL}/user/check-username`;

//     const queryParams = new URLSearchParams({ username });
//     url = `${url}?${queryParams.toString()}`;

//     const checkUsernameResponse = fetchData<ApiResponse>(url, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     });

//     logObject("checkUsernameResponse", checkUsernameResponse);
//     return checkUsernameResponse;
// }

// export async function checkPhoneDuplicate(phone: string) {
//     let url = `${API_BASE_URL}/user/check-phone`;

//     const queryParams = new URLSearchParams({ phone });
//     url = `${url}?${queryParams.toString()}`;

//     const checkPhoneResponse = fetchData<ApiResponse>(url, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     });

//     logObject("checkPhoneResponse", checkPhoneResponse);
//     return checkPhoneResponse;
// }

// export const updateHomeAddress = async (
//     userId: number,
//     geoId: number | null
// ) => {
//     let url = `${API_BASE_URL}/user/${userId}/home`;
//     if (geoId) {
//         url += `/${geoId}`;
//     }
//     console.log(`updateHomeAddress url: ${url}`);
//     return fetchData(url, {
//         method: "PATCH",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     });
// };

// export const checkValidationOfUsernamePhoneNumber = async (
//     username: string,
//     phone: string
// ) => {
//     const url = `${API_BASE_URL}/user/check-username-phone`;
//     const body = { username, phone };
//     return fetchData(url, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//     });
// };

// export const updateOfficeAddress = async (
//     userId: number,
//     geoId: number | null
// ) => {
//     let url = `${API_BASE_URL}/user/${userId}/office`;

//     if (geoId) {
//         url += `/${geoId}`;
//     }
//     console.log(`url: ${url}`);
//     return fetchData(url, {
//         method: "PATCH",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     });
// };

// export const sendEmailAuthCode = async (username: string) => {
//     const url = `${API_BASE_URL}/user/send-mail`;
//     const body = { username };
//     return fetchData(url, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//     });
// };

// export const verifyEmailAuth = async (username: string, code: string) => {
//     const url = `${API_BASE_URL}/user/verify-email`;
//     const body = { username, code };
//     return fetchData(url, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//     });
// };

// export const sendSMSAuthCode = async (username: string, phone: string) => {
//     const url = `${API_BASE_URL}/user/send-sms`;
//     const body = { username, phone };
//     return fetchData(url, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//     });
// };

// export const verifySMSAuth = async (username: string, code: string) => {
//     const url = `${API_BASE_URL}/user/verify-sms`;
//     const body = { username, code };
//     return fetchData(url, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//     });
// };
