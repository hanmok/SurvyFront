import { gql, useQuery } from "@apollo/client";
import { useApollo } from "./ApolloProvider";
import { Text } from "react-native";

const GET_GREETING = gql`
    query {
        greeting
    }
`;

function GreetingComponent() {
    const client = useApollo();
    const { loading, error, data } = useQuery(GET_GREETING, { client });

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }
    console.log(`greetingComponent called, ${data.greeting}`);
    return <Text>Greeting from server: {data.greeting}</Text>;
}

export default GreetingComponent;
