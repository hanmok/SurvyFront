import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../utils/NavHelper";
import { NavigationTitle } from "../../utils/NavHelper";

import { View, Text } from "react-native";
import BlockView from "../../components/BlockView";
import { fontSizes, marginSizes } from "../../utils/sizes";
import { screenWidth } from "../../utils/ScreenSize";
import { useEffect, useState } from "react";
import { getUserGenres } from "../../API/UserAPI";
import { useCustomContext } from "../../features/context/CustomContext";
import { Genre } from "../../interfaces/Genre";
import { colors } from "../../utils/colors";
import { GeoInfo } from "../../interfaces/GeoInfo";
import Spacer from "../../components/common/Spacer";

// 내 정보
function MyInfoScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.myinfo>;
}) {
    const moveToCategory = () => {
        navigation.navigate(NavigationTitle.myGenre);
    };
    const [myGenres, setMyGenres] = useState<Genre[]>([]);

    const { accessToken, userId, userDetail } = useCustomContext();

    useEffect(() => {
        const getMyGenres = async () => {
            getUserGenres(accessToken, userId).then(response => {
                setMyGenres(response);
            });
        };
        getMyGenres();
    }, []);

    return (
        <View
            style={{
                marginHorizontal: marginSizes.l20,
                gap: 20,
                marginTop: marginSizes.xxl28,
            }}
        >
            <BlockView size={50}>
                <View
                    style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        paddingRight: 20,
                    }}
                >
                    <Text style={{ fontSize: 18 }}>성별 / 생년월일</Text>
                    <Text style={{ fontSize: 16 }}>남성 / 1992 07 21</Text>
                </View>
            </BlockView>
            <BlockView
                size={50}
                onPress={() => {
                    console.log("hi");
                    // navigation.navigate(NavigationTitle.myGenre);
                    moveToCategory();
                }}
            >
                <View
                    style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        paddingRight: 20,
                    }}
                >
                    <Text style={{ fontSize: 18 }}>관심사</Text>
                    <Text style={{ fontSize: 16 }}>
                        {myGenres.map(genre => genre.name).join(", ")}
                    </Text>
                </View>
            </BlockView>

            {/* 추가 정보 */}
            {/* Divider */}
            {/* <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                }}
            > */}
            <View style={{ marginTop: 20 }}>
                <View
                    style={{
                        height: 2,
                        backgroundColor: colors.gray4,
                        width: screenWidth - 40,
                        alignSelf: "center",
                    }}
                />
                <Spacer size={5} />
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            color: "red",
                            marginLeft: 10,
                            marginRight: 4,
                            // marginTop: -3
                        }}
                    >
                        *
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                        추가정보 입력시 유료설문의 기회가 많아집니다.
                    </Text>
                </View>
            </View>

            {/* 거주지 */}
            <BlockView
                size={50}
                onPress={() => {
                    console.log("hi");
                    // navigation.navigate(NavigationTitle.myGenre);
                }}
            >
                <View
                    style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        paddingRight: 20,
                    }}
                >
                    {/* home_address */}
                    {/* office_address */}
                    <Text style={{ fontSize: 18 }}>거주지</Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: userDetail?.homeAddress
                                ? "black"
                                : colors.gray3,
                        }}
                    >
                        {userDetail?.homeAddress?.city}
                    </Text>
                </View>
            </BlockView>
            {/* 근무지 */}
            <BlockView
                size={50}
                onPress={() => {
                    console.log("hi");
                    // navigation.navigate(NavigationTitle.myGenre);
                    // moveToCategory();
                }}
            >
                <View
                    style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        paddingRight: 20,
                    }}
                >
                    {/* home_address */}
                    {/* office_address */}
                    <Text style={{ fontSize: 18 }}>근무지</Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: userDetail?.officeAddress
                                ? "black"
                                : colors.gray3,
                        }}
                    >
                        {userDetail?.officeAddress?.city}
                    </Text>
                </View>
            </BlockView>

            <BlockView
                size={50}
                onPress={() => {
                    console.log("hi");
                    // set Occupation
                }}
            >
                <View
                    style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        paddingRight: 20,
                    }}
                >
                    <Text style={{ fontSize: 18 }}>직업</Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: userDetail?.occupation
                                ? "black"
                                : colors.gray3,
                        }}
                    >
                        {userDetail?.occupation?.name ?? "직업 선택"}
                    </Text>
                </View>
            </BlockView>
        </View>
    );
}

export default MyInfoScreen;
