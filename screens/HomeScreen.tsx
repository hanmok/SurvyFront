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
import { UserState, setUserInfo } from "../features/user/userSlice";
import { API_BASE_URL } from "../API/API";

const data = [
    {
        id: "1",
        title: "Item 1",
        currentParticipation: "10",
        participationGoal: "100",
    },
    {
        id: "2",
        title: "Item 2",
        currentParticipation: "10",
        participationGoal: "100",
    },
    {
        id: "3",
        title: "Item 3",
        currentParticipation: "10",
        participationGoal: "100",
    },
    // ... 더 많은 아이템 추가 가능
];

const screenWidth = Dimensions.get("window").width;

function HomeView({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, "Home">;
}) {
    const dispatch = useDispatch();
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // login({ username: "kkk@gmail.com", password: "kkkk" });
        // const userResponse: login("kkk@gmail.com", "kkkk");
        // const userResponse: User = await login("kkk@gmail.com", "kkkk");
        // const userResponse: UserResponse = await login('kkk@gmail.com', 'kkkk')

        const fetchUser = async () => {
            try {
                const userResponse = await login("kkk@gmail.com", "kkkk");
                console.log(
                    `userResponse: ${userResponse.data.userId}, ${userResponse.data.accessToken}, ${userResponse.data.refreshToken}`
                );
                const { userId, accessToken, refreshToken } = userResponse.data;
                const userState: UserState = {
                    userId,
                    accessToken,
                    refreshToken,
                };
                // dispatch(setUserInfo({ userId, accessToken, refreshToken }));
                dispatch(setUserInfo({ userState }));
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
                navigation.navigate("Participate", {
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
                        onPress={() => navigation.navigate("Posting")}
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
