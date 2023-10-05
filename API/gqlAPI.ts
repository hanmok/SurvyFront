import { logObject } from "../utils/Log";
import { GQL_URL } from "./API";

export const fetchGreeting = async () => {
    console.log("fetchGreeting called");
    const response = await fetch(GQL_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: "query { greeting }",
        }),
    });

    const { data } = await response.json();
    logObject("gql test, data: ", data);
    return data.greeting;
};
