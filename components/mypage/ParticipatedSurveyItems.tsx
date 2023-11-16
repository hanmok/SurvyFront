import { useQuery } from "@apollo/client";
import { participatedSurveyQuery } from "../../API/gqlQuery";
import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useApollo } from "../../ApolloProvider";
import { commonStyles } from "../../utils/CommonStyles";
import { fontSizes, marginSizes } from "../../utils/sizes";
import { convertKeysToCamelCase } from "../../utils/SnakeToCamel";
import { useCustomContext } from "../../features/context/CustomContext";
import { useEffect } from "react";

interface ParticipatedSurveyItem {
    title: string;
    reward: number;
    id: number;
}

interface ParticipatedSurveyResponse {
    user: {
        participated_surveys: ParticipatedSurveyItem[];
    };
}

const ParticipatedSurveyItems = ({ userId }) => {
    const client = useApollo();
    const { loading, error, data } = useQuery<ParticipatedSurveyResponse>(
        participatedSurveyQuery,
        { client, variables: { userId: userId }, fetchPolicy: "no-cache" }
    );

    const participatedSurveys: ParticipatedSurveyItem[] =
        data?.user.participated_surveys.map(item =>
            convertKeysToCamelCase(item)
        ) || [];

    const { updateLoadingStatus } = useCustomContext();

    useEffect(() => {
        updateLoadingStatus(loading);
    }, [loading]);

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    return (
        <FlatList
            data={participatedSurveys}
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
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: fontSizes.m20,
                                fontWeight: "bold",
                            }}
                        >
                            {item.title}
                        </Text>
                        <Text>
                            +{item.reward}
                            {/* {item.current_participation} / {item.participation_goal} */}
                        </Text>
                    </View>
                </View>
            )}
            // keyExtractor={item => `${item.code}${item.created_at}`}

            keyExtractor={item => `${item.id}${item.title}`}
        />
    );
};

const convertTime = (number: number) => {
    const date = new Date(number);
    return date.toLocaleDateString().split("/").reverse().join(".");
};

export default ParticipatedSurveyItems;
