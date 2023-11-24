import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../utils/NavHelper";
import { NavigationTitle } from "../../utils/NavHelper";
import {
    View,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { colors } from "../../utils/colors";
import TextButton from "../../components/TextButton";
import { screenWidth } from "../../utils/ScreenSize";
import Spacer from "../../components/common/Spacer";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontSizes } from "../../utils/sizes";
import { autoSignin, getUserDetail, signin } from "../../API/UserAPI";
import { UserState } from "../../interfaces/UserState";
// import { loadUserState, saveUserState } from "../../utils/Storage";
import { useEffect, useRef, useState } from "react";
import showMessageAlert from "../../components/CustomAlert";
import { log, logObject } from "../../utils/Log";
import { API_BASE_URL } from "../../API/API";
import { useCustomContext } from "../../features/context/CustomContext";
import { userDataManager } from "../../utils/UserDataManager";
import Toast from "react-native-toast-message";
import ShowToast from "../../components/common/toast/Toast";
import showToast from "../../components/common/toast/Toast";
import showAdminToast from "../../components/common/toast/showAdminToast";
import isValidEmail from "../../utils/EmailValidation";

export default function LoginScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.login>;
}) {
    const { updateLoadingStatus } = useCustomContext();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const passwordRef = useRef(null);

    const handleKeyPress = ref => {
        ref.current.focus();
    };

    const { updateUserDetail, updateAccessToken, updateUserId } =
        useCustomContext();

    const toastMessage = () => {
        Toast.show({
            type: "success",
            text1: "hello",
        });
    };

    useEffect(() => {
        const fetchPrevInfo = async () => {
            // const prevUserState = await loadUserState();
            const prevUserState = await userDataManager.loadUserState();
            if (prevUserState.refreshToken) {
                // 만약, 만료되었으면?
                try {
                    const userResponse = await autoSignin(
                        prevUserState.refreshToken
                    );
                    const userState: UserState = { ...userResponse };
                    logObject("userState", userState);

                    // await saveUserState({ ...userState });
                    userDataManager.saveUserState({ ...userState });
                    updateAccessToken(userState.accessToken);
                    updateUserId(userState.userId);

                    console.log("getUserDetail called");
                    const userDetail = await getUserDetail(
                        userState.accessToken
                    );
                    logObject("userDetail", userDetail);
                    updateUserDetail(userDetail);

                    navigation.navigate(NavigationTitle.mainTabs);
                } catch (error) {
                    alert(error.message);
                }
            }
        };
        fetchPrevInfo();
    }, []);

    useEffect(() => {
        const unsubscribeFocus = navigation.addListener("focus", () => {
            setPassword("");
        });
        return unsubscribeFocus;
    }, [navigation]);

    const handleDismissKeyboard = () => {
        console.log("dismiss keyboard called");
        Keyboard.dismiss();
    };

    const loginAction = async (username: string, password: string) => {
        console.log(
            `[LoginScreen] username: ${username}, password: ${password}`
        );

        if (isValidEmail(username) === false) {
            showToast("error", "아이디는 이메일 형식입니다");
            return;
        }
        if (password === "") {
            showToast("error", "비밀번호를 입력해주세요");
            return;
        }

        updateLoadingStatus(true);
        let userState: UserState | null;
        await signin(username, password)
            .then(userResponse => {
                const { userId, accessToken, refreshToken } = userResponse;
                userState = { userId, accessToken, refreshToken };

                return getUserDetail(userState.accessToken);
            })
            .then(userDetail => {
                updateAccessToken(userState.accessToken);
                updateUserId(userState.userId);

                return userDataManager.saveUserState(userState);
            })
            .then(() => {
                navigation.navigate(NavigationTitle.mainTabs, undefined);
                showToast("success", "로그인되었습니다.");
            })
            .catch(error => {
                // showToast("error", error.message);
            })
            .finally(() => {
                updateLoadingStatus(false);
            });
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
                <View style={[styles.mainContainer]}>
                    <Spacer size={40} />
                    <View>
                        <View style={styles.loginInfoContainer}>
                            <TextInput
                                placeholder="아이디 입력"
                                style={styles.textInputStyle}
                                value={username}
                                onChangeText={setUsername}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onSubmitEditing={() => {
                                    console.log("[LoginScreen] return tapped");
                                    handleKeyPress(passwordRef);
                                }}
                            />
                        </View>
                        <View style={{ height: 4 }} />
                        <View style={styles.loginInfoContainer}>
                            <TextInput
                                ref={passwordRef}
                                placeholder="비밀번호 입력"
                                style={styles.textInputStyle}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                                autoCapitalize="none"
                                onSubmitEditing={() => {
                                    console.log(
                                        "[LoginScreen] return tapped from password textinput"
                                    );
                                    loginAction(username, password);
                                }}
                            />
                        </View>

                        <View style={{ height: 30 }} />

                        <TextButton
                            title="로그인"
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
                                { marginBottom: 10, marginTop: 30 },
                            ]}
                        />
                        <Spacer size={10} />
                        <TextButton
                            title="회원가입"
                            onPress={() => {
                                console.log("login tapped");
                                // 성공시 여기 화면으로 넘어가기!

                                navigation.navigate(NavigationTitle.signup);
                            }}
                            textStyle={styles.loginTextStyle}
                            backgroundStyle={[
                                styles.loginInfoContainer,
                                styles.bottomButtonContainer,
                                styles.loginBackgroundStyle,
                            ]}
                        />

                        <Spacer size={20} />
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                            }}
                        >
                            <TextButton
                                title="아이디 찾기"
                                onPress={() => {
                                    log("forgot ID tapped");
                                    navigation.navigate(NavigationTitle.findID);
                                }}
                                textStyle={{
                                    color: colors.deepMainColor,
                                    fontWeight: "bold",
                                }}
                                backgroundStyle={{ alignItems: "center" }}
                                hasShadow={false}
                            />

                            <TextButton
                                title="비밀번호 찾기"
                                onPress={() => {
                                    log("forgot Password tapped");
                                    navigation.navigate(
                                        NavigationTitle.findPassword
                                    );
                                }}
                                textStyle={{
                                    color: colors.deepMainColor,
                                    fontWeight: "bold",
                                }}
                                hasShadow={false}
                                backgroundStyle={{ alignItems: "center" }}
                            />
                        </View>
                    </View>
                    <View></View>
                </View>
            </TouchableWithoutFeedback>
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
        height: 45,
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
