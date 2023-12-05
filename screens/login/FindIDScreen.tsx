import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../../utils/NavHelper";
import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontSizes } from "../../utils/sizes";
import TextButton from "../../components/TextButton";
import { useEffect, useState } from "react";
import { colors } from "../../utils/colors";

export default function FindIDScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.findID>;
}) {
    const [isPhoneAuthTapped, setIsPhoneAuthTapped] = useState(true);
    const [isSatisfied, setSatisfied] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [phoneInput, setPhoneInput] = useState("");

    const [mailInput, setMailInput] = useState("");

    // const setAuthMethodToPhone = isPhoneAuth => {
    //     setIsPhoneAuthTapped(isPhoneAuth);
    // };

    useEffect(() => {
        if (nameInput !== "" && phoneInput.length == 13) {
            setSatisfied(true);
        } else {
            setSatisfied(false);
        }
    }, [nameInput, phoneInput]);

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
                            setIsPhoneAuthTapped(true);
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
                            setIsPhoneAuthTapped(false);
                        }}
                        hasShadow={false}
                        textStyle={styles.authText}
                        backgroundStyle={{ marginBottom: 12 }}
                    />
                    <View
                        style={!isPhoneAuthTapped && styles.selectedBar}
                    ></View>
                </View>
            </View>
            {/* name */}
            <View style={styles.nameContainer}>
                <Text style={[styles.guideText, { marginBottom: 14 }]}>
                    이름
                </Text>
                <View // Text Input Box
                    style={styles.textInputBox}
                >
                    <TextInput
                        placeholder="이름을 입력해주세요"
                        style={[styles.guideText, { paddingLeft: 8 }]}
                        value={nameInput}
                        onChangeText={setNameInput}
                        autoComplete="off"
                        autoCorrect={false}
                    />
                </View>
            </View>

            {isPhoneAuthTapped ? (
                // {/* 휴대폰 번호 */}
                <View
                    style={{
                        marginHorizontal: 18,
                        marginBottom: 26,
                    }}
                >
                    <Text style={[styles.guideText, { marginBottom: 14 }]}>
                        휴대폰 번호
                    </Text>
                    <View // Text Input Box
                        style={styles.textInputBox}
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
                </View>
            ) : (
                // 이메일
                <View
                    style={{
                        marginHorizontal: 18,
                        marginBottom: 26,
                    }}
                >
                    <Text style={[styles.guideText, { marginBottom: 14 }]}>
                        이메일 주소
                    </Text>
                    <View // Text Input Box
                        style={styles.textInputBox}
                    >
                        <TextInput
                            placeholder="이메일 주소를 입력해주세요"
                            style={[styles.guideText, { paddingLeft: 8 }]}
                            value={mailInput}
                            onChangeText={setMailInput}
                            keyboardType="email-address"
                            autoComplete="off"
                            autoCorrect={false}
                        />
                    </View>
                </View>
            )}
            {isPhoneAuthTapped ? (
                <TextButton
                    title="인증번호 받기"
                    onPress={() => {
                        navigation.navigate(NavigationTitle.foundID);
                    }}
                    backgroundStyle={[
                        styles.authButtonBackground,
                        isSatisfied
                            ? styles.activatedBackground
                            : styles.inactivatedBackground,
                    ]}
                    hasShadow={isSatisfied}
                    textStyle={{ color: "white", fontSize: fontSizes.m20 }}
                />
            ) : (
                <TextButton
                    title="인증 메일 받기"
                    onPress={() => {
                        navigation.navigate(NavigationTitle.foundID);
                    }}
                    backgroundStyle={[
                        styles.authButtonBackground,
                        isSatisfied
                            ? styles.activatedBackground
                            : styles.inactivatedBackground,
                    ]}
                    hasShadow={isSatisfied}
                    textStyle={{ color: "white", fontSize: fontSizes.m20 }}
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
        backgroundColor: "#ddd",
    },
    activatedBackground: {
        backgroundColor: colors.deepMainColor,
    },
    authButtonBackground: {
        height: 50,
        marginHorizontal: 18,
        borderRadius: 6,
    },
});
