import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TouchableNativeFeedback,
    View,
} from "react-native";
import { Text } from "react-native";
import { Button } from "react-native";
import TextButton from "../components/TextButton";
import { useApollo } from "../ApolloProvider";
import { useQuery } from "@apollo/client";
import { PostedSurveyResponse } from "../API/gqlResponses";
import { postedSurveyQuery } from "../API/gqlQuery";
import { fontSizes } from "../utils/sizes";
import { useEffect, useState } from "react";
import { GQLSurvey } from "../interfaces/GQLInterface";
import { removeTypenameAndConvertToCamelCase } from "../utils/SnakeToCamel";
import { colors } from "../utils/colors";
import { log } from "../utils/Log";
import Spacer from "../components/Spacer";

export default function PostingBaseScreen({
    navigation,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.postingBase
    >;
}) {
    const client = useApollo();
    const [postedSurveys, setPostedSurveys] = useState<GQLSurvey[]>(null);
    const { loading, error, data } = useQuery<PostedSurveyResponse>(
        postedSurveyQuery,
        { client, variables: { userId: 774 }, fetchPolicy: "no-cache" }
    );

    useEffect(() => {
        if (data?.user.posted_surveys) {
            const updatedPostedSurveys: GQLSurvey[] =
                removeTypenameAndConvertToCamelCase(data.user.posted_surveys);
            setPostedSurveys(updatedPostedSurveys);
        }
    }, [data]);

    if (loading) {
        <ActivityIndicator
            animating={loading}
            style={{ flex: 1 }}
            size={"large"}
            color={colors.deepMainColor}
        />;
    }

    return (
        <View>
            <View style={styles.subContainer}>
                {postedSurveys && (
                    <View>
                        <Text
                            style={[styles.sectionTitle, { marginBottom: 20 }]}
                        >
                            요청한 설문
                        </Text>
                        <FlatList
                            data={postedSurveys}
                            renderItem={({ item }) => (
                                <TouchableNativeFeedback
                                    onPress={() => {
                                        log(`${item.title} tapped`);
                                        navigation.navigate(
                                            NavigationTitle.response,
                                            {
                                                surveyId: item.id,
                                            }
                                        );
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: "white",
                                            borderRadius: 16,
                                            overflow: "hidden",
                                            paddingVertical: 12,
                                            paddingHorizontal: 16,
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
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                alignSelf: "flex-end",
                                            }}
                                        >
                                            {item.currentParticipation} /{" "}
                                            {item.participationGoal}
                                        </Text>
                                        <Text></Text>
                                    </View>
                                </TouchableNativeFeedback>
                            )}
                            ItemSeparatorComponent={() => <Spacer size={10} />}
                            keyExtractor={item => `${item.id}`}
                        />
                    </View>
                )}
            </View>
            <View style={[styles.subContainer, { marginTop: 30 }]}>
                <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
                    작성중인 설문
                </Text>

                <TextButton
                    title="설문 만들기"
                    onPress={() => {
                        navigation.navigate(NavigationTitle.posting);
                    }}
                    textStyle={{
                        textAlign: "center",
                        fontSize: 18,
                        fontWeight: "700",
                    }}
                    backgroundStyle={{
                        backgroundColor: "white",
                        height: 40,
                        borderRadius: 16,
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    subContainer: {
        marginHorizontal: 20,
        // marginVertical: 30,
        // marginTop: 20,
    },
    sectionTitle: {
        fontSize: fontSizes.l24,
        fontWeight: "bold",
        textAlign: "center",
        // borderTopColor: "#969696",
        borderTopColor: colors.black,
        backgroundColor: "#d9d9d9",
        borderTopWidth: 1,
        overflow: "hidden",
    },
});
