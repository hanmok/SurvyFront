// import { WithdrawalService } from './Services/WithdrawalService';
// import { Withdrawal } from "../interfaces/Withdrawal";
// import { API_BASE_URL } from "./API";
// // import { fetchData } from "./BaseAPI";

// export class WithdrawalService

// export const createWithdrawal = async (
//     accessToken: string,
//     user_id: number,
//     amount: number
// ) => {
//     const url = `${API_BASE_URL}/withdrawal`;
//     const data = { user_id, amount };
//     return fetchData<Withdrawal>(url, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(data),
//     });
// };

// export const fetchWithdrawals = async (accessToken: string, userId: number) => {
//     const url = `${API_BASE_URL}/withdrawal/${userId}`;
//     return fetchData<Withdrawal[]>(url, {
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//         },
//     });
// };

// export const patchWithdrawal = async (accessToken: string, id: number) => {
//     const url = `${API_BASE_URL}/withdrawal/${id}`;
//     return fetchData(url, {
//         method: "PATCH",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//         },
//     });
// };
