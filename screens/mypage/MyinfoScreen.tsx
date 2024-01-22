import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../utils/NavHelper";
import { NavigationTitle } from "../../utils/NavHelper";
import { View, Text, StyleSheet } from "react-native";
import BlockView from "../../components/BlockView";
import { marginSizes } from "../../utils/sizes";
import { screenWidth } from "../../utils/ScreenSize";
import { useEffect, useState } from "react";
import { useCustomContext } from "../../features/context/CustomContext";
import { Genre } from "../../interfaces/Genre";
import { colors } from "../../utils/colors";
import { GeoInfo } from "../../interfaces/GeoInfo";
import Spacer from "../../components/common/Spacer";
import TextButton from "../../components/TextButton";
import GeoSingleSelectionModal from "../../modals/GeoSingleSelectionModal";
import showToast from "../../components/common/toast/Toast";
import { UserService } from "../../API/Services/UserService";
import { convertBirthDate } from "../../utils/DateFormatter";
import showAdminToast from "../../components/common/toast/showAdminToast";

// 내 정보
function MyinfoScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.myinfo>;
}) {
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
        if (userDetail?.isMale === 0) {
            return "여성";
        } else if (userDetail?.isMale === 1) {
            return "남성";
        } else {
            return "";
        }
    };

    const birthDate = (): string => {
        if (userDetail?.birthDate) {
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

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                updateLoadingStatus(true);
                await userService
                    .getUserGenres(accessToken, userId)
                    .then(response => {
                        setMyGenres(response.data);
                        updateLoadingStatus(false);
                    });
            } catch (error) {
                showAdminToast("error", error.message);
                console.error(error);
            }
        };

        const unsubscribeFocus = navigation.addListener("focus", () => {
            fetchGenres();
        });

        return unsubscribeFocus;
    }, [navigation]);

    return (
        <View style={styles.overall}>
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
                {/* TODO: Pass 인증으로 넘어가기 */}
                <View style={styles.rowContainer}>
                    <Text style={{ fontSize: 18 }}>성별 · 생년월일</Text>
                    <Text style={{ fontSize: 16 }}>
                        {gender()} · {birthDate()}
                    </Text>
                </View>
            </BlockView>

            {/* 관심사 */}
            <BlockView size={50} onPress={moveToCategory}>
                <View style={styles.rowContainer}>
                    <View
                        style={{
                            justifyContent: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                textAlignVertical: "center",
                            }}
                        >
                            관심사
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                        }}
                    >
                        {myGenres.map(genre => (
                            <TextButton
                                title={genre.name}
                                onPress={() => {}}
                                backgroundStyle={{
                                    backgroundColor: colors.gray5,
                                    padding: 4,
                                    paddingHorizontal: 6,
                                    marginLeft: 8,
                                    borderRadius: 6,
                                    height: 30,
                                }}
                                hasShadow={false}
                                key={`${genre.id}`}
                                textStyle={{
                                    color: colors.black,
                                }}
                            />
                        ))}
                    </View>
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
                <View style={styles.divider} />
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
                <View style={styles.rowContainer}>
                    {/* home_address */}
                    <Text style={{ fontSize: 18 }}>거주지</Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: homeAddress ? colors.black : colors.gray3,
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
                <View style={styles.rowContainer}>
                    {/* home_address */}
                    {/* office_address */}
                    <Text style={{ fontSize: 18 }}>근무지</Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: officeAddress ? colors.black : colors.gray3,
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
                                ? colors.black
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

export default MyinfoScreen;

const styles = StyleSheet.create({
    overall: {
        marginHorizontal: marginSizes.l20,
        gap: 20,
        marginTop: marginSizes.xxl28,
    },
    rowContainer: {
        justifyContent: "space-between",
        flexDirection: "row",
        paddingRight: 20,
    },
    divider: {
        height: 2,
        backgroundColor: colors.gray4,
        width: screenWidth - 40,
        alignSelf: "center",
    },
});
