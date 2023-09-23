import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import BlockView from "../components/BlockView";
import { fontSizes, paddingSizes } from "../utils/sizes";
import ImageButton from "../components/ImageButton";
import { Ionicons } from "@expo/vector-icons";
import { screenHeight, screenWidth } from "../utils/ScreenSize";
import { log, logObject } from "../utils/Log";
import { RootStackParamList } from "../utils/NavHelper";
// import { NavigationTitle } from "../utils/NavigationTitle";
import { NavigationTitle } from "../utils/NavHelper";
import { StackNavigationProp } from "@react-navigation/stack";
import { loadUserState } from "../utils/Storage";
import axios from "axios";
import { API_BASE_URL } from "../API/API";

function MypageScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.mypage>;
}) {
    const [numOfParticipatedSurveys, setNumOfParticipatedSurveys] =
        useState<number>(0);
    const [numOfPostedSurveys, setNumOfPostedSurveys] = useState<number>(0);

    const handleClick = (flag: number) => {
        log(`click ${flag}`);
    };

    const getNumbers = async () => {
        const myUserId = (await loadUserState()).userId;

        axios({
            method: "GET",
            url: `${API_BASE_URL}/user/${myUserId}/participated-surveys`,
        })
            .then(res => {
                console.log(res.data);
                logObject(`participated surveys`, res.data);
                return res.data;
                // setNumOfParticipatedSurveys(res.data.data.length);
            })
            .then(res => {
                setNumOfParticipatedSurveys(res.data.length);
            })
            .catch(err => {});

        axios({
            method: "GET",
            url: `${API_BASE_URL}/user/${myUserId}/posted-surveys`,
        })
            .then(res => res.data)
            .then(res => setNumOfPostedSurveys(res.data.length))
            .catch(err => {});
    };

    const navigateToSetting = () => {
        navigation.navigate(NavigationTitle.setting);
    };

    const navigateToMyInfo = () => {
        navigation.navigate(NavigationTitle.myinfo);
    };

    useEffect(() => {
        getNumbers();
        // console.log()
        console.log('[MypageScreen] screenWidth: ', screenWidth)
        console.log('[MypageScreen] screenHeight: ', screenHeight)
    }, [numOfParticipatedSurveys, numOfPostedSurveys]);

    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            {/*  Navigation Bar */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    height: 90,
                    width: screenWidth,
                    // width: 400,
                    backgroundColor: "white",
                    paddingHorizontal: paddingSizes.xl24,
                    paddingTop: 40,
                    // paddingBottom: 20,
                }}
            >
                <Text
                    style={{
                        alignSelf: "center",
                        fontSize: fontSizes.m20,
                        fontWeight: "bold",
                    }}
                >
                    nickname
                </Text>

                <ImageButton
                    img={require("../assets/settingIcon.png")}
                    size={24}
                    onPress={navigateToSetting}
                />
            </View>

            <View
                style={{
                    alignSelf: "stretch",
                    marginHorizontal: 20,
                    rowGap: 20,
                    marginTop: 30,
                }}
            >
                <BlockView
                    onPress={() => {
                        // navigation.navigate(
                        //     NavigationTitle.participatedSurveys
                        // );
                        navigateToMyInfo();
                        handleClick(1);
                    }}
                >
                    <Text style={[styles.eachBoxTextStyle, { padding: 20 }]}>
                        내 정보
                    </Text>
                </BlockView>

                <BlockView
                    onPress={() => {
                        // navigation.navigate(
                        //     NavigationTitle.participatedSurveys
                        // );
                        // handleClick(1);
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 20,
                        }}
                    >
                        <Text style={styles.eachBoxTextStyle}>참여한 설문</Text>
                        <Text style={styles.eachBoxTextStyle}>
                            {numOfParticipatedSurveys} 개
                        </Text>
                    </View>
                </BlockView>

                <BlockView
                    onPress={() => {
                        navigation.navigate(NavigationTitle.postedSurveys);
                        handleClick(2);
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 20,
                        }}
                    >
                        <Text style={styles.eachBoxTextStyle}>요청한 설문</Text>
                        <Text style={styles.eachBoxTextStyle}>
                            {numOfPostedSurveys} 개
                        </Text>
                    </View>
                </BlockView>
            </View>
        </View>
    );
}

export default MypageScreen;

const styles = StyleSheet.create({
    eachBoxTextStyle: { fontSize: fontSizes.m20 },
});
