import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Button,
    FlatList,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
// import { getPostedSurveys, getSurvey } from "../API/gqlAPI";
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
// import { UserResponse, login } from "../API/API";
import { UserResponse, login } from "../API/UserAPI";
import { useDispatch } from "react-redux";
import { UserState } from "../interfaces/UserState";
import { API_BASE_URL, GQL_URL } from "../API/API";
import { loadWholeGeo, saveUserState, saveWholeGeos } from "../utils/Storage";
// import { NavigationTitle } from "../utils/NavigationTitle";
import { NavigationTitle } from "../utils/NavHelper";
import ImageButton from "../components/ImageButton";
import { logObject } from "../utils/Log";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { getSurveyQuery } from "../API/gqlQuery";
import { RefreshControl } from "react-native-gesture-handler";
import { fetchAllGeoInfos } from "../API/GeoAPI";

import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

// TODO:
const screenWidth = Dimensions.get("window").width;

function HomeScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.home>;
}) {
    const [refreshing, setRefreshing] = useState(false);
    const generateExcel = () => {
        console.log("generateExcel called");
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet([
            // work sheet
            ["Odd", "Even", "Total"],
            // [1, 2, { t: "n", v: 3, f: "A2+B2" }],
            // [3, 4, { t: "n", v: 7, f: "A3+B3" }],
            // [5, 6, { t: "n", v: 10, f: "A4+B4" }],
            [1, 2, { t: "n", f: "A2+B2" }],
            [3, 4, { t: "n", f: "A3+B3" }],
            [5, 6, { t: "n", f: "A4+B4" }],
        ]);
        // Odd | Even | Total
        //  1      2    3
        //  3      4    7
        //  5      6    11

        XLSX.utils.book_append_sheet(wb, ws, "MyFirstSheet", true);

        let ws2 = XLSX.utils.aoa_to_sheet([
            ["Odd*2", "Even*2", "Total"],
            [
                { t: "n", f: "MyFirstSheet!A2*2" },
                { t: "n", f: "MyFirstSheet!B2*2" },
                { t: "n", f: "A2+B2" },
            ],
            [
                { t: "n", f: "MyFirstSheet!A3*2" },
                { t: "n", f: "MyFirstSheet!B3*2" },
                { t: "n", f: "A3+B3" },
            ],
            [
                { t: "n", f: "MyFirstSheet!A4*2" },
                { t: "n", f: "MyFirstSheet!B4*2" },
                { t: "n", f: "A4+B4" },
            ],
        ]);

        // Odd | Even | Total
        //  2      4      6
        //  6      8     14
        //  10      12    22

        XLSX.utils.book_append_sheet(wb, ws2, "MySecondSheet", true);

        const base64 = XLSX.write(wb, { type: "base64" });
        const filename = FileSystem.documentDirectory + "MyExcel.xlsx";
        FileSystem.writeAsStringAsync(filename, base64, {
            encoding: FileSystem.EncodingType.Base64,
        }).then(() => {
            Sharing.shareAsync(filename);
        });
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchSurveys().then(newSurveys => {
            setSurveys(newSurveys);
            setRefreshing(false);
        });
    };

    const postingNavTitle = NavigationTitle.posting;
    const dispatch = useDispatch();
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
                                generateExcel();
                            }}
                        />
                    </TouchableOpacity>

                    {/* <View style={{ width: 10 }}></View>
                    <TouchableOpacity
                        onPress={() => console.log("Share tapped!")}
                        style={{ marginRight: 10 }}
                    >
                        <Feather name="bell" size={24} color="black" />
                    </TouchableOpacity> */}
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
                // TODO: handle error
                // console.log(error);
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
            // console.log("Error fetching data: ", error.message);
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

    if (isLoading) {
        return (
            <ActivityIndicator
                animating={isLoading}
                style={{ flex: 1 }}
                size={"large"}
                color={colors.deepMainColor}
            />
        );
    }

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
