import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackParamList";
import { NavigationTitle } from "../utils/NavigationTitle";
import { View, Text } from "react-native";
import BlockView from "../components/BlockView";
import { ReactNode } from "react";
import TextButton from "../components/TextButton";
import { colors } from "../utils/colors";

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
                    {blockContainer({ text: "닉네임 변경" })}
                    {blockContainer({ text: "이용약관" })}
                    {blockContainer({ text: "로그아웃" })}
                </View>
                <View style={{ height: 300 }}></View>
                <View style={{ alignItems: "center" }}>
                    <TextButton
                        title="회원 탈퇴"
                        onPress={handleResign}
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
