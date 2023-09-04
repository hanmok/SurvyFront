import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import { borderSizes, marginSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import AvailableSurvey from "./AvailableSurvey";
import CollectedMoney from "../components/CollectedMoney";
import axios from "axios";
import TextButton from "../components/TextButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackParamList";
import { Survey } from "../interfaces/Survey";
import { Counter } from "../features/counter/Counter";
import { ResponseForm } from "../interfaces/ResponseForm";
// import { UserResponse, login } from "../API/API";
import { UserResponse, login } from "../API/UserAPI";
import { useDispatch } from "react-redux";
import { UserState } from "../interfaces/UserState";
import { API_BASE_URL } from "../API/API";
import { saveUserState } from "../utils/Storage";
import { NavigationTitle } from "../utils/NavigationTitle";
// import AsyncStore
const screenWidth = Dimensions.get("window").width;
// import { MMKVstorage, StorageKeys } from "../utils/mmkv";

function HomeView({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.home>;
}) {
    const postingNavTitle = NavigationTitle.posting;
    const dispatch = useDispatch();
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const setUser = async (userState: UserState) => {
        await saveUserState(userState);
    };

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
                // await setUser(userState);
                setUser(userState);
                // MMKV.set('userId', userId)

                // dispatch(setUserInfo({ userId, accessToken, refreshToken }));
                // dispatch(setUserInfo({ userState }));
            } catch (error) {
                // TODO: handle error
                console.log(error);
            }
        };
        fetchUser();
    }, []);

    const fetchSurveys = async () => {
        try {
            await fetch(`${API_BASE_URL}/survey`)
                .then(response => response.json())
                .then(jsonData =>
                    jsonData.data.map((item: Survey) => ({
                        title: item.title,
                        id: item.id,
                        currentParticipation: item.currentParticipation,
                        participationGoal: item.participationGoal,
                        initialSectionId: item.initialSectionId,
                        rewardRange: item.rewardRange,
                    }))
                )
                .then(surveys => {
                    console.log(`umm.. `, surveys);
                    setIsLoading(false);
                    setSurveys(surveys);
                });
        } catch (error) {
            console.log("Error fetching data: ", error.message);
        }
    };

    // Component 가 Rendering 될 때 API 호출
    useEffect(() => {
        fetchSurveys();
    }, []);

    const renderItem = ({ item }: { item: Survey }) => (
        <AvailableSurvey
            title={item.title}
            currentParticipation={item.currentParticipation}
            participationGoal={item.participationGoal}
            onPress={() =>
                // navigation.navigate("Participate", {
                navigation.navigate(NavigationTitle.participate, {
                    sectionId: item.initialSectionId,
                    surveyId: item.id,
                })
            }
        />
    );

    if (isLoading) {
        return (
            <View>
                <Text style={{ backgroundColor: "magenta" }}>loading..</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* <Text style={styles.collectedMoney}>Collected Money</Text> */}
            {/* <CollectedMoney amount={10000} style={styles.collectedMoney} /> */}
            {/* <Counter /> */}
            <CollectedMoney amount={10000} />
            <View style={styles.subContainer}>
                <FlatList
                    data={surveys}
                    renderItem={renderItem}
                    keyExtractor={item => `${item.id}`}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 16 }} />
                    )}
                    style={styles.surveyListContainer}
                />
                <View style={styles.floatingButtonContainer}>
                    <TextButton
                        title="설문요청"
                        onPress={() =>
                            navigation.navigate(
                                postingNavTitle as keyof RootStackParamList
                            )
                        }
                        backgroundStyle={styles.requestContainer}
                        textStyle={styles.requestText}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: colors.background,
    },
    subContainer: {
        justifyContent: "flex-end",
        // alignItems: "center",
        alignItems: "stretch",
        // paddingBottom: 200,
    },

    floatingButtonContainer: {
        alignItems: "center",
        // flex: 1,
        position: "absolute",
        bottom: 0,
        width: screenWidth,
        // backgroundColor: "magenta",
        // backgroundColor: "rgba(0,0,0,0)",
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
        backgroundColor: colors.magenta,
        paddingTop: 10,
        paddingBottom: 16,
    },
    surveyListContainer: {
        paddingTop: 20,
        marginHorizontal: marginSizes.m16,
        paddingBottom: 200,
        backgroundColor: "magenta",
        // marginBottom: 200,
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

export default HomeView;
