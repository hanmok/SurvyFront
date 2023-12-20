export function getDatePart(dateString: string): string {
    return dateString.split("T")[0];
}

export const convertTime = (dateNumberString: string) => {
    console.log(`input number: ${dateNumberString}`);
    console.log(`${typeof dateNumberString}`);
    const date = new Date(parseInt(dateNumberString));
    // logObject("converted Date", date);

    if (!isNaN(date.getTime())) {
        // return date.toLocaleDateString().split("/").reverse().join(".");
        const fullDate = date.toLocaleDateString(); // 10/30/2023
        const splitted = fullDate.split("/");
        return splitted[2] + "-" + splitted[0] + "-" + splitted[1];
        // return date.toLocaleDateString();
    }
    return "";

    return date.toLocaleDateString().split("/").reverse().join(".");
};

export function convertUnixTimestampToDateTime(timestamp: number) {
    const seconds = timestamp / 1000;
    const convertedDate = new Date(seconds * 1000);

    const dateString = convertedDate.toISOString();

    const options = { timeZone: "Asia/Seoul" };
    const koreanTime = convertedDate.toLocaleString("ko-KR", options);
    console.log(`koreanTime: ${koreanTime}`);
    console.log(`dateString: ${dateString}`);

    const splitted = koreanTime.split(". ");
    const subresult = splitted[0] + "." + splitted[1] + "." + splitted[2] + " ";

    const time = splitted[3].split(":");
    const ret = subresult + time[0] + ":" + time[1];

    console.log(ret);

    return ret;
}

export function convertBirthDate(dateString: string): string {
    const newDate = new Date(dateString);
    const options = { timeZone: "Asia/Seoul" };
    const koreanTime = newDate.toLocaleString("ko-KR", options);
    // "1992. 7. 21. 오전 12:00:00" -> 1992 7 21
    return koreanTime.split("오")[0].replaceAll(".", "");
}
