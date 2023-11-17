import React, { useState, useEffect } from "react";
import { View, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import { borderSizes, marginSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import AvailableSurvey from "./AvailableSurvey";
import CollectedMoney from "../components/CollectedMoney";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/NavHelper";
import { Survey } from "../interfaces/Survey";

import { UserState } from "../interfaces/UserState";
import { API_BASE_URL, GQL_URL } from "../API/API";
import { loadWholeGeo, saveUserState, saveWholeGeos } from "../utils/Storage";
import { NavigationTitle } from "../utils/NavHelper";
import { log, logObject } from "../utils/Log";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { getSurveyQuery } from "../API/gqlQuery";
import { RefreshControl } from "react-native-gesture-handler";
import { fetchAllGeoInfos } from "../API/GeoAPI";

import { useCustomContext } from "../features/context/CustomContext";
import { getSurveys } from "../API/SurveyAPI";
import { getUserDetail } from "../API/UserAPI";

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
        fetchSurveys().then(newSurveys => {
            setSurveys(newSurveys);
            setRefreshing(false);
        });
    };

    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const setUser = async (userState: UserState) => {
        await saveUserState(userState);
    };

    const { userDetail, updateUserDetail } = useCustomContext();

    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const detailInfo = await getUserDetail(accessToken);
                updateUserDetail(detailInfo);
            } catch (error) {
                throw new Error(error.message);
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
                            userDetail !== null ? userDetail.collectedReward : 0
                        }
                    />
                </View>
            ),
        });
        logObject("userDetail flag", userDetail);
        // log(`collected money ${userDetail.collectedReward}`);
    }, [navigation, userDetail]);

    const { accessToken } = useCustomContext();

    const fetchSurveys = async () => {
        const ret = await getSurveys(accessToken).catch(error => {
            throw new Error("error fetching surveys");
        });
        return ret;
    };

    const updateSurveys = async () => {
        await getSurveys(accessToken)
            .then(surveys => {
                setIsLoading(false);
                setSurveys(surveys);
            })
            .catch(error => {
                console.error("error updating surveys");
            });
    };

    // Component 가 Rendering 될 때 API 호출
    useEffect(() => {
        const fetchGeos = async () => {
            const allGeos = await fetchAllGeoInfos();
            saveWholeGeos(allGeos);
        };

        fetchGeos();
        updateSurveys();

        console.log("HomeScreen Testing");
    }, []);

    const renderItem = ({ item }: { item: Survey }) => (
        <AvailableSurvey
            title={item.title}
            currentParticipation={item.currentParticipation}
            participationGoal={item.participationGoal}
            genres={item.genres}
            onPress={() =>
                navigation.navigate(NavigationTitle.participate, {
                    sectionId: item.initialSectionId,
                    surveyId: item.id,
                })
            }
        />
    );

    const { updateLoadingStatus } = useCustomContext();

    useEffect(() => {
        updateLoadingStatus(isLoading);
    }, [isLoading]);

    return (
        <SafeAreaView style={styles.container} edges={[]}>
            <View style={styles.subContainer}>
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
