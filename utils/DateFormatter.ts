// // export function formatDate(date: Date): string {
// //     const options: Intl.DateTimeFormatOptions = {
// //         year: "numeric",
// //         month: "2-digit",
// //         day: "2-digit",
// //         // hour: "2-digit",
// //         // minute: "2-digit",
// //     };

// //     const formattedDate = date.toLocaleString(undefined, options);
// //     console.log("date formatted:" + formattedDate);
// //     return formattedDate;
// // }

// export function formatDate(dateString: string): string {
//     console.log(`type of currentDate: ${typeof dateString}`);
// 	const date = new Date(dateString)
//     // const year = date.getFullYear();
//     const year = String(date.getFullYear());
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     const hours = String(date.getHours()).padStart(2, "0");
//     const minutes = String(date.getMinutes()).padStart(2, "0");

//     const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
//     // const formattedDate = `${month}-${day} ${hours}:${minutes}`;
//     return formattedDate;
// }

// export function formatDateString(dateString: string): string {
//     const parts = dateString.split("T");
//     const datePart = parts[0];
//     const timePart = parts[1].split(".")[0];
//     return `${datePart} ${timePart}`;
// }

export function getDatePart(dateString: string): string {
    return dateString.split("T")[0];
}
