import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Button,
    FlatList,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import { borderSizes, marginSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import AvailableSurvey from "./AvailableSurvey";
import CollectedMoney from "../components/CollectedMoney";
import axios from "axios";
import TextButton from "../components/TextButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/NavHelper";
import { Survey } from "../interfaces/Survey";
import { Counter } from "../features/counter/Counter";
import { ResponseForm } from "../interfaces/ResponseForm";
import { UserResponse, login } from "../API/UserAPI";
import { useDispatch } from "react-redux";
import { UserState } from "../interfaces/UserState";
import { API_BASE_URL, GQL_URL } from "../API/API";
import { loadWholeGeo, saveUserState, saveWholeGeos } from "../utils/Storage";
import { NavigationTitle } from "../utils/NavHelper";
import { logObject } from "../utils/Log";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { getSurveyQuery } from "../API/gqlQuery";
import { RefreshControl } from "react-native-gesture-handler";
import { fetchAllGeoInfos } from "../API/GeoAPI";

import { useCustomContext } from "../features/context/CustomContext";

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
                    <CollectedMoney amount={10000} />
                </View>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userResponse = await login("kkk@gmail.com", "kkkk");
                const { userId, accessToken, refreshToken } = userResponse.data;
                const userState: UserState = {
                    userId,
                    accessToken,
                    refreshToken,
                };
                setUser(userState);
            } catch (error) {
                console.error("fetch User", error);
            }
        };
        fetchUser();
    }, []);

    const fetchSurveys = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/survey`);
            const jsonData = await response.json();

            logObject("fetching survey result: ", jsonData);

            const surveys: Survey[] = jsonData.data.map((item: Survey) => ({
                title: item.title,
                id: item.id,
                currentParticipation: item.currentParticipation,
                participationGoal: item.participationGoal,
                initialSectionId: item.initialSectionId,
                // rewardRange: item.rewardRange,
            }));

            return surveys; // 이 부분이 수정된 부분. 함수가 Promise<[Survey]>를 반환하게 함
        } catch (error) {
            throw new Error("error fetching survey");
        }
    };

    // GQL 로 바꿀 것. 왜? 쓸모 없는 정보때문에? 너무 많은데.. ? 뭐가 있는데?
    const updateSurveys = async () => {
        try {
            await fetch(`${API_BASE_URL}/survey`)
                .then(response => response.json())
                .then(jsonData => {
                    logObject("fetching survey result: ", jsonData);
                    return jsonData;
                })
                .then(jsonData =>
                    jsonData.data.map((item: Survey) => ({
                        title: item.title,
                        id: item.id,
                        currentParticipation: item.currentParticipation,
                        participationGoal: item.participationGoal,
                        initialSectionId: item.initialSectionId,
                    }))
                )
                .then(surveys => {
                    console.log(`umm.. `, surveys);
                    setIsLoading(false);
                    setSurveys(surveys);
                });
        } catch (error) {
            console.error("error fetching surveys", error);
        }
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
                    keyExtractor={item => `${item.id}`}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 16 }} />
                    )}
                    contentContainerStyle={{ justifyContent: "flex-start" }}
                    style={styles.surveyListContainer}
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
        // justifyContent: "space-between",
        justifyContent: "flex-start",
        backgroundColor: colors.background,
        gap: 10,
    },
    subContainer: {
        marginTop: 5,
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
        // backgroundColor: colors.magenta,
        paddingTop: 10,
        paddingBottom: 16,
    },
    surveyListContainer: {
        paddingTop: 20,
        // marginHorizontal: marginSizes.m16,
        // backgroundColor: "magenta",
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
