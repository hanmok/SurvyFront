import { useQuery } from "@apollo/client";
import { postedSurveyQuery } from "../../API/gqlQuery";
import {
    View,
    Text,
    TouchableNativeFeedback,
    ActivityIndicator,
} from "react-native";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useApollo } from "../../ApolloProvider";
import { commonStyles } from "../../utils/CommonStyles";
import { fontSizes, marginSizes } from "../../utils/sizes";
import {
    convertKeysToCamelCase,
    removeTypenameAndConvertToCamelCase,
} from "../../utils/SnakeToCamel";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../../utils/NavHelper";
import { useEffect, useState } from "react";
import { logObject } from "../../utils/Log";
import { GQLSurvey } from "../../interfaces/GQLInterface";
import { colors } from "../../utils/colors";

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
        // posted_surveys: PostedSurveyItem[];
        posted_surveys: GQLSurvey[];
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
        { client, variables: { userId: userId }, fetchPolicy: "no-cache" }
        // { client, variables: { userId: 774 } }
    );

    const [postedSurveys, setPostedSurveys] = useState<GQLSurvey[]>([]);

    useEffect(() => {
        if (data?.user.posted_surveys) {
            logObject("get postedSurveyObj using user", data.user);
            const updatedPostedSurveys: GQLSurvey[] =
                removeTypenameAndConvertToCamelCase(data.user.posted_surveys);
            logObject("get postedSurveyObj", updatedPostedSurveys);
            setPostedSurveys(updatedPostedSurveys);
        }
    }, [data]);

    if (loading) {
        // return <Text>Loading...</Text>;
        <ActivityIndicator
            animating={loading}
            style={{ flex: 1 }}
            size={"large"}
            color={colors.deepMainColor}
        />;
    }

    if (error) {
        // console.error(error);
        return <Text>Error: {error.message}</Text>;
    }

    return (
        <FlatList
            data={postedSurveys}
            renderItem={({ item }) => (
                <TouchableNativeFeedback
                    onPress={() => {
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
                        {/* <Text>{convertTime(parseInt(item.createdAt))}</Text> */}
                        <Text>
                            {item.currentParticipation} /{" "}
                            {item.participationGoal}
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            )}
            // keyExtractor={item => `${item.code}${item.createdAt}`}
            keyExtractor={item => `${item.code}`}
        />
    );
};

const convertTime = (number: number) => {
    const date = new Date(number);
    return date.toLocaleDateString().split("/").reverse().join(".");
};

export default PostedSurveyItems;
