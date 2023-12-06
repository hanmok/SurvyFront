import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../../utils/NavHelper";
import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native";

import { fontSizes } from "../../utils/sizes";
import TextButton from "../../components/TextButton";
import { isValidElement, useEffect, useState } from "react";
import { colors } from "../../utils/colors";
// import isValidEmail from "../../utils/EmailValidation";
import { isValidEmail } from "../../utils/validation";
import showToast from "../../components/common/toast/Toast";
import { screenWidth } from "../../utils/ScreenSize";
import {
    hasDuplicateUsername,
    checkValidationOfUsernamePhoneNumber,
} from "../../API/UserAPI";
import { useCustomContext } from "../../features/context/CustomContext";
import { logObject } from "../../utils/Log";
import showAdminToast from "../../components/common/toast/showAdminToast";

export default function FindPasswordScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.findID>;
}) {
    const [isPhoneAuthTapped, setIsPhoneAuthTapped] = useState(true);

    const [randomNumber, setRandomNumber] = useState("");

    const [phoneAuthSatisfied, setPhoneAuthSatisfied] = useState(false);

    const [mailAuthSatisfied, setMailAuthSatisfied] = useState(false);

    const [usernameInput, setUserNameInput] = useState("");
    const [phoneInput, setPhoneInput] = useState("");
    const [authCodeInput, setAuthCodeInput] = useState("");

    const [authCodeSatisfied, setAuthCodeSatisfied] = useState(false);

    // 아이디, 폰번호 형식이 모두 정상 -> 인증번호 받기 버튼 활성화 (phoneAuthSatisfied)
    // 인증번호 모두 입력 -> 확인 버튼 활성화 (authCodeSatisfied)

    useEffect(() => {
        setAuthCodeSatisfied(authCodeInput.length === 6);
    }, [authCodeInput]);

    const setAuthMethodToPhone = isPhoneAuth => {
        setIsPhoneAuthTapped(isPhoneAuth);
    };

    const { updateLoadingStatus } = useCustomContext();

    const handleUserDuplicate = async (username: string) => {
        updateLoadingStatus(true);
        console.log("mail input", username);
        await hasDuplicateUsername(username)
            .then(ret => {
                if (ret.statusCode >= 400) {
                    logObject("result", ret);
                    showToast("success", "인증 메일을 확인해주세요");
                } else {
                    showToast("error", "존재하지 않는 메일입니다");
                }
            })
            .catch(error => {
                showAdminToast("error", error.message);
            })
            .finally(() => {
                updateLoadingStatus(false);
            });
    };

    const handleUsernamePhoneValidation = async (
        username: string,
        phone: string
    ) => {
        const ret = await checkValidationOfUsernamePhoneNumber(username, phone);
        console.log(
            `handleUsernamePhoneValidation, username: ${username}, phone: ${phone}`
        );
        if (ret.statusCode < 300) {
            const randomNumber = generateSixDigitRandomNumber();
            showToast("success", `${randomNumber}`);
        } else {
            showToast("error", "아이디, 휴대폰번호가 일치하지 않습니다.");
        }
    };

    function generateSixDigitRandomNumber(): number {
        // 100000부터 999999까지의 랜덤 숫자를 생성
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        setRandomNumber(String(randomNumber));
        return randomNumber;
    }

    useEffect(() => {
        const valid = isValidEmail(usernameInput);
        setMailAuthSatisfied(valid);
    }, [usernameInput]);

    useEffect(() => {
        const validUsername = isValidEmail(usernameInput);
        const validPhone = phoneInput.length === 13;
        setPhoneAuthSatisfied(validUsername && validPhone);
    }, [usernameInput, phoneInput]);

    useEffect(() => {
        if (isValidEmail(usernameInput) && phoneInput.length == 13) {
            setPhoneAuthSatisfied(true);
        } else {
            setPhoneAuthSatisfied(false);
        }
    }, [usernameInput, phoneInput]);

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
            >
                <View style={[styles.authBackground, { marginLeft: 10 }]}>
                    <TextButton
                        title={"휴대폰 인증"}
                        onPress={() => {
                            setAuthMethodToPhone(true);
                        }}
                        backgroundStyle={{
                            marginBottom: 12,
                        }}
                        hasShadow={false}
                        textStyle={styles.authText}
                    />
                    <View
                        style={isPhoneAuthTapped && styles.selectedBar}
                    ></View>
                </View>
                <View style={[styles.authBackground, { marginRight: 10 }]}>
                    <TextButton
                        title={"이메일 인증"}
                        onPress={() => {
                            setAuthMethodToPhone(false);
                        }}
                        hasShadow={false}
                        textStyle={styles.authText}
                        backgroundStyle={{ marginBottom: 12 }}
                    />
                    <View
                        style={
                            isPhoneAuthTapped === false && styles.selectedBar
                        }
                    ></View>
                </View>
            </View>
            {/* name */}
            <View style={styles.nameContainer}>
                <Text style={[styles.guideText, { marginBottom: 14 }]}>
                    아이디
                </Text>
                <View // Text Input Box
                    style={styles.textInputBox}
                >
                    <TextInput
                        placeholder="아이디를 입력해주세요"
                        style={[styles.guideText, { paddingLeft: 8 }]}
                        value={usernameInput}
                        onChangeText={setUserNameInput}
                        autoComplete="off"
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                </View>
            </View>

            {isPhoneAuthTapped && (
                // {/* 휴대폰 번호 */}
                <View
                    style={{
                        marginHorizontal: 18,
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
                            title="인증번호 받기"
                            onPress={() => {
                                handleUsernamePhoneValidation(
                                    usernameInput,
                                    phoneInput
                                );
                                // checkValidationOfUsernamePhoneNumber(usernameInput, phoneInput)
                                // 먼저, 일치하는지 봐야함.
                                // 입력된 ID 와 휴대폰번호가.
                            }}
                            backgroundStyle={[
                                styles.authButtonBackground,
                                phoneAuthSatisfied
                                    ? styles.activatedBackground
                                    : styles.inactivatedBackground,
                            ]}
                            isEnabled={phoneAuthSatisfied}
                            hasShadow={false}
                            textStyle={[
                                { fontSize: 14 },
                                phoneAuthSatisfied
                                    ? { color: colors.white }
                                    : { color: colors.black },
                            ]}
                        />
                    </View>
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
                                { marginTop: 10, flex: 0.9 },
                            ]}
                        >
                            <TextInput
                                placeholder="인증번호를 입력해주세요"
                                style={[styles.guideText, { paddingLeft: 8 }]}
                                value={authCodeInput}
                                onChangeText={setAuthCodeInput}
                                keyboardType="phone-pad"
                                autoComplete="off"
                                autoCorrect={false}
                            />
                        </View>
                        <TextButton
                            title="재발송"
                            onPress={() => {
                                const randomNumber =
                                    generateSixDigitRandomNumber();
                                showToast("success", `${randomNumber}`);
                            }}
                            backgroundStyle={[
                                styles.authButtonBackground,
                                styles.inactivatedBackground,
                            ]}
                            // hasShadow={isSatisfied}
                            hasShadow={false}
                            textStyle={{ color: "black", fontSize: 14 }}
                        />
                    </View>
                </View>
            )}
            {isPhoneAuthTapped ? (
                <View style={{ marginHorizontal: 18 }}>
                    <TextButton
                        title="확인"
                        onPress={() => {
                            if (randomNumber === authCodeInput) {
                                showToast("success", "인증되었습니다.");

                                navigation.navigate(
                                    NavigationTitle.settingPassword,
                                    { username: usernameInput }
                                );
                            } else {
                                showToast(
                                    "error",
                                    "인증번호를 다시 확인해주세요."
                                );
                            }
                        }}
                        backgroundStyle={[
                            styles.authButtonBackground,
                            { marginTop: 20, width: screenWidth - 36 },
                            authCodeSatisfied
                                ? { backgroundColor: colors.deeperMainColor }
                                : styles.inactivatedBackground,
                        ]}
                        hasShadow={false}
                        textStyle={[
                            { fontSize: 14 },
                            authCodeSatisfied
                                ? { color: "white" }
                                : { color: "black" },
                        ]}
                    />
                </View>
            ) : (
                <TextButton
                    title="인증 메일 받기"
                    onPress={() => {
                        handleUserDuplicate(usernameInput);
                    }}
                    backgroundStyle={[
                        styles.authButtonBackground,
                        {
                            // marginTop: 20,
                            width: screenWidth - 36,
                            marginHorizontal: 18,
                        },
                        mailAuthSatisfied
                            ? styles.activatedBackground
                            : styles.inactivatedBackground,
                    ]}
                    hasShadow={phoneAuthSatisfied}
                    textStyle={{
                        fontSize: 14,
                        fontWeight: "800",
                        color: mailAuthSatisfied ? "white" : "black",
                    }}
                />
            )}
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
    unselectedBar: {},
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
    inactivatedBackground: {
        // backgroundColor: "#ddd",
        borderWidth: 1,
        borderColor: colors.gray4,
    },
    activatedBackground: {
        backgroundColor: colors.deepMainColor,
    },
    authButtonBackground: {
        // height: 50,
        height: 42,
        width: 110,
        // marginHorizontal: 18,
        borderRadius: 6,
    },
});
