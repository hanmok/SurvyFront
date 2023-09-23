import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackParamList";
import { NavigationTitle } from "../utils/NavigationTitle";
import { View, Text, StyleSheet, TextInput, Image } from "react-native";
import { colors } from "../utils/colors";
import TextButton from "../components/TextButton";
import { screenWidth } from "../utils/ScreenSize";
import Spacer from "../components/Spacer";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontSizes } from "../utils/sizes";
import { login } from "../API/UserAPI";
import { UserState } from "../interfaces/UserState";
import { saveUserState } from "../utils/Storage";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import showMessageAlert from "../components/CustomAlert";

export default function LoginScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.login>;
}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const passwordRef = useRef(null);

    const handleKeyPress = ref => {
        // if (event.key === 'Enter') {
        ref.current.focus();
        // }
    };

    useEffect(() => {
        setUsername("");
        setPassword("");
    }, []);

    const loginAction = async (username: string, password: string) => {
        console.log(
            `[LoginScreen] username: ${username}, password: ${password}`
        );

        if (username === "") {
            showMessageAlert("Empty username", "please enter username");
            return;
        }
        if (password === "") {
            showMessageAlert("Empty password", "please enter password");
            return;
        }

        try {
            const userResponse = await login(username, password);
            const { userId, accessToken, refreshToken } = userResponse.data;
            const userState: UserState = { userId, accessToken, refreshToken };
            await saveUserState(userState);

            navigation.navigate(NavigationTitle.mainTabs, undefined);
        } catch (error) {
            showMessageAlert(
                "Wrong Login Info",
                "Check Username or Password Again"
            );
            console.log("[LoginScreen], login error:", error);
        }
    };

    return (
        // <View style={styles.mainContainer}>
        <SafeAreaView style={styles.mainContainer}>
            <Spacer size={40} />
            <View>
                <Image source={require("../assets/coin.jpg")} />
            </View>

            {/* <View style={{ height: 20 }} /> */}
            <View>
                <View style={styles.loginInfoContainer}>
                    <TextInput
                        placeholder="Username"
                        style={styles.textInputStyle}
                        value={username}
                        onChangeText={setUsername}
                        keyboardType="email-address"
                        onSubmitEditing={() => {
                            console.log("[LoginScreen] return tapped");
                            handleKeyPress(passwordRef);
                        }}
                    />
                </View>
                <View style={{ height: 20 }} />
                <View style={styles.loginInfoContainer}>
                    <TextInput
                        ref={passwordRef}
                        placeholder="Password"
                        style={styles.textInputStyle}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        onSubmitEditing={() => {
                            console.log(
                                "[LoginScreen] return tapped from password textinput"
                            );
                            loginAction(username, password);
                        }}
                    />
                </View>
                <View style={{ height: 30 }} />
                {/* <View
                    style={[
                        styles.loginInfoContainer,
                        styles.bottomButtonContainer,
                    ]}
                > */}
                <TextButton
                    title="Login"
                    onPress={() => {
                        console.log("login tapped");
                        // 성공시 여기 화면으로 넘어가기!
                        loginAction(username, password);
                    }}
                    textStyle={styles.loginTextStyle}
                    backgroundStyle={[
                        styles.loginInfoContainer,
                        styles.bottomButtonContainer,
                        styles.loginBackgroundStyle,
                    ]}
                />
                {/* </View> */}

                <Spacer size={15} />
                <TextButton
                    title="Forgot Password?"
                    onPress={() => {}}
                    textStyle={{
                        color: colors.deepMainColor,
                        fontWeight: "bold",
                    }}
                    backgroundStyle={{ alignItems: "center" }}
                />
            </View>
            <View>
                <TextButton
                    title="Sign Up"
                    onPress={() => {}}
                    textStyle={{
                        fontSize: fontSizes.s16,
                        color: colors.deepMainColor,
                        fontWeight: "bold",
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: "space-between",
        flexGrow: 1,
        alignItems: "center",
    },
    loginInfoContainer: {
        borderRadius: 10,
        borderColor: colors.gray3,
        borderWidth: 2,
        height: 50,
        flexDirection: "row",
        marginHorizontal: 20,
    },
    bottomButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        width: screenWidth - 40,
        marginLeft: 20,
        alignSelf: "center",
        backgroundColor: colors.deepMainColor,
        borderWidth: 0,
    },
    loginTextStyle: { fontSize: 20, justifyContent: "center", color: "white" },
    loginBackgroundStyle: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    textInputStyle: {
        flexGrow: 1,
        paddingHorizontal: 20,
        fontSize: fontSizes.s16,
    },
});
