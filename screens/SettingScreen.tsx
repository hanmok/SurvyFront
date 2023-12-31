import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/NavHelper";
// import { NavigationTitle } from "../utils/NavigationTitle";
import { NavigationTitle } from "../utils/NavHelper";
import { View, Text, StyleSheet } from "react-native";
import BlockView from "../components/BlockView";
import { ReactNode, useEffect, useState } from "react";
import TextButton from "../components/TextButton";
import { colors } from "../utils/colors";
import { fontSizes } from "../utils/sizes";
import { removeUser } from "../API/UserAPI";
import { useCustomContext } from "../features/context/CustomContext";

function SettingScreen({
    navigation,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.setting
    >;
}) {
    // const blockContainer = ({ text }: { text: string }) => {
    const blockContainer = ({ text }: { text: string }) => {
        return (
            <BlockView>
                <Text>{text}</Text>
            </BlockView>
        );
    };

    const handleResign = () => {
        console.log("resign tapped");
    };

    const [resignTapped, setResignTapped] = useState(false);
    const { userId, accessToken } = useCustomContext();

    useEffect(() => {
        const resign = async (userId: number, accessToken: string) => {
            await removeUser(userId, accessToken);
            navigation.popToTop();
        };

        if (resignTapped) {
            resign(userId, accessToken);
        }
    }, [resignTapped]);

    return (
        <View>
            <View
                style={{
                    justifyContent: "space-around",
                    marginVertical: 30,
                    alignItems: "center",
                    alignContent: "stretch",
                }}
            >
                <View style={{ height: 40 }}></View>
                <View
                    style={{
                        alignSelf: "stretch",
                        marginHorizontal: 20,
                        gap: 15,
                    }}
                >
                    <BlockView
                        onPress={() => {
                            navigation.navigate(
                                NavigationTitle.participatedSurveys
                            );
                        }}
                    >
                        <Text
                            style={[styles.eachBoxTextStyle, { padding: 20 }]}
                        >
                            닉네임 변경
                        </Text>
                    </BlockView>

                    <BlockView
                        onPress={() => {
                            navigation.navigate(
                                NavigationTitle.participatedSurveys
                            );
                        }}
                    >
                        <Text
                            style={[styles.eachBoxTextStyle, { padding: 20 }]}
                        >
                            이용약관
                        </Text>
                    </BlockView>

                    {/* {blockContainer({ text: "로그아웃" })} */}
                    <BlockView
                        onPress={() => {
                            navigation.navigate(NavigationTitle.login);
                        }}
                    >
                        <Text
                            style={[styles.eachBoxTextStyle, { padding: 20 }]}
                        >
                            로그아웃
                        </Text>
                    </BlockView>

                    {/* <TextButton
                        title="로그아웃"
                        onPress={() => {
                            // Todo: 회원 정보, Token 초기화
                            navigation.navigate(NavigationTitle.login);
                        }}
                    /> */}
                </View>
                <View style={{ height: 500 }}></View>
                <View style={{ alignItems: "center" }}>
                    <TextButton
                        title="회원 탈퇴"
                        onPress={() => {
                            setResignTapped(true);
                        }}
                        textStyle={{ color: colors.gray3 }}
                    />
                    <View
                        style={{
                            backgroundColor: colors.gray3,
                            height: 1,
                            width: 80,
                        }}
                    ></View>
                </View>
            </View>
        </View>
    );
}

export default SettingScreen;

const styles = StyleSheet.create({
    eachBoxTextStyle: { fontSize: fontSizes.m20 },
});
