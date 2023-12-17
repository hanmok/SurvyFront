import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../../utils/NavHelper";
import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontSizes } from "../../utils/sizes";
import TextButton from "../../components/TextButton";
import { useEffect, useState } from "react";
import { buttonColors, colors } from "../../utils/colors";
import { screenWidth } from "../../utils/ScreenSize";
import showToast from "../../components/common/toast/Toast";
import { isValidPhone } from "../../utils/validation";
import { useCustomContext } from "../../features/context/CustomContext";
// import { checkPhoneDuplicate } from "../../API/UserAPI";
import { logObject } from "../../utils/Log";
import showAdminToast from "../../components/common/toast/showAdminToast";
import { UserService } from "../../API/Services/UserService";

export default function FindIDScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.findID>;
}) {
    const userService = new UserService();

    const [phoneNumberSatisfied, setPhoneNumberSatisfied] = useState(false);
    const [authSatisfied, setAuthSatisfied] = useState(false);

    const [phoneInput, setPhoneInput] = useState("");
    const [authInput, setAuthInput] = useState("");

    const [phoneSendingCodeButtonTapped, setPhoneSendingCodeButtonTapped] =
        useState(false);

    const [phoneSendingAuthButtonText, setPhoneSendingAuthButtonText] =
        useState("인증번호 받기");

    useEffect(() => {
        if (phoneSendingCodeButtonTapped) {
            setPhoneSendingAuthButtonText("재발송");
        } else {
            setPhoneSendingAuthButtonText("인증번호 받기");
        }
    }, [phoneSendingCodeButtonTapped]);

    useEffect(() => {
        setAuthSatisfied(authInput.length === 6);
    }, [authInput]);

    useEffect(() => {
        setPhoneNumberSatisfied(phoneInput.length === 13);
    }, [phoneInput]);

    const { updateLoadingStatus } = useCustomContext();

    const handlePhoneDuplicate = async (phone: string) => {
        if (isValidPhone(phone)) {
            updateLoadingStatus(true);

            await userService
                .checkPhoneDuplicate(phoneInput)
                .then(ret => {
                    if (ret.statusCode >= 400) {
                        // some has this phone number
                        logObject("result", ret);
                        showToast("success", "인증번호가 전송되었습니다.");
                    } else {
                        showToast(
                            "error",
                            "해당 번호로 가입된 계정이 없습니다."
                        );
                    }
                })
                .catch(error => {
                    showAdminToast("error", error.message);
                })
                .finally(() => {
                    updateLoadingStatus(false);
                });
        } else {
            showAdminToast("error", "Phone Error .");
        }
    };

    useEffect(() => {
        if (phoneInput.length === 4 && phoneInput.includes("-") === false) {
            const dashIndex = 3;
            const modified =
                phoneInput.slice(0, dashIndex) +
                "-" +
                phoneInput.slice(dashIndex);
            setPhoneInput(modified);
            // dash 가 하나일 때 입력 하나 더 들어옴
        } else if (
            phoneInput.length === 4 &&
            phoneInput.includes("-") === true
        ) {
            const modified = phoneInput.slice(0, 3);
            setPhoneInput(modified);
        } else if (
            phoneInput.length === 9 &&
            phoneInput.lastIndexOf("-") === 3
        ) {
            const newDashIndex = 8;
            const modified =
                phoneInput.slice(0, newDashIndex) +
                "-" +
                phoneInput.slice(newDashIndex);
            setPhoneInput(modified);
        } else if (
            phoneInput.length === 9 &&
            phoneInput.lastIndexOf("-") === 8
        ) {
            const modified = phoneInput.slice(0, 8);
            setPhoneInput(modified);
        } else if (phoneInput.length === 13) {
            Keyboard.dismiss();
        }
    }, [phoneInput]);

    return (
        <View style={styles.overall}>
            {/* Auth Method Bar*/}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            ></View>

            <View
                style={{
                    marginHorizontal: 18,
                    marginBottom: 26,
                    marginTop: 12,
                }}
            >
                <Text style={[styles.guideText, { marginBottom: 14 }]}>
                    휴대폰 번호
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        // backgroundColor: "magenta",
                    }}
                >
                    <View // Text Input Box
                        style={[styles.textInputBox, { flex: 0.9 }]}
                    >
                        <TextInput
                            placeholder="휴대폰번호를 입력해주세요"
                            style={[styles.guideText, { paddingLeft: 8 }]}
                            value={phoneInput}
                            onChangeText={setPhoneInput}
                            keyboardType="phone-pad"
                            autoComplete="off"
                            autoCorrect={false}
                        />
                    </View>

                    <TextButton
                        title={phoneSendingAuthButtonText}
                        onPress={() => {
                            setPhoneSendingCodeButtonTapped(true);
                            handlePhoneDuplicate(phoneInput);
                        }}
                        backgroundStyle={[
                            styles.authButtonBackground,
                            phoneNumberSatisfied
                                ? styles.activatedBackground
                                : styles.inactivatedBorder,
                        ]}
                        hasShadow={false}
                        textStyle={[
                            { fontSize: 14 },
                            phoneNumberSatisfied
                                ? { color: colors.white }
                                : { color: colors.gray2 },
                        ]}
                    />
                </View>
                {/* <View
                    style={{
                        backgroundColor: "magenta",
                        width: 10,
                        height: 10,
                    }}
                ></View> */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        // backgroundColor: "magenta",
                    }}
                >
                    <View // Text Input Box
                        style={[
                            styles.textInputBox,
                            { marginTop: 10, flex: 1.0 },
                        ]}
                    >
                        <TextInput
                            placeholder="인증번호를 입력해주세요"
                            style={[styles.guideText, { paddingLeft: 8 }]}
                            value={authInput}
                            onChangeText={setAuthInput}
                            keyboardType="phone-pad"
                            autoComplete="off"
                            autoCorrect={false}
                        />
                    </View>
                    {/* <TextButton
                        title=""
                        onPress={() => {
                            handlePhoneDuplicate(phoneInput);
                        }}
                        backgroundStyle={[
                            styles.authButtonBackground,
                            styles.inactivatedBorder,
                        ]}
                        hasShadow={false}
                        textStyle={{ color: "black", fontSize: 14 }}
                    /> */}
                </View>
                <View>
                    <TextButton
                        title="확인"
                        onPress={() => {
                            navigation.navigate(NavigationTitle.foundID);
                        }}
                        backgroundStyle={[
                            styles.authButtonBackground,
                            {
                                marginTop: 20,
                                width: screenWidth - 36,
                                backgroundColor: authSatisfied
                                    ? buttonColors.enabledButtonBG
                                    : buttonColors.disabledButtonBG,
                            },
                            authSatisfied ? {} : styles.inactivatedBorder,
                        ]}
                        hasShadow={false}
                        textStyle={[
                            { fontSize: 14, color: "white" },
                            // authSatisfied
                            //     ? { color: "white" }
                            //     : { color: "black" },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    authBackground: {
        flex: 0.5,
        textAlign: "center",
        marginVertical: 10,
        flexDirection: "column",
    },
    authText: {
        fontSize: fontSizes.m20,
    },
    overall: {
        flex: 1,
    },
    selectedBar: {
        backgroundColor: "black",
        height: 2,
        alignSelf: "stretch",
    },

    guideText: {
        fontSize: fontSizes.s16,
    },
    textInputBox: {
        height: 42,
        backgroundColor: colors.white,
        justifyContent: "center",
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 6,
    },
    nameContainer: {
        marginTop: 30,
        marginBottom: 30,
        marginHorizontal: 18,
    },
    inactivatedBorder: {
        borderWidth: 1,
        borderColor: colors.gray4,
    },
    activatedBackground: {
        backgroundColor: buttonColors.enabledButtonBG,
    },
    authButtonBackground: {
        // height: 50,
        height: 42,
        // marginHorizontal: 18,
        // marginRight: 12,
        borderRadius: 6,
        paddingHorizontal: 12,
        width: 110,
    },
});
