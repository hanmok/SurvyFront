import React from "react";
import { View, Text } from "react-native";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
} from "@apollo/client";
import { GQL_URL } from "./API/API";

// GraphQL 쿼리 정의
const GET_GREETING = gql`
    query {
        greeting
    }
`;

// Apollo Client 설정
const client = new ApolloClient({
    uri: GQL_URL, // 여기에 GraphQL API의 엔드포인트 주소를 입력하세요
    cache: new InMemoryCache(),
});

// 컴포넌트 정의
export const GreetingComponent2 = () => {
    const { loading, error, data } = useQuery(GET_GREETING);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    return <Text>Greeting from server: {data.greeting}</Text>;
};
