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
    sendEmailAuthCode,
    sendSMSAuthCode,
    verifyEmailAuth,
    verifySMSAuth,
} from "../../API/UserAPI";
import { useCustomContext } from "../../features/context/CustomContext";
import { logObject } from "../../utils/Log";
import showAdminToast from "../../components/common/toast/showAdminToast";
import TextInputContainerView from "../../components/TextInputContainer";

export default function FindPasswordScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.findID>;
}) {
    const [usingPhone, setUsingPhone] = useState(true);

    const [phoneSendingCodeButtonTapped, setPhoneSendingCodeButtonTapped] =
        useState(false);
    const [mailSendingCodeButtonTapped, setMailSendingCodeButtonTapped] =
        useState(false);

    const [phoneLengthSatisfied, setPhoneLengthSatisfied] = useState(false);
    const [mailValidationSatisfied, setMailValidationSatisfied] =
        useState(false);

    const [usernameInput, setUserNameInput] = useState("");
    const [phoneInput, setPhoneInput] = useState("");

    const [phoneAuthCodeInput, setPhoneAuthCodeInput] = useState("");
    const [mailAuthCodeInput, setMailAuthCodeInput] = useState("");

    const [phoneAuthCodeSatisfied, setPhoneAuthCodeSatisfied] = useState(false);
    const [mailAuthCodeSatisfied, setMailAuthCodeSatisfied] = useState(false);

    const [allPhoneConditionSatisfied, setAllPhoneConditionSatisfied] =
        useState(false);
    const [allMailConditionSatisfied, setAllMailConditionSatisfied] =
        useState(false);

    useEffect(() => {
        setAllMailConditionSatisfied(
            mailAuthCodeSatisfied && mailSendingCodeButtonTapped
        );
    }, [mailAuthCodeSatisfied, mailSendingCodeButtonTapped]);

    useEffect(() => {
        setAllPhoneConditionSatisfied(
            phoneAuthCodeSatisfied &&
                phoneLengthSatisfied &&
                mailValidationSatisfied &&
                phoneSendingCodeButtonTapped
        );
    }, [
        phoneAuthCodeSatisfied,
        phoneLengthSatisfied,
        mailValidationSatisfied,
        phoneSendingCodeButtonTapped,
    ]);

    const [phoneSendingAuthButtonText, setPhoneSendingAuthButtonText] =
        useState("인증번호 받기");

    const { updateLoadingStatus } = useCustomContext();

    useEffect(() => {
        if (phoneSendingCodeButtonTapped) {
            setPhoneSendingAuthButtonText("재발송");
        } else {
            setPhoneSendingAuthButtonText("인증번호 받기");
        }
    }, [phoneSendingCodeButtonTapped]);

    useEffect(() => {
        setPhoneSendingCodeButtonTapped(false);
    }, []);

    // 아이디, 폰번호 형식이 모두 정상 -> 인증번호 받기 버튼 활성화 (phoneAuthSatisfied)
    // 인증번호 모두 입력 -> 확인 버튼 활성화 (authCodeSatisfied)

    useEffect(() => {
        setPhoneAuthCodeSatisfied(phoneAuthCodeInput.length === 6);
    }, [phoneAuthCodeInput]);

    useEffect(() => {
        setMailAuthCodeSatisfied(mailAuthCodeInput.length === 6);
    }, [mailAuthCodeInput]);

    useEffect(() => {
        setMailValidationSatisfied(isValidEmail(usernameInput));
    }, [usernameInput]);

    const handleSendingEmailAuthCode = async (username: string) => {
        setMailSendingCodeButtonTapped(true);
        updateLoadingStatus(true);
        console.log("mail input", username);
        try {
            const ret = await hasDuplicateUsername(username);
            if (ret.statusCode >= 400) {
                logObject("result", ret);
                await sendEmailAuthCode(username);
                showToast("success", "인증 메일을 확인해주세요.");
            }
        } catch (error) {
            showAdminToast("error", error.message);
        } finally {
            updateLoadingStatus(false);
        }
    };

    const handleSendingSMSAuthCode = async (
        username: string,
        phone: string
    ) => {
        updateLoadingStatus(true);
        try {
            const validationCheck = await handleUsernamePhoneValidation(
                username,
                phone
            );
            if (validationCheck) {
                const ret = await sendSMSAuthCode(username, phone);
                if (ret.statusCode < 300) {
                    showToast("success", "SMS 가 전송되었습니다.");
                } else {
                    showToast("error", "SMS 전송에 실패하였습니다.");
                }
            }
        } catch (error) {
            showAdminToast("error", error);
        } finally {
            updateLoadingStatus(false);
        }
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
            return true;
        } else {
            showToast("error", "아이디, 휴대폰번호가 일치하지 않습니다.");
            return false;
        }
    };

    const handleVerifyingSMSAuth = async (username: string, code: string) => {
        updateLoadingStatus(true);
        const res = await verifySMSAuth(username, code);
        if (res.statusCode < 300) {
            // 비밀번호 재설정
            navigation.navigate(NavigationTitle.settingPassword, {
                username,
                shouldPopAll: true,
            });
        } else {
            showToast("success", "인증번호를 다시 확인해주세요.");
        }
        updateLoadingStatus(false);
    };

    const handleVerifyingEmailAuth = async (username: string, code: string) => {
        updateLoadingStatus(true);
        const res = await verifyEmailAuth(username, code);
        if (res.statusCode < 300) {
            // 비밀번호 재설정
            navigation.navigate(NavigationTitle.settingPassword, {
                username,
                shouldPopAll: true,
            });
        } else {
            showToast("success", "인증번호를 다시 확인해주세요.");
        }
        updateLoadingStatus(false);
    };

    useEffect(() => {
        const validUsername = isValidEmail(usernameInput);
        const validPhone = phoneInput.length === 13;
        setPhoneLengthSatisfied(validUsername && validPhone);
    }, [usernameInput, phoneInput]);

    useEffect(() => {
        if (isValidEmail(usernameInput) && phoneInput.length == 13) {
            setPhoneLengthSatisfied(true);
        } else {
            setPhoneLengthSatisfied(false);
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
            <View style={styles.rowContainer}>
                <View style={[styles.authBackground, { marginLeft: 10 }]}>
                    <TextButton
                        title={"휴대폰 인증"}
                        onPress={() => {
                            setUsingPhone(true);
                        }}
                        backgroundStyle={{
                            marginBottom: 12,
                        }}
                        hasShadow={false}
                        textStyle={styles.authText}
                    />
                    <View style={usingPhone && styles.selectedBar}></View>
                </View>
                <View style={[styles.authBackground, { marginRight: 10 }]}>
                    <TextButton
                        title={"이메일 인증"}
                        onPress={() => {
                            setUsingPhone(false);
                        }}
                        hasShadow={false}
                        textStyle={styles.authText}
                        backgroundStyle={{ marginBottom: 12 }}
                    />
                    <View
                        style={usingPhone === false && styles.selectedBar}
                    ></View>
                </View>
            </View>
            {/* username */}
            <View style={styles.nameMargins}>
                <Text style={[styles.guideTextFont, { marginBottom: 14 }]}>
                    아이디
                </Text>
                <TextInputContainerView>
                    <TextInput
                        placeholder="아이디를 입력해주세요"
                        style={[styles.guideTextFont, { paddingLeft: 8 }]}
                        value={usernameInput}
                        onChangeText={setUserNameInput}
                        autoComplete="off"
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                </TextInputContainerView>
            </View>

            {usingPhone ? (
                // 휴대폰 인증
                <View style={{ marginHorizontal: 18 }}>
                    <View>
                        <Text
                            style={[styles.guideTextFont, { marginBottom: 14 }]}
                        >
                            휴대폰 번호
                        </Text>

                        <View style={styles.rowContainer}>
                            <TextInputContainerView style={{ flex: 0.9 }}>
                                <TextInput
                                    placeholder="휴대폰번호를 입력해주세요"
                                    style={styles.textInput}
                                    value={phoneInput}
                                    onChangeText={setPhoneInput}
                                    keyboardType="phone-pad"
                                    autoComplete="off"
                                    autoCorrect={false}
                                />
                            </TextInputContainerView>

                            <TextButton
                                title={phoneSendingAuthButtonText}
                                onPress={() => {
                                    setPhoneSendingCodeButtonTapped(true);
                                    handleSendingSMSAuthCode(
                                        usernameInput,
                                        phoneInput
                                    );
                                }}
                                backgroundStyle={[
                                    styles.authButtonBackground,
                                    phoneLengthSatisfied
                                        ? styles.activatedBackground
                                        : styles.inactivatedBackground,
                                ]}
                                isEnabled={phoneLengthSatisfied}
                                hasShadow={false}
                                textStyle={[
                                    {
                                        fontSize: 14,
                                        color: phoneLengthSatisfied
                                            ? "white"
                                            : "gray",
                                    },
                                ]}
                            />
                        </View>
                        <View style={styles.rowContainer}>
                            <TextInputContainerView
                                style={{ marginTop: 10, flex: 1 }}
                            >
                                <TextInput
                                    placeholder="인증번호를 입력해주세요"
                                    style={styles.textInput}
                                    value={phoneAuthCodeInput}
                                    onChangeText={setPhoneAuthCodeInput}
                                    keyboardType="phone-pad"
                                    autoComplete="off"
                                    autoCorrect={false}
                                />
                            </TextInputContainerView>
                        </View>
                    </View>

                    <View>
                        <TextButton
                            title="확인"
                            onPress={() => {
                                handleVerifyingSMSAuth(
                                    usernameInput,
                                    phoneAuthCodeInput
                                );
                            }}
                            backgroundStyle={[
                                styles.confirmButtonBG,
                                allPhoneConditionSatisfied
                                    ? styles.activatedBackground
                                    : styles.inactivatedBackground,
                            ]}
                            isEnabled={allPhoneConditionSatisfied}
                            hasShadow={false}
                            textStyle={[
                                {
                                    fontSize: 14,
                                    color: allPhoneConditionSatisfied
                                        ? "white"
                                        : "gray",
                                },
                            ]}
                        />
                    </View>
                </View>
            ) : (
                // Mail Auth
                <View style={{ marginTop: -20, marginHorizontal: 18 }}>
                    <View>
                        <TextButton
                            title="인증 메일 받기"
                            onPress={() => {
                                handleSendingEmailAuthCode(usernameInput);
                            }}
                            backgroundStyle={[
                                styles.sendingAuthMailBG,
                                mailValidationSatisfied
                                    ? styles.activatedBackground
                                    : styles.inactivatedBackground,
                            ]}
                            hasShadow={phoneLengthSatisfied}
                            isEnabled={mailValidationSatisfied}
                            textStyle={{
                                fontSize: 14,
                                color: mailValidationSatisfied
                                    ? "white"
                                    : "gray",
                            }}
                        />
                        <View
                            style={[
                                styles.rowContainer,
                                {
                                    marginTop: 10,
                                },
                            ]}
                        >
                            <TextInputContainerView
                                style={{ flex: 1, marginTop: 20 }}
                            >
                                <TextInput
                                    placeholder="인증번호를 입력해주세요"
                                    style={styles.textInput}
                                    value={mailAuthCodeInput}
                                    onChangeText={setMailAuthCodeInput}
                                    keyboardType="phone-pad"
                                    autoComplete="off"
                                    autoCorrect={false}
                                />
                            </TextInputContainerView>
                        </View>
                        <TextButton
                            title="확인"
                            onPress={() => {
                                // Check Mail Auth Code
                                handleVerifyingEmailAuth(
                                    usernameInput,
                                    mailAuthCodeInput
                                );
                            }}
                            backgroundStyle={[
                                styles.confirmButtonBG,
                                allMailConditionSatisfied
                                    ? styles.activatedBackground
                                    : styles.inactivatedBackground,
                            ]}
                            isEnabled={allMailConditionSatisfied}
                            hasShadow={false}
                            textStyle={[
                                {
                                    fontSize: 14,
                                    color: allMailConditionSatisfied
                                        ? "white"
                                        : "gray",
                                },
                            ]}
                        />
                    </View>
                </View>
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
    guideTextFont: {
        fontSize: fontSizes.s16,
    },
    textInput: {
        fontSize: fontSizes.s16,
        paddingLeft: 8,
    },
    nameMargins: {
        marginTop: 30,
        marginBottom: 30,
        marginHorizontal: 18,
    },
    inactivatedBackground: {
        borderWidth: 1,
        borderColor: colors.gray4,
    },
    activatedBackground: {
        backgroundColor: colors.deeperMainColor,
    },
    authButtonBackground: {
        height: 42,
        width: 110,
        borderRadius: 6,
    },
    confirmButtonBG: {
        marginTop: 10,
        width: screenWidth - 36,
        height: 42,
        borderRadius: 6,
    },
    sendingAuthMailBG: {
        width: screenWidth - 36,
        height: 42,
        borderRadius: 6,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});
