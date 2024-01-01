import React, { useState, useEffect } from "react";
import { View, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import { borderSizes, fontSizes, marginSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import AvailableSurvey from "./AvailableSurvey";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/NavHelper";
import { Survey } from "../interfaces/Survey";
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
import { useCustomContext } from "../features/context/CustomContext";
import { UserService } from "../API/Services/UserService";
import { DefaultModal } from "../modals/DefaultModal";
import { PostingSurveyState } from "../interfaces/PostingSurveyState";
import { postingSurveyDataManager } from "../utils/PostingSurveyStorage";
import showAdminToast from "../components/common/toast/showAdminToast";
import { SearchingModal } from "../modals/SearchingModal";
import { SurveyService } from "../API/Services/SurveyService";
import { GeoService } from "../API/Services/GeoService";
import CollectedMoney from "../components/CollectedMoney";
import { SearhchedSurveyModal } from "../modals/SearchedSurveyModal";

const screenWidth = Dimensions.get("window").width;

function HomeScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.home>;
}) {
    const userService = new UserService();
    const surveyService = new SurveyService();

    const [searchedSurvey, setSearchedSurvey] = useState<Survey>(null);
    const [refreshing, setRefreshing] = useState(false);

    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isPostingModalVisible, setIsPostingModalVisible] = useState(false);
    const [isSearchingModalVisible, setIsSearchingModalVisible] =
        useState(false);

    const [isSearchedSurveyModalVisible, setIsSearchedSurveyModalVisible] =
        useState(false);

    const [searchingCode, setSearchingCode] = useState("");

    const toggleSearchingModalVisibility = () => {
        setIsSearchingModalVisible(!isSearchingModalVisible);
    };

    const {
        userDetail,
        updateUserDetail,
        updateLoadingStatus,
        accessToken,
        updateParticipatingSurveyId,
    } = useCustomContext();

    const [postingSurvey, setPostingSurvey] =
        useState<PostingSurveyState>(undefined);

    const togglePostingModalVisibility = () => {
        setIsPostingModalVisible(!isPostingModalVisible);
    };

    const moveToPostingScreen = () => {
        navigation.navigate(NavigationTitle.posting, {
            postingSurveyState: null,
        });
    };

    const onRefresh = () => {
        setRefreshing(true);
        surveyService.getSurveys(accessToken).then(surveysResult => {
            setSurveys(surveysResult.data);
            setRefreshing(false);
        });
    };

    // for printing.
    useEffect(() => {
        logObject("fetched surveys", surveys);
    }, [surveys]);

    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const detailInfoResult = await userService.getUserDetail(
                    accessToken
                );
                logObject("userDetail", detailInfoResult);
                updateUserDetail(detailInfoResult.data);
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
                                toggleSearchingModalVisibility();
                                setIsSearchingModalVisible(true);
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

    // Component 가 Rendering 될 때 API 호출
    useEffect(() => {
        const updateSurveys = async () => {
            await surveyService
                .getSurveys(accessToken)
                .then(surveysResult => {
                    logObject("surveyResult", surveysResult);
                    setIsLoading(false);
                    setSurveys(surveysResult.data);
                })
                .catch(error => {
                    showAdminToast("error", error.message);
                });
        };

        updateSurveys();

        console.log("HomeScreen Testing");
    }, []);

    useEffect(() => {
        setSearchingCode("");
    }, [isSearchingModalVisible]);

    useEffect(() => {
        const postingSurvey = async () => {
            const result = await postingSurveyDataManager.load();
            if (result) {
                setPostingSurvey(result);
            }
            logObject("postingSurvey", result);
        };
        postingSurvey();
    }, [postingSurvey]);

    const renderItem = ({ item }: { item: Survey }) => (
        <AvailableSurvey
            title={item.title}
            currentParticipation={item.currentParticipation}
            participationGoal={item.participationGoal}
            genres={item.genres}
            createdAt={item?.createdAt}
            expectedTimeInSec={item.expectedTimeInSec}
            reward={item.reward}
            onPress={() => {
                updateParticipatingSurveyId(item.id);
                navigation.navigate(NavigationTitle.participate, {
                    sectionId: item.initialSectionId,
                    surveyId: item.id,
                });
            }}
        />
    );

    useEffect(() => {
        updateLoadingStatus(isLoading);
    }, [isLoading]);

    useEffect(() => {
        const fetchPostingSurvey = async () => {
            const ret = await postingSurveyDataManager.load();
            if (ret) {
                setPostingSurvey(ret);
            }
        };

        const unsubscribeFocus = navigation.addListener("focus", () => {
            setIsPostingModalVisible(false);
            fetchPostingSurvey();
        });

        return unsubscribeFocus;
    }, [navigation]);

    const searchAction = async () => {
        const ret = await surveyService.getByCode(searchingCode, accessToken);
        logObject("fetched survey:", ret.data);
        if (ret.data !== null) {
            setSearchedSurvey(ret.data);
            setIsSearchingModalVisible(false);
            setIsSearchedSurveyModalVisible(true);
        }
    };

    // 'HCXQAOU'
    return (
        <SafeAreaView style={styles.container} edges={[]}>
            <View style={styles.subContainer}>
                {postingSurvey && (
                    <DefaultModal
                        title="작성중인 설문이 있습니다"
                        description="이어서 작성할까요?"
                        firstSelectionText="이어서 작성할게요"
                        onFirstSelection={() => {
                            setIsPostingModalVisible(false);
                            navigation.navigate(NavigationTitle.posting, {
                                postingSurveyState: postingSurvey,
                            });
                        }}
                        secondSelectionText="새로 작성할게요"
                        onSecondSelection={() => {
                            setIsPostingModalVisible(false);
                            navigation.navigate(NavigationTitle.posting, {
                                postingSurveyState: null,
                            });
                        }}
                        isModalVisible={isPostingModalVisible}
                        onClose={() => {
                            console.log("onClose tapped");
                            togglePostingModalVisibility();
                        }}
                    />
                )}
                <SearchingModal
                    title="설문 코드 검색"
                    onSearchAction={() => {
                        // log("second selection tapped");
                        // TODO: Search Survey By Code
                        searchAction();
                    }}
                    searchingCode={searchingCode}
                    setSearchingCode={setSearchingCode}
                    searchText="검색"
                    isModalVisible={isSearchingModalVisible}
                    onClose={() => {
                        setIsSearchingModalVisible(false);
                    }}
                />

                <SearhchedSurveyModal
                    confirmText="참여"
                    onConfirmAction={() => {
                        updateParticipatingSurveyId(searchedSurvey.id);
                        navigation.navigate(NavigationTitle.participate, {
                            sectionId: searchedSurvey.initialSectionId,
                            surveyId: searchedSurvey.id,
                        });
                    }}
                    searchedSurvey={searchedSurvey}
                    // title=""
                    isModalVisible={isSearchedSurveyModalVisible}
                    onClose={() => {
                        setIsSearchedSurveyModalVisible(false);
                    }}
                />
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
                            togglePostingModalVisibility();
                        } else {
                            moveToPostingScreen();
                        }
                    }}
                >
                    <Feather name="plus" size={36} color={colors.white} />
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
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        position: "absolute",
        backgroundColor: colors.deeperMainColor,
        alignItems: "center",
        justifyContent: "center",
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
        color: colors.white,
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
