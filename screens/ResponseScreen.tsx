import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import { Text, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { SurveyResponse } from "../interfaces/SurveyResponse";
import { getSurveyQuery } from "../API/gqlQuery";
import { useApollo } from "../ApolloProvider";
import { Survey } from "../interfaces/Survey";

// SurveyId 를 받아야해.
export default function ResponseScreen({
    navigation,
    route,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.response
    >;
    route: RouteProp<RootStackParamList, NavigationTitle.response>;
}) {
    // getSurveyQuery
    // getAnswersQuery
    const some = "asd";
    const { surveyId } = route.params;
    const client = useApollo();

    const { loading, error, data } = useQuery<Survey>(getSurveyQuery, {
        client,
        variables: { surveyId: route.params.surveyId },
    });

    // const { data} = useQuery<

    return (
        <View>
            <Text> Response Screen </Text>
            <Text> surveyId: </Text>
            <Text>{surveyId}</Text>
        </View>
    );
}
