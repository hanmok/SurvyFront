import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import BlockView from "../../components/BlockView";
import { fontSizes, marginSizes, paddingSizes } from "../../utils/sizes";
import ImageButton from "../../components/ImageButton";

import { screenHeight, screenWidth } from "../../utils/ScreenSize";
import { log, logObject } from "../../utils/Log";
import { RootStackParamList } from "../../utils/NavHelper";

import { NavigationTitle } from "../../utils/NavHelper";
import { StackNavigationProp } from "@react-navigation/stack";
// import { loadUserState } from "../utils/Storage";
import { API_BASE_URL } from "../../API/API";
import {
    getParticipatedSurveyIds,
    getPostedSurveyIds,
} from "../../API/UserAPI";
import { useCustomContext } from "../../features/context/CustomContext";
import TextButton from "../../components/TextButton";
import PointBlockView from "../../components/PointBlockView";
import ReputationBlockView from "../../components/ReputationBlockView";
import showToast from "../../components/common/toast/Toast";
import { WithdrawalModal } from "../../modals/WithdrawalModal";
// import { getParticipatedSurveyIds, getParticipatedSurveyIds, getPostedSurveyIds } from "../API/UserAPI";

function MypageScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.mypage>;
}) {
    const [numOfParticipatedSurveys, setNumOfParticipatedSurveys] =
        useState<number>(0);
    const [numOfPostedSurveys, setNumOfPostedSurveys] = useState<number>(0);
    const { userId, accessToken } = useCustomContext();
    const [withdrawalModalVisible, setWithdrawalModalVisible] = useState(false);
    const getNumbers = async () => {
        await getPostedSurveyIds(userId, accessToken).then(postings =>
            setNumOfPostedSurveys(postings.length)
        );
        await getParticipatedSurveyIds(userId, accessToken).then(
            participatings => setNumOfParticipatedSurveys(participatings.length)
        );
    };

    const { userDetail } = useCustomContext();

    const navigateToMyInfo = () => {
        navigation.navigate(NavigationTitle.myinfo);
    };

    useEffect(() => {
        getNumbers();
        console.log("[MypageScreen] screenWidth: ", screenWidth);
        console.log("[MypageScreen] screenHeight: ", screenHeight);
    }, [numOfParticipatedSurveys, numOfPostedSurveys]);

    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <WithdrawalModal
                isModalVisible={withdrawalModalVisible}
                onClose={() => {
                    setWithdrawalModalVisible(false);
                }}
                totalPoint={userDetail?.collectedReward ?? 0}
            />
            <View
                style={{
                    alignSelf: "stretch",
                    marginHorizontal: marginSizes.l20,
                    rowGap: 20,
                    marginTop: marginSizes.xxl28,
                }}
            >
                <BlockView
                    onPress={() => {
                        navigateToMyInfo();
                    }}
                >
                    <Text style={[styles.eachBoxTextStyle, { padding: 20 }]}>
                        내 정보
                    </Text>
                </BlockView>

                <BlockView
                    onPress={() => {
                        navigation.navigate(
                            NavigationTitle.participatedSurveys
                        );
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

                <PointBlockView
                    onPressHistory={() => {
                        // showToast("success", "navToParticipatedSurveys");
                        navigation.navigate(NavigationTitle.pointHistory);
                    }}
                    onPressWithdrawal={() => {
                        setWithdrawalModalVisible(true);
                    }}
                    collectedReward={userDetail?.collectedReward}
                />
                <ReputationBlockView reputation={userDetail?.reputation} />
            </View>
        </View>
    );
}

export default MypageScreen;

const styles = StyleSheet.create({
    eachBoxTextStyle: { fontSize: fontSizes.m20 },
});
