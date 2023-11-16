import React, { useEffect, useState } from "react";
import { View, TextInput, Modal, StyleSheet, Text } from "react-native";
import { colors } from "../utils/colors";
import TextButton from "../components/TextButton";
import { borderSizes, fontSizes, marginSizes } from "../utils/sizes";
import { screenWidth } from "../utils/ScreenSize";

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
    const [title, setTitle] = useState("");

    useEffect(() => {
        console.log("modalVisible changed");
    }, [titleModalVisible]);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={titleModalVisible}
            onRequestClose={() => {
                setTitleModalVisible(false);
            }}
        >
            <View style={styles.totalContainer}>
                <View style={styles.coreContainer}>
                    <Text style={styles.infoTextContainer}>
                        설문조사 제목을 입력해주세요.
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={setTitle}
                        value={title}
                        placeholder="텍스트를 입력하세요"
                        autoCorrect={false}
                        autoComplete="off"
                    />
                    <View style={styles.bottomContainer}>
                        <TextButton
                            title="닫기"
                            onPress={() => setTitleModalVisible(false)}
                            textStyle={styles.bottomTextStyle}
                            backgroundStyle={[styles.bottomButtonBackground]}
                        />
                        <TextButton
                            title="확인"
                            onPress={() => {
                                setSurveyTitle(title);
                                setTitleModalVisible(false);
                                setConfirmTapped(true);
                            }}
                            textStyle={[
                                styles.bottomTextStyle,
                                { fontWeight: "bold" },
                            ]}
                            backgroundStyle={[
                                styles.bottomButtonBackground,
                                { borderLeftWidth: 1 },
                            ]}
                        />
                    </View>
                </View>
            </View>
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
    coreContainer: {
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 2,
        backgroundColor: colors.gray5,
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
});
