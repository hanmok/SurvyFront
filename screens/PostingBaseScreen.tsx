import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import {
    SectionList,
    StyleSheet,
    TouchableNativeFeedback,
    View,
} from "react-native";
import { Text } from "react-native";
import TextButton from "../components/TextButton";
import { useApollo } from "../ApolloProvider";
import { useQuery } from "@apollo/client";
import { PostedSurveyResponse } from "../API/gqlResponses";
import { postedSurveyQuery } from "../API/gqlQuery";
import { fontSizes } from "../utils/sizes";
import { useEffect, useState } from "react";
import { GQLSurvey, isGQLSurvey } from "../interfaces/GQLInterface";
import { colors } from "../utils/colors";
import { log, logObject } from "../utils/Log";
import Spacer from "../components/common/Spacer";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { makeRandomNumber } from "../utils/GetRandomNumber";
import {
    PostingSurveyState,
    isPostingSurveyState,
} from "../interfaces/PostingSurveyState";
import { loadSavedPostingSurveys } from "../utils/Storage";
import { getDatePart } from "../utils/DateFormatter";
import { useCustomContext } from "../features/context/CustomContext";

type SectionItem = GQLSurvey | PostingSurveyState;

interface SectionData {
    title: string;
    data: SectionItem[];
}

export default function PostingBaseScreen({
    navigation,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.postingBase
    >;
}) {
    const postedRenderItem = ({ item }: { item: GQLSurvey }) => (
        <TouchableNativeFeedback
            onPress={() => {
                log(`${item.title} tapped`);
                navigation.navigate(NavigationTitle.response, {
                    surveyId: item.id,
                });
            }}
        >
            <View
                style={{
                    backgroundColor: "white",
                    borderRadius: 16,
                    overflow: "hidden",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    marginHorizontal: 20,
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
                    {item.currentParticipation} / {item.participationGoal}
                </Text>
                <Text></Text>
            </View>
        </TouchableNativeFeedback>
    );

    const postingRenderItem = ({ item }: { item: PostingSurveyState }) => (
        <TouchableNativeFeedback
            onPress={() => {
                log(`${item.title} tapped`);
                updatePostingSurveyId(item.id);
                navigation.navigate(NavigationTitle.posting, {
                    postingSurveyState: item,
                });
            }}
        >
            <View
                style={{
                    backgroundColor: "white",
                    borderRadius: 16,
                    overflow: "hidden",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    marginHorizontal: 20,
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
                <Text style={{ alignSelf: "flex-end" }}>
                    {getDatePart(String(item.currentDate))}
                </Text>
            </View>
        </TouchableNativeFeedback>
    );

    const [sectionData, setSectionData] = useState<SectionData[]>([]);

    const client = useApollo();
    const [postedSurveys, setPostedSurveys] = useState<GQLSurvey[] | undefined>(
        undefined
    );

    const { loading, error, data, refetch } = useQuery<PostedSurveyResponse>(
        postedSurveyQuery,
        { client, variables: { userId: 774 }, fetchPolicy: "no-cache" }
    );

    useFocusEffect(
        React.useCallback(() => {
            refetch(); // API 다시 호출
        }, [])
    );

    const [postingSurveys, setPostingSurveys] = useState<
        PostingSurveyState[] | undefined
    >(undefined);

    const [isLoadingPostingSurveys, setIsLoadingPostingSurveys] =
        useState(true);

    // useEffect(() => {
    //     logObject("sectionData", sectionData);
    //     if (sectionData && sectionData.length === 0) {
    //         // move to add screen
    //         navigation.navigate(NavigationTitle.posting, {
    //             postingSurveyState: undefined,
    //         });
    //     }
    // }, [sectionData]);

    useEffect(() => {
        const fetchSavedPostingSurveys = async () => {
            try {
                const allPostingSurveys = await loadSavedPostingSurveys();
                logObject("postingSurveys:", allPostingSurveys);
                setPostingSurveys(allPostingSurveys);
                setIsLoadingPostingSurveys(false);
            } catch (error) {
                console.error(error);
                setIsLoadingPostingSurveys(false);
                setPostingSurveys([]);
            }
        };

        fetchSavedPostingSurveys();

        const unsubscribeFocus = navigation.addListener("focus", () => {
            fetchSavedPostingSurveys();
        });

        return unsubscribeFocus;
    }, [navigation]);

    useEffect(() => {
        if (postingSurveys && postingSurveys.length !== 0) {
            setSectionData([
                // { title: "요청한 설문", data: updatedPostedSurveys },
                { title: "작성중", data: postingSurveys },
            ]);
        }
    }, [postingSurveys]);

    // useEffect(() => {
    //     if (data?.user.posted_surveys) {
    //         // const updatedPostedSurveys: GQLSurvey[] =
    //             // removeTypenameAndConvertToCamelCase(data.user.posted_surveys);
    //         // setPostedSurveys(updatedPostedSurveys);
    //         setSectionData([
    //             // { title: "요청한 설문", data: updatedPostedSurveys },
    //             { title: "작성중인 설문", data: postingSurveys },
    //         ]);
    //     }
    // }, [data, postingSurveys]);

    const { updateLoadingStatus, postingSurveyId, updatePostingSurveyId } =
        useCustomContext();

    useEffect(() => {
        updateLoadingStatus(loading);
    }, [loading]);

    return (
        <View style={{ flex: 1 }}>
            {/* <View style={{ justifyContent: "center", flex: 1 }}> */}
            {sectionData && sectionData.length !== 0 && (
                <View style={{ flex: 1 }}>
                    {/* TODO: FlatList 로 바꾸기. */}
                    <SectionList
                        sections={sectionData}
                        keyExtractor={(item, index) => `${item.id + index}`}
                        renderItem={({ item, section }) => {
                            if (
                                section.title === "요청한 설문" &&
                                isGQLSurvey(item)
                            ) {
                                return postedRenderItem({ item });
                            } else if (
                                section.title === "작성중인 설문" &&
                                isPostingSurveyState(item)
                            ) {
                                return postingRenderItem({ item });
                            }
                        }}
                        SectionSeparatorComponent={() => <Spacer size={30} />}
                        ItemSeparatorComponent={() => <Spacer size={10} />}
                        renderSectionHeader={({ section }) => (
                            <View>
                                <Text
                                    style={[
                                        styles.sectionTitle,
                                        { marginBottom: 20 },
                                    ]}
                                >
                                    {section.title}
                                </Text>
                            </View>
                        )}
                        ListFooterComponent={
                            <TextButton
                                title="설문 만들기"
                                onPress={() => {
                                    navigation.navigate(
                                        NavigationTitle.posting,
                                        {
                                            postingSurveyState: undefined,
                                        }
                                    );
                                }}
                                textStyle={{
                                    textAlign: "center",
                                    fontSize: 18,
                                    fontWeight: "700",
                                }}
                                backgroundStyle={{
                                    backgroundColor: "white",
                                    // height: 40,
                                    height: 60,
                                    borderRadius: 16,
                                    marginBottom: 30,
                                    marginHorizontal: 20,
                                    marginTop: 20,
                                }}
                            />
                        }
                    />
                </View>
            )}

            {sectionData && sectionData.length === 0 && (
                <View style={{ justifyContent: "center", flex: 1 }}>
                    <TextButton
                        title="설문 만들기"
                        onPress={() => {
                            navigation.navigate(NavigationTitle.posting, {
                                postingSurveyState: undefined,
                            });
                        }}
                        textStyle={{
                            textAlign: "center",
                            fontSize: 18,
                            fontWeight: "700",
                        }}
                        backgroundStyle={{
                            backgroundColor: "white",
                            height: 60,
                            borderRadius: 16,
                            marginBottom: 30,
                            marginHorizontal: 20,
                            marginTop: 20,
                        }}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: fontSizes.l24,
        fontWeight: "bold",
        textAlign: "center",
        borderTopColor: colors.black,
        backgroundColor: "#d9d9d9",
        borderTopWidth: 1,
        overflow: "hidden",
    },
});
