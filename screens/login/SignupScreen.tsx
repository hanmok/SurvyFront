import { StyleSheet, View, Text, Keyboard } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../utils/NavHelper";
import { NavigationTitle } from "../../utils/NavHelper";
import { useEffect, useState } from "react";
import { fontSizes } from "../../utils/sizes";
import { buttonColors, colors } from "../../utils/colors";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import TextButton from "../../components/TextButton";
import GenderSelection from "../../components/posting/GenderSelection";
import {
    checkPhoneDuplicate,
    hasDuplicateUsername,
    signup,
} from "../../API/UserAPI";
import { log, logObject } from "../../utils/Log";
import { isValidEmail, isValidPhone } from "../../utils/validation";
import { useCustomContext } from "../../features/context/CustomContext";
import showToast from "../../components/common/toast/Toast";
import showAdminToast from "../../components/common/toast/showAdminToast";
import showMessageAlert from "../../components/CustomAlert";
import Spacer from "../../components/common/Spacer";

export default function SignUpScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.login>;
}) {
    const [usernameInput, setUsernameInput] = useState("");
    const [usernameConfirmed, setUsernameConfirmed] = useState(false);

    const [usernameSatisfied, setUsernameSatisfied] = useState(false);

    useEffect(() => {
        setUsernameSatisfied(isValidEmail(usernameInput));
    }, [usernameInput]);

    const [passwordInput1, setPasswordInput1] = useState("");
    const [passwordInput2, setPasswordInput2] = useState("");

    // 휴대폰번호 확인해야함..
    const [phoneInput, setPhoneInput] = useState("");
    const [phoneConfirmed, setPhoneConfirmed] = useState(false);
    const [phoneSatisfied, setPhoneSatisfied] = useState(false);

    useEffect(() => {
        setPhoneSatisfied(phoneInput.length === 13);
    }, [phoneInput]);
    const [birthDate, setBirthDate] = useState("");
    const [birthDateValidated, setBirthDateValidated] = useState(false);
    const [genderIndex, setGenderIndex] = useState<number>(null);
    const [satisfied, setSatisfied] = useState(false);

    const { updateLoadingStatus } = useCustomContext();

    const handleUserDuplicate = async () => {
        if (isValidEmail(usernameInput)) {
            updateLoadingStatus(true);
            await hasDuplicateUsername(usernameInput)
                .then(ret => {
                    if (ret.statusCode < 300) {
                        // if (ret.statusCode < 300) {
                        logObject("result", ret);
                        setUsernameConfirmed(true);
                        showToast("success", "사용하실 수 있는 메일입니다.");
                    } else {
                        showToast("error", "사용하실 수 없는 메일입니다.");
                    }
                })
                .catch(error => {
                    showAdminToast("error", error.message);
                })
                .finally(() => {
                    updateLoadingStatus(false);
                });
        } else {
            showToast("error", "이메일 형식에 맞지 않습니다.");
        }
    };

    const handlePhoneDuplicate = async (phone: string) => {
        if (isValidPhone(phone)) {
            updateLoadingStatus(true);

            await checkPhoneDuplicate(phoneInput)
                .then(ret => {
                    if (ret.statusCode < 300) {
                        logObject("result", ret);
                        showToast("success", "인증번호가 전송되었습니다.");
                    } else {
                        showToast(
                            "error",
                            "이미 해당 번호로 가입된 계정이 있습니다."
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

    const handleSignup = async () => {
        console.log("handleSignup tapped");
        updateLoadingStatus(true);
        await signup(
            usernameInput,
            passwordInput1,
            phoneInput,
            birthDate,
            genderIndex
        )
            .then(() => {
                navigation.pop();
            })
            .catch(error => {
                // alert(error.message);
                showToast("error", `${error.message}`);
            })
            .finally(() => {
                updateLoadingStatus(false);
            });
    };

    // const validatePhoneNumber = () => {
    //     handlePhoneDuplicate();
    //     const ret = true;
    //     setPhoneConfirmed(ret);

    //     // alert("인증되었습니다.");
    //     return ret;
    // };

    // const isPublishingAuthCodeTapped () => {

    // }

    useEffect(() => {
        const ret = birthDate.length === 8;
        setBirthDateValidated(ret);
    }, [birthDate]);

    useEffect(() => {
        const ret =
            usernameConfirmed &&
            // usernameConfirmed &&
            passwordInput1 === passwordInput2 &&
            // mailConfirmed &&
            phoneConfirmed &&
            birthDateValidated &&
            genderIndex !== null;

        setSatisfied(ret);
    }, [
        usernameConfirmed,
        passwordInput1,
        passwordInput2,
        // mailConfirmed,
        phoneConfirmed,
        birthDateValidated,
        genderIndex,
    ]);

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
        <ScrollView
            style={styles.overall}
            contentContainerStyle={{ justifyContent: "space-between" }}
        >
            <View>
                {/* 아이디(이메일, username) */}
                <View>
                    <Text style={[styles.guideText, { marginBottom: 8 }]}>
                        이메일
                    </Text>
                    <View style={styles.horizontalContainer}>
                        <View style={[styles.textInputBox, { flex: 0.75 }]}>
                            <TextInput
                                placeholder="이메일을 입력해주세요"
                                style={styles.textInput}
                                value={usernameInput}
                                onChangeText={setUsernameInput}
                                keyboardType="email-address"
                                autoComplete="off"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                        <TextButton
                            title="중복확인"
                            onPress={() => {
                                handleUserDuplicate();
                            }}
                            hasShadow={false}
                            backgroundStyle={[
                                {
                                    alignSelf: "stretch",
                                    flex: 0.2,
                                    borderRadius: 6,
                                    paddingHorizontal: 12,
                                },
                                usernameSatisfied
                                    ? styles.activatedBackground
                                    : styles.inactivatedBorder,
                            ]}
                            // textStyle={{ color: colors.deeperMainColor }}
                            textStyle={{
                                color: usernameSatisfied
                                    ? colors.white
                                    : colors.gray2,
                            }}
                        />
                    </View>
                </View>
                {/* 비밀번호 */}
                <View style={{ marginTop: 20 }}>
                    <Text style={[styles.guideText, { marginBottom: 8 }]}>
                        비밀번호
                    </Text>

                    <View style={styles.textInputBox}>
                        <TextInput
                            placeholder="비밀번호를 입력해주세요"
                            style={styles.textInput}
                            value={passwordInput1}
                            onChangeText={setPasswordInput1}
                            keyboardType="default"
                            autoComplete="off"
                            autoCorrect={false}
                            secureTextEntry={true}
                        />
                    </View>
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={[styles.guideText, { marginBottom: 8 }]}>
                        비밀번호 확인
                    </Text>

                    <View style={styles.textInputBox}>
                        <TextInput
                            placeholder="비밀번호를 한번 더 입력해주세요"
                            style={styles.textInput}
                            value={passwordInput2}
                            onChangeText={setPasswordInput2}
                            keyboardType="default"
                            autoComplete="off"
                            autoCorrect={false}
                            secureTextEntry={true}
                        />
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={[styles.guideText, { marginBottom: 14 }]}>
                        휴대폰 번호
                    </Text>
                    <View style={styles.horizontalContainer}>
                        <View // Text Input Box
                            style={[styles.textInputBox, { flex: 0.65 }]}
                        >
                            <TextInput
                                placeholder="010-0000-0000"
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
                                handlePhoneDuplicate(phoneInput);
                            }}
                            backgroundStyle={[
                                {
                                    alignSelf: "stretch",
                                    borderRadius: 6,
                                    flex: 0.3,
                                },
                                phoneSatisfied
                                    ? styles.activatedBackground
                                    : styles.inactivatedBorder,
                            ]}
                            hasShadow={false}
                            textStyle={{
                                color: phoneSatisfied ? "white" : colors.gray2,
                            }}
                        />
                    </View>
                </View>

                {/* 생년월일 */}

                <View style={{ marginTop: 20 }}>
                    <Text style={[styles.guideText, { marginBottom: 8 }]}>
                        생년월일
                    </Text>

                    <View style={styles.textInputBox}>
                        <TextInput
                            placeholder="2001 10 23"
                            style={styles.textInput}
                            value={birthDate}
                            onChangeText={setBirthDate}
                            keyboardType="number-pad"
                            autoComplete="off"
                            autoCorrect={false}
                        />
                    </View>
                </View>

                {/* 성별 */}
                <View style={{ marginTop: 20 }}>
                    <View>
                        <Text style={[styles.guideText, { marginBottom: 8 }]}>
                            성별
                        </Text>
                        <GenderSelection
                            onGenderIndexSelection={setGenderIndex}
                            selectionOptions={["남성", "여성"]}
                            selectedIndex={genderIndex}
                        />
                    </View>
                </View>
            </View>

            <Spacer size={80} />

            <TextButton
                title="가입하기"
                onPress={() => {
                    handleSignup();
                }}
                backgroundStyle={[
                    styles.buttonBackground,
                    {
                        marginBottom: 20,
                        marginTop: 40,
                        backgroundColor: satisfied
                            ? buttonColors.enabledButtonBG
                            : buttonColors.disabledButtonBG,
                    },
                ]}
                hasShadow={false}
                textStyle={[
                    {
                        fontSize: 16,
                        color: "white",
                    },
                ]}
                isEnabled={satisfied}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    overall: {
        flex: 1,
        marginHorizontal: 18,
        marginBottom: 26,
        marginTop: 40,
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
    horizontalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    textInput: {
        fontSize: fontSizes.s16,
        paddingLeft: 8,
    },

    duplicateCheckBoxBackground: {
        borderColor: colors.deeperMainColor,
        backgroundColor: colors.background,
        borderRadius: 6,
        borderWidth: 2,
        alignSelf: "stretch",
        flex: 0.2,
    },
    buttonBackground: {
        marginHorizontal: 18,
        borderRadius: 6,
        height: 45,
    },
    inactivatedBorder: {
        borderWidth: 1,
        borderColor: colors.gray4,
    },
    activatedBackground: {
        backgroundColor: buttonColors.enabledButtonBG,
    },
});
