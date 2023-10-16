import { useQuery } from "@apollo/client";
import { postedSurveyQuery } from "../../API/gqlQuery";
import { View, Text, TouchableNativeFeedback } from "react-native";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useApollo } from "../../ApolloProvider";
import { commonStyles } from "../../utils/CommonStyles";
import { fontSizes, marginSizes } from "../../utils/sizes";
import { convertKeysToCamelCase } from "../../utils/SnakeToCamel";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../../utils/NavHelper";

interface PostedSurveyItem {
    title: string;
    createdAt: string;
    code: string;
    currentParticipation: number;
    participationGoal: number;
    id: number;
}

interface PostedSurveyResponse {
    user: {
        posted_surveys: PostedSurveyItem[];
    };
}

const PostedSurveyItems = ({
    userId,
    handleTapAction,
}: {
    userId: number;
    handleTapAction: (number) => void;
}) => {
    const client = useApollo();

    const { loading, error, data } = useQuery<PostedSurveyResponse>(
        postedSurveyQuery,
        { client, variables: { userId: userId } }
    );

    const postedSurveys: PostedSurveyItem[] =
        data?.user.posted_surveys.map(item => convertKeysToCamelCase(item)) ||
        [];

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    return (
        <FlatList
            data={postedSurveys}
            renderItem={({ item }) => (
                // <View
                <TouchableNativeFeedback
                    onPress={() => {
                        // console.log(`tapped! item: ${item.title}`);
                        handleTapAction(item.id);
                    }}
                >
                    <View
                        style={[
                            commonStyles.border,
                            {
                                marginHorizontal: marginSizes.m16,
                                borderRadius: 10,
                                marginBottom: 12,
                                padding: 8,
                                gap: 6,
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontSize: fontSizes.m20,
                                fontWeight: "bold",
                            }}
                        >
                            {item.title}
                        </Text>
                        <Text>{convertTime(parseInt(item.createdAt))}</Text>
                        <Text>
                            {item.currentParticipation} /{" "}
                            {item.participationGoal}
                        </Text>
                        {/* </View> */}
                    </View>
                </TouchableNativeFeedback>
            )}
            keyExtractor={item => `${item.code}${item.createdAt}`}
        />
    );
};

const convertTime = (number: number) => {
    const date = new Date(number);
    return date.toLocaleDateString().split("/").reverse().join(".");
};

export default PostedSurveyItems;
