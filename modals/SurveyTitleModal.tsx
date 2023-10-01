import React, { useState } from "react";
import {
    View,
    TextInput,
    Button,
    Modal,
    Alert,
    StyleSheet,
    Text,
} from "react-native";
import { colors } from "../utils/colors";
import TextButton from "../components/TextButton";
import { borderSizes, fontSizes, marginSizes } from "../utils/sizes";
import { screenWidth } from "../utils/ScreenSize";

const SurveyTitleModal = ({
    setSurveyTitle,
    surveyTitle,
    titleModalVisible,
    setTitleModalVisible,
    setConfirmTapped,
}) => {
    const [title, setTitle] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {/* <Button title="모달 열기" onPress={() => setModalVisible(true)} /> */}
            <TextButton
                backgroundStyle={styles.modalBGStyle}
                title={surveyTitle}
                onPress={() => setModalVisible(true)}
                textStyle={styles.modalTextStyle}
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.totalContainer}>
                    <View style={styles.coreContainer}>
                        <Text style={styles.infoTextContainer}>
                            설문조사 제목을 입력해주세요.
                        </Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={inputText => setTitle(inputText)}
                            value={title}
                            placeholder="텍스트를 입력하세요"
                        />
                        <View style={styles.bottomContainer}>
                            <TextButton
                                title="닫기"
                                onPress={() => setModalVisible(false)}
                                textStyle={styles.bottomTextStyle}
                                backgroundStyle={[
                                    styles.bottomButtonBackground,
                                ]}
                            />
                            <TextButton
                                title="확인"
                                onPress={() => {
                                    setSurveyTitle(title);
                                    setModalVisible(false);
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
        </View>
    );
};

export default SurveyTitleModal;

const styles = StyleSheet.create({
    totalContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1, // 화면 모두 가리기
        // backgroundColor: colors.modalBackground,
        // backgroundColor: "rgba(0, 0, 0, 0.5)", // 투명한 배경색
        backgroundColor: colors.modalBackground,
    },
    coreContainer: {
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 2,
        backgroundColor: colors.gray5,
        // backgroundColor: "white",
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
        borderRadius: borderSizes.m10,
        height: 50,
        marginTop: marginSizes.xxs4,
        marginBottom: marginSizes.xxs4,
        // width: screenWidth,
        width: screenWidth - marginSizes.l20 * 2,
        // marginHorizontal: marginSizes.l20,
    },
    modalTextStyle: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
});
