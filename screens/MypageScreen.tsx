import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import BlockView from "../components/BlockView";
import { fontSizes, paddingSizes } from "../utils/sizes";
import ImageButton from "../components/ImageButton";
import { Ionicons } from "@expo/vector-icons";
import { screenWidth } from "../utils/ScreenSize";
import { log } from "../utils/Log";
import { RootStackParamList } from "../RootStackParamList";
import { NavigationTitle } from "../utils/NavigationTitle";
import { StackNavigationProp } from "@react-navigation/stack";

function MypageScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.mypage>;
}) {
    const [numOfParticipatedSurveys, setNumOfParticiapatedSurveys] =
        useState<number>(0);
    const [numOfPostedSurveys, setNumOfPostedSurveys] = useState<number>(0);

    const handleClick = (flag: number) => {
        log(`click ${flag}`);
    };
    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            {/*  Navigation Bar */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    height: 90,
                    width: screenWidth,
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
                        navigation.navigate(
                            NavigationTitle.participatedSurveys
                        );
                        handleClick(1);
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
