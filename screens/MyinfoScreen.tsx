import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/NavHelper";
import { NavigationTitle } from "../utils/NavHelper";

import { View, Text } from "react-native";
import BlockView from "../components/BlockView";
import { fontSizes, marginSizes } from "../utils/sizes";
function MyinfoScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.myinfo>;
}) {
    return (
        <View
            style={{
                marginHorizontal: marginSizes.l20,
                gap: 20,
                marginTop: marginSizes.xxl28,
            }}
        >
            <BlockView>
                <Text style={{ fontSize: fontSizes.m20 }}>닉네임</Text>
            </BlockView>
            <BlockView>
                <Text style={{ fontSize: fontSizes.m20 }}>기본 정보</Text>
            </BlockView>
            <BlockView onPress={() => console.log("hi")}>
                <Text style={{ fontSize: fontSizes.m20 }}>관심사</Text>
            </BlockView>

            <View></View>
        </View>
    );
}

export default MyinfoScreen;
