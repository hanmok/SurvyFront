import { StyleSheet, View, Text, Keyboard } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../utils/NavHelper";
import { NavigationTitle } from "../../utils/NavHelper";
import { useEffect, useState } from "react";
import { fontSizes } from "../../utils/sizes";
import { colors } from "../../utils/colors";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import TextButton from "../../components/TextButton";
import GenderSelection from "../../components/posting/GenderSelection";
import { checkUsernameDuplicate } from "../../API/UserAPI";
import { log } from "../../utils/Log";

export default function SignUpScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.login>;
}) {
    const [usernameInput, setUsernameInput] = useState("");
    const [usernameConfirmed, setUsernameConfirmed] = useState(false);

    const [passwordInput1, setPasswordInput1] = useState("");
    const [passwordInput2, setPasswordInput2] = useState("");

    // 휴대폰번호 확인해야함..
    const [phoneInput, setPhoneInput] = useState("");
    const [phoneConfirmed, setPhoneConfirmed] = useState(false);

    const [birthDate, setBirthDate] = useState("");
    const [birthDateValidated, setBirthDateValidated] = useState(false);
    const [genderIndex, setGenderIndex] = useState<number>(null);
    const [satisfied, setSatisfied] = useState(false);

    const handleUserDuplicate = async () => {
        await checkUsernameDuplicate(usernameInput)
            .then(ret => {
                setUsernameConfirmed(true);
                alert("사용할 수 있는 이메일입니다.");
            })
            .catch(error => {
                alert(error.message);
            });

        // try {
        //     const ret = await checkUsernameDuplicate(usernameInput);
        //     console.log("API call success");
        //     console.log("ret flag", ret);
        // } catch (error) {
        //     // console.error("API call failed, du", error);
        //     alert(error.message);
        // }
    };

    useEffect(() => {
        log(`usernameConfirmed changed to ${usernameConfirmed}`);
    }, [usernameConfirmed]);

    const validateUsername = () => {
        const ret = true;
        setUsernameConfirmed(ret);
        return ret;
    };

    const validatePhoneNumber = () => {
        const ret = true;
        setPhoneConfirmed(ret);
        return ret;
    };

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

    // const [usernameCheckTapped, setUsernameCheckTapped] = useState(false);

    // useEffect(() => {
    //     const checkUsernameDup = async () => {
    //         const ret = await checkUsernameDuplicate(usernameInput);
    //         if (ret.statusCode === 200) {
    //             setUsernameConfirmed(true);
    //         }
    //     };
    //     if (usernameCheckTapped) {
    //         console.log("username check tapped");
    //         checkUsernameDup();
    //     }
    // }, [usernameCheckTapped]);

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
                                autoCorrect={false}
                            />
                        </View>
                        <TextButton
                            title="중복확인"
                            onPress={() => {
                                // setUsernameCheckTapped(true);
                                handleUserDuplicate();
                            }}
                            backgroundStyle={styles.duplicateCheckBoxBackground}
                            textStyle={{ color: colors.deeperMainColor }}
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
                                validatePhoneNumber();
                            }}
                            backgroundStyle={[
                                styles.duplicateCheckBoxBackground,
                                { flex: 0.3 },
                            ]}
                            textStyle={{ color: colors.deeperMainColor }}
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
                            secureTextEntry={true}
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

                <View
                    style={{
                        marginTop: 40,
                        borderTopColor: colors.gray4,
                        borderTopWidth: 1,
                    }}
                >
                    <Text
                        style={{
                            fontSize: fontSizes.m20,
                            marginTop: 20,
                            marginLeft: 20,
                        }}
                    >
                        이용약관
                    </Text>
                </View>
            </View>

            <TextButton
                title="가입하기"
                onPress={() => {
                    // TODO: 여기가 맞아?
                    navigation.navigate(NavigationTitle.mainTabs);
                }}
                backgroundStyle={[
                    styles.buttonBackground,
                    {
                        marginBottom: 20,
                        marginTop: 40,
                    },
                    satisfied
                        ? { backgroundColor: colors.deepMainColor }
                        : { backgroundColor: colors.gray2 },
                ]}
                textStyle={[
                    {
                        fontSize: 16,
                        color: satisfied ? colors.black : colors.gray4,
                    },
                ]}
                isEnabled={!satisfied}
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
});
