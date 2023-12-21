import React from "react";
import { NavigationTitle, RootStackParamList } from "../../utils/NavHelper";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, View, Text } from "react-native";
import TextButton from "../../components/TextButton";
import { colors } from "../../utils/colors";
import { RouteProp } from "@react-navigation/native";

export default function FoundIDScreen({
    navigation,
    route,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.foundID
    >;
    route: RouteProp<RootStackParamList, NavigationTitle.foundID>;
}) {
    const { username } = route.params;

    return (
        <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View style={{ marginTop: 60, marginHorizontal: 18 }}>
                <Text style={{ fontSize: 18 }}>고객님의 계정을 찾았습니다</Text>
                <Text style={{ marginTop: 10 }}>{username}</Text>
            </View>
            <View>
                <TextButton
                    title="비밀번호 찾기"
                    onPress={() => {
                        navigation.navigate(NavigationTitle.findPassword);
                    }}
                    backgroundStyle={[
                        styles.buttonBackground,
                        {
                            marginBottom: 20,
                            backgroundColor: colors.white,
                        },
                    ]}
                    textStyle={{ fontSize: 16 }}
                />
                <TextButton
                    title="로그인"
                    onPress={() => {
                        navigation.navigate(NavigationTitle.login);
                    }}
                    backgroundStyle={[
                        styles.buttonBackground,
                        {
                            marginBottom: 60,
                            backgroundColor: colors.deeperMainColor,
                        },
                    ]}
                    textStyle={styles.loginBtnText}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonBackground: {
        marginHorizontal: 18,
        borderRadius: 6,
        height: 45,
    },
    loginBtnText: {
        fontSize: 16,
        color: colors.white,
    },
});
