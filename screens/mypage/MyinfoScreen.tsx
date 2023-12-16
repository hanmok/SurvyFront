import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../utils/NavHelper";
import { NavigationTitle } from "../../utils/NavHelper";

import { View, Text } from "react-native";
import BlockView from "../../components/BlockView";
import { fontSizes, marginSizes } from "../../utils/sizes";
import { screenWidth } from "../../utils/ScreenSize";
import { useEffect, useState } from "react";
// import {
//     getUserDetail,
//     getUserGenres,
//     updateHomeAddress,
//     updateOfficeAddress,
// } from "../../API/UserAPI";
import { useCustomContext } from "../../features/context/CustomContext";
import { Genre } from "../../interfaces/Genre";
import { colors } from "../../utils/colors";
import { GeoInfo } from "../../interfaces/GeoInfo";
import Spacer from "../../components/common/Spacer";
import TextButton from "../../components/TextButton";
import GeoSingleSelectionModal from "../../modals/GeoSingleSelectionModal";
import showMessageAlert from "../../components/CustomAlert";
import showToast from "../../components/common/toast/Toast";
import { UserService } from "../../API/Services/UserService";
import { convertBirthDate } from "../../utils/DateFormatter";

// 내 정보
function MyInfoScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.myinfo>;
}) {
    // single.. dma... 거주지, 근무지 나눠야함.
    const userService = new UserService();
    const [myGenres, setMyGenres] = useState<Genre[]>([]);
    const [homeAddress, setHomeAddress] = useState<GeoInfo | null>(null);
    const [officeAddress, setOfficeAddress] = useState<GeoInfo | null>(null);
    const {
        accessToken,
        userId,
        userDetail,
        updateUserDetail,
        updateLoadingStatus,
    } = useCustomContext();

    const gender = (): string => {
        if (userDetail.isMale === 0) {
            return "여성";
        } else if (userDetail.isMale === 1) {
            return "남성";
        } else {
            return "";
        }
    };

    const birthDate = (): string => {
        if (userDetail.birthDate) {
            return convertBirthDate(userDetail.birthDate);
        } else {
            return "";
        }
    };
    const [isHomeModalVisible, setHomeModalVisible] = useState(false);
    const [isOfficeModalVisible, setOfficeModalVisible] = useState(false);

    const moveToCategory = () => {
        navigation.navigate(NavigationTitle.myGenre);
    };

    // 처음 로딩 시, 호출되면 안됨 (null, userDetail?.homeAddress 와 같은 값일 때. )
    // 지우고 싶으면?

    // useEffect(() => {
    //     if (homeAddress && homeAddress !== userDetail?.homeAddress) {
    //     }
    // }, [homeAddress]);

    useEffect(() => {}, [officeAddress]);

    useEffect(() => {
        setHomeAddress(userDetail?.homeAddress);
        setOfficeAddress(userDetail?.officeAddress);
    }, [userDetail]);

    useEffect(() => {
        const getMyGenres = async () => {
            updateLoadingStatus(true);
            userService.getUserGenres(accessToken, userId).then(response => {
                setMyGenres(response.data);
                updateLoadingStatus(false);
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
            <GeoSingleSelectionModal
                onClose={() => {
                    setHomeModalVisible(false);
                }}
                initialGeo={homeAddress}
                confirmGeoSelection={async (geo: GeoInfo | null) => {
                    setHomeAddress(geo);
                    updateLoadingStatus(true);
                    await userService.updateHomeAddress(
                        userId,
                        geo?.id ?? null
                    );
                    const userDetail = await userService.getUserDetail(
                        accessToken
                    );
                    updateUserDetail(userDetail.data);
                    showToast("success", "거주지가 변경되었습니다.");
                    updateLoadingStatus(false);
                }}
                isHome={true}
                isGeoModalVisible={isHomeModalVisible}
            />

            <GeoSingleSelectionModal
                onClose={() => {
                    setOfficeModalVisible(false);
                }}
                initialGeo={officeAddress}
                confirmGeoSelection={async (geo: GeoInfo | null) => {
                    setOfficeAddress(geo);
                    updateLoadingStatus(true);
                    await userService.updateOfficeAddress(userId, geo?.id);
                    const userDetail = await userService.getUserDetail(
                        accessToken
                    );
                    updateUserDetail(userDetail.data);
                    updateLoadingStatus(false);
                    showToast("success", "근무지가 변경되었습니다.");
                }}
                isHome={false}
                isGeoModalVisible={isOfficeModalVisible}
            />

            <BlockView size={50}>
                <View
                    style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        paddingRight: 20,
                    }}
                >
                    {/* <Text></Text> */}
                    <Text style={{ fontSize: 18 }}>성별 · 생년월일</Text>
                    <Text style={{ fontSize: 16 }}>
                        {gender()} · {birthDate()}
                    </Text>
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
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: 18 }}>관심사</Text>
                    {/* {myGenres.map(genre => {
                        <Text>{genre.name}</Text>;
                    })} */}

                    <View
                        style={{
                            // width: screenWidth - 80,
                            // alignItems: "flex-start",
                            flexDirection: "row",
                            // justifyContent: "flex-start",
                            // justifyContent: "flex-end",
                            // backgroundColor: "magenta",
                            flexWrap: "wrap",
                            // marginTop: 10,
                            // alignSelf: "flex-start",
                        }}
                    >
                        {myGenres.map(genre => (
                            <TextButton
                                title={genre.name}
                                onPress={() => {}}
                                backgroundStyle={{
                                    // backgroundColor: colors.gray1,
                                    backgroundColor: colors.gray5,
                                    padding: 4,
                                    paddingHorizontal: 6,
                                    marginLeft: 8,
                                    borderRadius: 6,
                                    height: 30,
                                    // marginVertical: 4,
                                }}
                                hasShadow={false}
                                key={`${genre.id}`}
                                textStyle={{
                                    color: colors.black,
                                }}
                            />
                        ))}
                    </View>

                    {/* <Text style={{ fontSize: 16 }}> */}
                    {/* {myGenres.map(genre => genre.name).join(", ")} */}

                    {/* </Text> */}
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
                    setHomeModalVisible(true);
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
                    <Text style={{ fontSize: 18 }}>거주지</Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: homeAddress ? "black" : colors.gray3,
                        }}
                    >
                        {homeAddress?.state} {homeAddress?.city ?? "선택 안함"}
                    </Text>
                </View>
            </BlockView>
            {/* 근무지 */}
            <BlockView
                size={50}
                onPress={() => {
                    console.log("hi");
                    setOfficeModalVisible(true);
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
                            color: officeAddress ? "black" : colors.gray3,
                        }}
                    >
                        {officeAddress?.state}{" "}
                        {officeAddress?.city ?? "선택 안함"}
                    </Text>
                </View>
            </BlockView>
            {/* Occupation (직업) */}
            {/* <BlockView
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
            </BlockView> */}
        </View>
    );
}

export default MyInfoScreen;

// 'user', 'CREATE TABLE `user` (\n  `id` int(11) NOT NULL AUTO_INCREMENT,\n  `password` varchar(200) DEFAULT NULL,\n  `collected_reward` int(11) DEFAULT \'0\',\n  `fatigue` int(11) NOT NULL DEFAULT \'0\',\n  `birth_date` date DEFAULT NULL,\n  `nickname` varchar(100) DEFAULT NULL,\n  `is_male` tinyint(4) DEFAULT NULL,\n  `registered_at` datetime DEFAULT CURRENT_TIMESTAMP,\n  `device_token` text,\n  `username` varchar(30) DEFAULT NULL,\n  `reputation` int(11) DEFAULT \'0\',\n  `age` int(11) DEFAULT NULL,\n  `home_address` int(11) DEFAULT NULL,\n  `office_address` int(11) DEFAULT NULL,\n  `occupation` int(11) DEFAULT NULL,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `nickname` (`nickname`),\n  UNIQUE KEY `username` (`username`)\n) ENGINE=InnoDB AUTO_INCREMENT=854 DEFAULT CHARSET=utf8'
