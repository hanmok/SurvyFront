import React, { useState, useEffect } from "react";
import { View, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import { borderSizes, fontSizes, marginSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import AvailableSurvey from "./AvailableSurvey";
import CollectedMoney from "../components/CollectedMoney";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/NavHelper";
import { Survey } from "../interfaces/Survey";

import { UserState } from "../interfaces/UserState";
import { API_BASE_URL, GQL_URL } from "../API/API";
import { NavigationTitle } from "../utils/NavHelper";
import { log, logObject } from "../utils/Log";
import {
    Feather,
    Ionicons,
    MaterialCommunityIcons,
    Octicons,
} from "@expo/vector-icons";

import { getSurveyQuery } from "../API/gqlQuery";
import { RefreshControl } from "react-native-gesture-handler";
import { fetchAllGeoInfos } from "../API/GeoAPI";

import { useCustomContext } from "../features/context/CustomContext";
import { getSurveys } from "../API/SurveyAPI";
import { getUserDetail } from "../API/UserAPI";
import { DefaultModal } from "../modals/DefaultModal";
// import { loadPostingSurvey } from "../utils/PostingSurveyStorage";
import { PostingSurveyState } from "../interfaces/PostingSurveyState";
// import { geoDataManager } from "../utils/Storage";
import { postingSurveyDataManager } from "../utils/PostingSurveyStorage";
import showToast from "../components/common/toast/Toast";
import showAdminToast from "../components/common/toast/showAdminToast";

// TODO:
const screenWidth = Dimensions.get("window").width;

function HomeScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.home>;
}) {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        getSurveys(accessToken).then(newSurveys => {
            setSurveys(newSurveys);
            setRefreshing(false);
        });
    };

    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { userDetail, updateUserDetail } = useCustomContext();

    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const detailInfo = await getUserDetail(accessToken);
                logObject("userDetail", detailInfo);
                updateUserDetail(detailInfo);
            } catch (error) {
                showAdminToast("error", error.message);
                console.error(error);
            }
        };

        const unsubscribeFocus = navigation.addListener("focus", () => {
            fetchUserDetail();
        });

        return unsubscribeFocus;
    }, [navigation]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ marginRight: 20, flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={() => {
                            console.log("search tapped");
                        }}
                    >
                        <MaterialCommunityIcons
                            name="magnify-expand"
                            size={24}
                            color="black"
                            onPress={() => {
                                console.log("hi");
                            }}
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerLeft: () => (
                <View style={{ marginBottom: 15 }}>
                    <CollectedMoney
                        amount={
                            // userDetail !== null ? userDetail.collectedReward : 0
                            userDetail?.collectedReward ?? 0
                        }
                    />
                </View>
            ),
        });
        logObject("userDetail flag", userDetail);
        // log(`collected money ${userDetail.collectedReward}`);
    }, [navigation, userDetail]);

    const { accessToken, updateParticipatingSurveyId } = useCustomContext();

    // Component 가 Rendering 될 때 API 호출
    useEffect(() => {
        const updateSurveys = async () => {
            await getSurveys(accessToken)
                .then(surveys => {
                    setIsLoading(false);
                    setSurveys(surveys);
                })
                .catch(error => {
                    showAdminToast("error", error.message);
                });
        };

        // fetchGeos();
        updateSurveys();

        console.log("HomeScreen Testing");
    }, []);

    const [postingSurvey, setPostingSurvey] =
        useState<PostingSurveyState>(undefined);

    useEffect(() => {
        const postingSurvey = async () => {
            // const result = await loadPostingSurvey();
            const result = await postingSurveyDataManager.load();
            if (result) {
                setPostingSurvey(result);
            }
            logObject("postingSurvey", result);
        };
        postingSurvey();
    }, [postingSurvey]);

    const [postBtnTapped, setPostBtnTapped] = useState(false);

    const renderItem = ({ item }: { item: Survey }) => (
        <AvailableSurvey
            title={item.title}
            currentParticipation={item.currentParticipation}
            participationGoal={item.participationGoal}
            genres={item.genres}
            onPress={() => {
                updateParticipatingSurveyId(item.id);
                navigation.navigate(NavigationTitle.participate, {
                    sectionId: item.initialSectionId,
                    surveyId: item.id,
                });
            }}
        />
    );

    const { updateLoadingStatus } = useCustomContext();

    useEffect(() => {
        updateLoadingStatus(isLoading);
    }, [isLoading]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const navigateWith = (postingSurvey: PostingSurveyState | null) => {
        navigation.navigate(NavigationTitle.posting, {
            postingSurveyState: postingSurvey,
        });
        console.log("navigate to posting!");
    };

    const toggleModalVisibility = () => {
        setIsModalVisible(!isModalVisible);
    };

    useEffect(() => {
        const fetchPostingSurvey = async () => {
            // const ret = await loadPostingSurvey();
            const ret = await postingSurveyDataManager.load();
            if (ret) {
                setPostingSurvey(ret);
            }
        };
        const unsubscribeFocus = navigation.addListener("focus", () => {
            setIsModalVisible(false);
            fetchPostingSurvey();
        });
        return unsubscribeFocus;
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container} edges={[]}>
            <View style={styles.subContainer}>
                {postingSurvey && (
                    <DefaultModal
                        title="작성중인 설문이 있습니다"
                        description="이어서 작성할까요?"
                        firstSelectionText="이어서 작성할게요"
                        onFirstSelection={() => {
                            setIsModalVisible(false);
                            navigation.navigate(NavigationTitle.posting, {
                                postingSurveyState: postingSurvey,
                            });
                        }}
                        secondSelectionText="새로 작성할게요"
                        onSecondSelection={() => {
                            setIsModalVisible(false);
                            navigation.navigate(NavigationTitle.posting, {
                                postingSurveyState: null,
                            });
                        }}
                        isModalVisible={isModalVisible}
                        onClose={() => {
                            console.log("onClose tapped");
                            toggleModalVisibility();
                        }}
                    />
                )}
                <FlatList
                    data={surveys}
                    renderItem={renderItem}
                    keyExtractor={item => `${item.id}${item.title}`}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 3 }} />
                    )}
                    contentContainerStyle={{ justifyContent: "flex-start" }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() => {
                        if (postingSurvey) {
                            toggleModalVisibility();
                        } else {
                            navigation.navigate(NavigationTitle.posting, {
                                postingSurveyState: null,
                            });
                            // moveToPostingScreen();
                        }
                    }}
                >
                    <Octicons name="plus-circle" size={60} color="black" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        justifyContent: "flex-start",
        backgroundColor: colors.background,
    },
    subContainer: {
        justifyContent: "flex-end",
        alignItems: "stretch",
    },
    floatingButton: {
        backgroundColor: colors.gray4,
        bottom: 20,
        right: 20,
        position: "absolute",
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    floatingButtonContainer: {
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        width: screenWidth,
    },

    collectedMoney: {
        width: 120,
        justifyContent: "flex-end",
        textAlign: "right",
        alignSelf: "flex-end",
        flexBasis: 30,
        marginRight: marginSizes.s12,
        borderRadius: borderSizes.m10,
    },
    genre: {
        justifyContent: "center",
        alignSelf: "stretch",
        flexBasis: 40,

        paddingTop: 10,
        paddingBottom: 16,
    },

    requestText: {
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    requestContainer: {
        backgroundColor: "blue",
        height: 60,
        width: 60,
        borderRadius: borderSizes.xl30,
        marginBottom: 50,
    },
});

export default HomeScreen;
