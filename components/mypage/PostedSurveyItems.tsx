import { useQuery } from "@apollo/client";
import { postedSurveyQuery } from "../../API/gqlQuery";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useApollo } from "../../ApolloProvider";
import { commonStyles } from "../../utils/CommonStyles";
import { fontSizes, marginSizes } from "../../utils/sizes";
import { convertKeysToCamelCase } from "../../utils/SnakeToCamel";

interface PostedSurveyItem {
    title: string;
    // created_at: string;
    createdAt: string;
    code: string;
    // current_participation: number;
    // participation_goal: number;
    currentParticipation: number;
    participationGoal: number;
}

interface PostedSurveyResponse {
    user: {
        posted_surveys: PostedSurveyItem[];
    };
}

const PostedSurveyItems = ({ userId }) => {
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
                        style={{ fontSize: fontSizes.m20, fontWeight: "bold" }}
                    >
                        {item.title}
                    </Text>
                    <Text>{convertTime(parseInt(item.createdAt))}</Text>
                    <Text>
                        {item.currentParticipation} / {item.participationGoal}
                    </Text>
                </View>
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
