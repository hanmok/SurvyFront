import React, { useEffect, useRef, useState } from "react";
import {
    View,
    TextInput,
    Modal,
    StyleSheet,
    Text,
    Animated,
    Keyboard,
} from "react-native";
import { colors } from "../utils/colors";
import TextButton from "../components/TextButton";
import { borderSizes, fontSizes, marginSizes } from "../utils/sizes";
import { screenHeight, screenWidth } from "../utils/ScreenSize";
import { TouchableOpacity } from "react-native-gesture-handler";
import { log, logObject } from "../utils/Log";
import { modalStyles } from "../utils/CommonStyles";
import { BottomButtonContainer } from "../components/common/BottomButtonContainer";

interface SurveyTitleModalProps {
    setSurveyTitle: (string) => void;
    surveyTitle: string;
    titleModalVisible: boolean;
    setTitleModalVisible: (boolean) => void;
    setConfirmTapped: (boolean) => void;
}

const SurveyTitleModal: React.FC<SurveyTitleModalProps> = ({
    setSurveyTitle,
    titleModalVisible,
    setTitleModalVisible,
    setConfirmTapped,
}) => {
    const [satisfied, setSatisfied] = useState(false);
    const [title, setTitle] = useState("");
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setSatisfied(title !== "");
    }, [title]);

    useEffect(() => {
        console.log("modalVisible changed");
    }, [titleModalVisible]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            "keyboardWillShow",
            () => {
                Animated.timing(translateY, {
                    toValue: -100,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            "keyboardWillHide",
            () => {
                // Animate modal content when the keyboard hides
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [translateY]);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={titleModalVisible}
            onRequestClose={() => {
                setTitleModalVisible(false);
            }}
        >
            <Animated.View style={{ transform: [{ translateY: translateY }] }}>
                {/* <TouchableOpacity
                    style={styles.modalContainer}
                    // onPress={() => {
                    //     Keyboard.dismiss();
                    //     console.log("keyboard dismiss");
                    // }}
                    activeOpacity={1}
                > */}
                <View
                    style={styles.modalContainer}
                    // onPress={() => {
                    //     Keyboard.dismiss();
                    //     console.log("keyboard dismiss");
                    // }}
                    // activeOpacity={1}
                >
                    <View style={styles.modalContent}>
                        {/* Title */}
                        <View>
                            <Text style={styles.infoTextContainer}>
                                제목을 입력해주세요.
                            </Text>
                        </View>
                        {/* Title Input */}
                        <View>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={setTitle}
                                value={title}
                                placeholder="텍스트를 입력하세요"
                                autoCorrect={false}
                                autoComplete="off"
                            />
                        </View>
                        <BottomButtonContainer
                            leftTitle="닫기"
                            leftAction={() => {
                                setTitleModalVisible(false);
                            }}
                            rightAction={() => {
                                setSurveyTitle(title);
                                setTitleModalVisible(false);
                                setConfirmTapped(true);
                            }}
                            satisfied={satisfied}
                        />
                    </View>
                </View>
                {/* </TouchableOpacity> */}
            </Animated.View>
        </Modal>
    );
};

export default SurveyTitleModal;

const styles = StyleSheet.create({
    totalContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1, // 화면 모두 가리기
        backgroundColor: colors.modalBackground,
    },
    modalContainer: {
        width: screenWidth,
        height: screenHeight,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 20,
        overflow: "hidden",
        justifyContent: "center",
    },
    modalContent: {
        height: 240,
        marginHorizontal: 40,
        backgroundColor: colors.background,
        borderRadius: 10,
        overflow: "hidden",
        justifyContent: "space-between",
        alignItems: "center",
    },
    infoTextContainer: {
        margin: 10,
        marginTop: 20,
        fontWeight: "bold",
        fontSize: fontSizes.m20,
        textAlign: "center",
    },
    textInput: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        overflow: "hidden",
        width: 300,
        paddingLeft: 10,
        marginVertical: 20,
        marginHorizontal: 20,
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 40,
        borderTopColor: "black",
        borderTopWidth: 1,
    },
    bottomButtonBackground: {
        flex: 0.5,
        alignItems: "center",
    },
    bottomTextStyle: {
        fontSize: fontSizes.s16,
    },
    modalBGStyle: {
        borderColor: colors.deepMainColor,
        borderWidth: 5,
        borderTopLeftRadius: borderSizes.m10,
        borderTopRightRadius: borderSizes.m10,
        height: 50,
        marginTop: marginSizes.xxs4,
        marginBottom: marginSizes.xxs4,
        width: screenWidth - marginSizes.s12 * 2,
    },
    modalTextStyle: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
    bottomBtnContainer: {
        flexDirection: "row",
        height: 60,
        alignSelf: "stretch",
        marginBottom: 10,
        marginHorizontal: 10,
    },
    cancelBtnBG: {
        flex: 0.5,
        backgroundColor: "white",
        marginHorizontal: 9,
        marginTop: 12,
        marginBottom: 6,
        borderRadius: 6,
    },
    cancelBtnText: {
        color: "black",
        letterSpacing: 2,
        fontSize: 16,
    },
    confirmBtnBG: {
        backgroundColor: colors.deeperMainColor,
        flex: 0.5,
        marginHorizontal: 9,
        marginTop: 12,
        marginBottom: 6,
        borderRadius: 6,
    },
    confirmBtnText: {
        color: "white",
        letterSpacing: 2,
        fontSize: 16,
    },
});
