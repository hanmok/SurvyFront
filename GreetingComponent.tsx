import { gql, useQuery } from "@apollo/client";
import { useApollo } from "./ApolloProvider";
import { Text } from "react-native";
import { greeting } from "./API/gqlQuery";

// const GET_GREETING = gql`
//     query {
//         greeting
//     }
// `;

function GreetingComponent() {
    const client = useApollo();
    const { loading, error, data } = useQuery(greeting, { client });

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }
    console.log(`[GreetingComponent] called, ${data.greeting}`);
    return <Text>Greeting from server: {data.greeting}</Text>;
}

export default GreetingComponent;
