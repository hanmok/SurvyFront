import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../../utils/NavHelper";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { fontSizes } from "../../utils/sizes";
import { buttonColors, colors } from "../../utils/colors";
import TextButton from "../../components/TextButton";
import Spacer from "../../components/common/Spacer";
import { updatePassword } from "../../API/UserAPI";
import { RouteProp } from "@react-navigation/native";
import showToast from "../../components/common/toast/Toast";
import showAdminToast from "../../components/common/toast/showAdminToast";
import { useCustomContext } from "../../features/context/CustomContext";

export default function PasswordSettingScreen({
    route,
    navigation,
}: {
    route: RouteProp<RootStackParamList, NavigationTitle.settingPassword>;
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.settingPassword
    >;
}) {
    const [passwordInput1, setPasswordInput1] = useState("");
    const [passwordInput2, setPasswordInput2] = useState("");
    const [isSatisfied, setIsSatisfied] = useState(false);
    const [confirmTapped, setConfirmTapped] = useState(false);

    const { username, shouldPopAll } = route.params;

    const { updateLoadingStatus } = useCustomContext();

    useEffect(() => {
        const update = async () => {
            updateLoadingStatus(true);
            await updatePassword(username, passwordInput1)
                .then(() => {
                    showToast("success", "비밀번호가 변경되었습니다.");
                })
                .catch(error => {
                    showAdminToast("error", "비밀번호 변경에 실패하였습니다.");
                })
                .finally(() => {
                    updateLoadingStatus(false);
                });
        };

        if (confirmTapped && passwordInput1 === passwordInput2) {
            update();
            if (shouldPopAll) {
                navigation.popToTop();
            } else {
                navigation.pop();
            }
        }
    }, [confirmTapped, username, passwordInput1, passwordInput2]);

    useEffect(() => {
        const condition =
            passwordInput1.length >= 8 &&
            !passwordInput1.includes(" ") &&
            passwordInput1 === passwordInput2;

        setIsSatisfied(condition);
    }, [passwordInput1, passwordInput2]);
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.nameContainer}>
                <Text style={[styles.guideText, { marginBottom: 14 }]}>
                    새 비밀번호 등록
                </Text>
                <View // Text Input Box
                    style={styles.textInputBox}
                >
                    <TextInput
                        placeholder="새 비밀번호를 입력해주세요"
                        style={[styles.guideText, { paddingLeft: 8 }]}
                        value={passwordInput1}
                        onChangeText={setPasswordInput1}
                        autoComplete="off"
                        secureTextEntry={true}
                        autoCorrect={false}
                    />
                </View>
            </View>

            <View style={styles.descriptionContainer}>
                <Text style={{ fontSize: 12, color: colors.gray3 }}>
                    8자 이상, 공백 사용 불가
                </Text>
            </View>

            <View style={styles.nameContainer}>
                <Text style={[styles.guideText, { marginBottom: 14 }]}>
                    새 비밀번호 확인
                </Text>
                <View // Text Input Box
                    style={styles.textInputBox}
                >
                    <TextInput
                        placeholder="새 비밀번호를 한번 더 입력해주세요."
                        style={[styles.guideText, { paddingLeft: 8 }]}
                        value={passwordInput2}
                        secureTextEntry={true}
                        onChangeText={setPasswordInput2}
                        autoComplete="off"
                        autoCorrect={false}
                    />
                </View>
            </View>
            <Spacer size={30} />
            <TextButton
                title="확인"
                onPress={() => {
                    setConfirmTapped(true);
                }}
                backgroundStyle={[
                    styles.authButtonBackground,
                    {
                        backgroundColor: isSatisfied
                            ? buttonColors.enabledButtonBG
                            : buttonColors.disabledButtonBG,
                    },
                ]}
                hasShadow={isSatisfied}
                textStyle={{ color: "white", fontSize: fontSizes.m20 }}
            />
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
        marginHorizontal: 18,
    },
    descriptionContainer: {
        marginHorizontal: 20,
    },
    authButtonBackground: {
        height: 50,
        marginHorizontal: 18,
        borderRadius: 6,
    },
});
