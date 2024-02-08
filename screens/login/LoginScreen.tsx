import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../utils/NavHelper";
import { NavigationTitle } from "../../utils/NavHelper";
import {
    View,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
} from "react-native";
import { buttonColors, colors } from "../../utils/colors";
import TextButton from "../../components/TextButton";
import { screenWidth } from "../../utils/ScreenSize";
import Spacer from "../../components/common/Spacer";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontSizes } from "../../utils/sizes";
import { UserService } from "../../API/Services/UserService";
import { UserState } from "../../interfaces/UserState";
import { useEffect, useRef, useState } from "react";
import { useCustomContext } from "../../features/context/CustomContext";
import { userDataManager } from "../../utils/UserDataManager";
import showToast from "../../components/common/toast/Toast";
import showAdminToast from "../../components/common/toast/showAdminToast";
import { isValidEmail } from "../../utils/validation";

export default function LoginScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.login>;
}) {
    const userService = new UserService();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [satisfied, setSatisfied] = useState(false);

    const {
        updateUserDetail,
        updateAccessToken,
        updateUserId,
        updateLoadingStatus,
    } = useCustomContext();

    const passwordRef = useRef(null);

    const handleKeyPress = ref => {
        if (ref && ref.current) {
            ref.current.focus();
        }
    };

    useEffect(() => {
        const isValid = isValidEmail(username) && password.length >= 8;
        setSatisfied(isValid);
    }, [username, password]);

    const handleDismissKeyboard = () => {
        console.log("dismiss keyboard called");
        Keyboard.dismiss();
    };

    const moveToSignup = () => {
        navigation.navigate(NavigationTitle.signup);
    };

    const moveToFindId = () => {
        navigation.navigate(NavigationTitle.findID);
    };

    const moveToFindPassword = () => {
        navigation.navigate(NavigationTitle.findPassword);
    };

    const moveToMainTab = () => {
        navigation.navigate(NavigationTitle.mainTabs);
    };

    useEffect(() => {
        const unsubscribeFocus = navigation.addListener("focus", () => {
            setPassword("");
        });
        return unsubscribeFocus;
    }, [navigation]);

    useEffect(() => {
        const fetchPrevInfo = async () => {
            try {
                const userState = await userDataManager.loadUserState();
                if (userState !== null && userState.refreshToken) {
                    const responseUserStateResult =
                        await userService.autoSignin(userState.refreshToken);
                    const responseUserState = responseUserStateResult.data;

                    const updatedUserState =
                        await userDataManager.saveUserState({
                            ...responseUserState,
                        });

                    updateAccessToken(updatedUserState.accessToken);
                    updateUserId(updatedUserState.userId);

                    const userDetailResult = await userService.getUserDetail(
                        updatedUserState.accessToken
                    );

                    updateUserDetail(userDetailResult.data);
                    moveToMainTab();
                }
            } catch (error) {
                showAdminToast("error", `${error.message}`);
            }
        };
        fetchPrevInfo();
    }, []);

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

        await userService
            .signin(username, password)
            .then(userResponse => {
                const { userId, accessToken, refreshToken } = userResponse.data;
                userState = { userId, accessToken, refreshToken };
                return userService.getUserDetail(userState.accessToken);
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
                showToast(
                    "error",
                    "아이디, 비밀번호 오류",
                    "다시 확인해주세요"
                );
            })
            .finally(() => {
                updateLoadingStatus(false);
            });
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
                <View style={[styles.mainContainer]}>
                    <View>
                        <Spacer size={150} />
                        <Image
                            // source={require("../../assets/logo_gugi.png")}
                            source={require("../../assets/new_logo.png")}
                            style={{
                                height: screenWidth - 150,
                                width: (screenWidth - 150) / 0.87,
                                // aspectRatio: 2.74,
                                // height: (screenWidth - 150) / 2.74,
                                // width: screenWidth - 150,
                                // transform
                            }}
                        />
                    </View>
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
                                    handleKeyPress(passwordRef);
                                }}
                            />
                        </View>
                        <View style={{ height: 8 }} />
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
                                    loginAction(username, password);
                                }}
                            />
                        </View>

                        <View style={{ height: 25 }} />

                        <TextButton
                            title="로그인"
                            onPress={() => {
                                loginAction(username, password);
                            }}
                            textStyle={styles.loginTextStyle}
                            backgroundStyle={[
                                styles.loginInfoContainer,
                                styles.bottomButtonContainer,
                                styles.loginBackgroundStyle,
                                {
                                    backgroundColor: satisfied
                                        ? buttonColors.enabledButtonBG
                                        : buttonColors.disabledButtonBG,
                                },
                            ]}
                            hasShadow={false}
                            isEnabled={satisfied}
                        />
                        <Spacer size={10} />
                        <TextButton
                            title="회원가입"
                            onPress={moveToSignup}
                            textStyle={styles.loginTextStyle}
                            backgroundStyle={[
                                styles.loginInfoContainer,
                                styles.bottomButtonContainer,
                                styles.loginBackgroundStyle,
                                { backgroundColor: colors.deeperMainColor },
                            ]}
                            hasShadow={false}
                        />

                        <Spacer size={20} />
                        <View style={styles.btnsContainer}>
                            <TextButton
                                title="아이디 찾기"
                                onPress={moveToFindId}
                                textStyle={styles.findButtonText}
                                backgroundStyle={styles.findButtonBG}
                                hasShadow={false}
                            />

                            <TextButton
                                title="비밀번호 찾기"
                                onPress={moveToFindPassword}
                                textStyle={styles.findButtonText}
                                hasShadow={false}
                                backgroundStyle={styles.findButtonBG}
                            />
                        </View>
                    </View>
                    {/* make view upward */}
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
        borderWidth: 0,
    },
    loginTextStyle: {
        fontSize: 18,
        justifyContent: "center",
        color: colors.white,
    },
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
    findButtonText: {
        color: colors.deepMainColor,
        fontWeight: "bold",
    },
    findButtonBG: {
        alignItems: "center",
    },
    btnsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
});
