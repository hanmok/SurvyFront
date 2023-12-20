import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../utils/NavHelper";
import { NavigationTitle } from "../../utils/NavHelper";
import { View, Text, StyleSheet } from "react-native";
import BlockView from "../../components/BlockView";
import { useEffect, useState } from "react";
import TextButton from "../../components/TextButton";
import { colors } from "../../utils/colors";
import { fontSizes } from "../../utils/sizes";
import { useCustomContext } from "../../features/context/CustomContext";
import { UserService } from "../../API/Services/UserService";

function SettingScreen({
    navigation,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.setting
    >;
}) {
    const userService = new UserService();
    const [resignTapped, setResignTapped] = useState(false);
    const { username, userId, accessToken } = useCustomContext();

    useEffect(() => {
        const resign = async (userId: number, accessToken: string) => {
            await userService.removeUser(userId, accessToken);
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
                <View
                    style={{
                        alignSelf: "stretch",
                        marginHorizontal: 20,
                        gap: 15,
                    }}
                >
                    <BlockView
                        onPress={() => {
                            console.log("이용약관 tapped");
                        }}
                    >
                        <Text
                            style={[styles.eachBoxTextStyle, { padding: 20 }]}
                        >
                            이용약관
                        </Text>
                    </BlockView>

                    <BlockView
                        onPress={() => {
                            navigation.navigate(
                                NavigationTitle.settingPassword,
                                { username, shouldPopAll: false }
                            );
                        }}
                    >
                        <Text
                            style={[styles.eachBoxTextStyle, { padding: 20 }]}
                        >
                            비밀번호 변경
                        </Text>
                    </BlockView>

                    {/* 로그아웃 */}
                    {/* TODO: 회원 정보, Token 초기화 */}
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
