// CustomModal.tsx

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from "react-native";
import TextButton from "./TextButton";
import { fontSizes } from "../utils/sizes";
import QuestionTypeSelectionBox from "./QuestionTypeSelectionBox";
import QuestionTypeSelectionBoxContainer from "./QuestionTypeSelectionBoxContainer";
import { Switch } from "react-native";
import DynamicTextInputs from "./DynamicTextInputs";

interface CreateQuestionModalProps {
    visible: boolean;
    onClose: () => void;
}

const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({
    visible,
    onClose,
}) => {
    const [questionTitle, setQuestionTitle] = useState("");
    // const [optionTexts, setOptionTexts] = useState([]);
    const [isExtraOptionEnabled, setIsExtraOptionEnabled] = useState(false);
    const [isRequiredEnabled, setIsRequiredEnabled] = useState(true);

    const [dynamicInputValues, setDynamicInputValues] = useState([""]);

    const toggleExtraOptionSwitch = () => {
        setIsExtraOptionEnabled(prev => !prev);
    };

    const toggleRequiredSwitch = () => {
        setIsRequiredEnabled(prev => !prev);
    };
    const handleModalClose = () => {
        console.log(`dynamicInputValues: ${dynamicInputValues}`);
        onClose();
    };

    useEffect(() => {
        // Unamount 시 호출
        return () => {
            console.log(
                `from createQuestionModal, dynamicInputValues: ${dynamicInputValues}`
            );
        };
    }, []);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleModalClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View>
                        <TextInput
                            placeholder="질문 ?? "
                            style={styles.questionTextStyle}
                            value={questionTitle}
                            onChangeText={setQuestionTitle}
                        />
                        <View style={{ height: 16 }} />
                        <QuestionTypeSelectionBoxContainer />
                    </View>
                    <View style={{ justifyContent: "space-between", flex: 1 }}>
                        {/* Selectable Options */}
                        {/* <TextInput placeholder={`옵션 ${optionTexts.length}`} /> */}

                        <DynamicTextInputs
                            dynamicInputValues={dynamicInputValues}
                            setDynamicInputValues={setDynamicInputValues}
                        />
                        <View></View>

                        {/*  Two Switchs */}
                        <View
                            style={{ marginHorizontal: 30, marginBottom: 30 }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    // justifyContent: "center",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ fontSize: fontSizes.m20 }}>
                                    기타 옵션 추가
                                </Text>
                                <Switch
                                    trackColor={{
                                        false: "#767577",
                                        true: "#81b0ff",
                                    }}
                                    thumbColor={
                                        isExtraOptionEnabled
                                            ? "#f5dd4b"
                                            : "#f4f3f4"
                                    }
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleExtraOptionSwitch}
                                    value={isExtraOptionEnabled}
                                />
                            </View>
                            <View style={{ height: 20 }} />
                            <View
                                style={{
                                    flexDirection: "row",
                                    // justifyContent: "center",
                                    // justifyContent: "space-around",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ fontSize: fontSizes.m20 }}>
                                    필수 입력
                                </Text>
                                <Switch
                                    trackColor={{
                                        false: "#767577",
                                        true: "#81b0ff",
                                    }}
                                    thumbColor={
                                        isRequiredEnabled
                                            ? "#f5dd4b"
                                            : "#f4f3f4"
                                    }
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleRequiredSwitch}
                                    value={isRequiredEnabled}
                                />
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <TouchableOpacity
                            onPress={handleModalClose}
                            style={styles.bottomButtonContainer}
                        >
                            <Text style={styles.bottomTextStyle}>취소</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleModalClose}
                            style={styles.bottomButtonContainer}
                        >
                            <Text style={styles.bottomTextStyle}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    questionTextStyle: {
        marginTop: 60,
        // backgroundColor: "magenta",
        textAlign: "center",
        fontSize: fontSizes.l24,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        flexGrow: 1,
        marginVertical: 40,
        marginHorizontal: 20,
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        justifyContent: "space-between",
    },
    bottomButtonContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        borderTopColor: "magenta",
        borderWidth: 1,
        height: 40,
        alignItems: "center",
        margin: 0,
    },
    bottomTextStyle: {
        textAlign: "center",
        fontSize: fontSizes.s16,
    },
    topViewStyle: {},
});

export default CreateQuestionModal;
