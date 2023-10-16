import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import { Text, View } from "react-native";
import { RouteProp } from "@react-navigation/native";

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
    const some = "asd";
    const { surveyId } = route.params;
    return (
        <View>
            <Text> Response Screen </Text>
            <Text> surveyId: </Text>
            <Text>{surveyId}</Text>
        </View>
    );
}
