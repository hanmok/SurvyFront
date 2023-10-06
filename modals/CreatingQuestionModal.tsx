// CustomModal.tsx

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import TextButton from "../components/TextButton";
import { fontSizes } from "../utils/sizes";
import QuestionTypeSelectionBox from "../components/QuestionTypeSelectionBox";
import QuestionTypeSelectionBoxContainer from "../components/QuestionTypeSelectionBoxContainer";
import { Switch } from "react-native";
import DynamicTextInputsForCreation from "../components/posting/DynamicTextInputsForCreation";
import { Question, makeQuestion } from "../interfaces/Question";
import { QuestionType } from "../QuestionType";
import {
    SelectableOption,
    makeSelectableOption,
} from "../interfaces/SelectableOption";
import { log, logObject } from "../utils/Log";
import { colors } from "../utils/colors";
import { screenWidth } from "../utils/ScreenSize";

interface CreatingQuestionModalProps {
    isCreatingQuestionModalVisible: boolean;
    onClose: () => void;
    onAdd: (question: Question) => void;
    position: number;
}

const CreatingQuestionModal: React.FC<CreatingQuestionModalProps> = ({
    isCreatingQuestionModalVisible,
    onClose,
    onAdd,
    position,
}) => {
    const [questionTitle, setQuestionTitle] = useState("");
    const [isExtraOptionEnabled, setIsExtraOptionEnabled] = useState(false);
    const [dynamicInputValues, setDynamicInputValues] = useState([""]);
    const [questionType, setQuestionType] = useState<QuestionType>(undefined);
    const [satisfied, setSatisfied] = useState<boolean>(false);
    const [placeHolder, setPlaceHolder] = useState<string>("placeholder");

    const handleConfirm = () => {
        let selectableOptions: SelectableOption[] = [];
        let question = makeQuestion(
            position,
            questionTitle,
            questionType,
            [] // selectableOptions
        );
        log(`question made: ${JSON.stringify(question)}`);

        if (questionType === QuestionType.Essay) {
            const selectableOption = makeSelectableOption(
                question.id,
                0,
                placeHolder
            );
            selectableOptions.push(selectableOption);
        } else {
            dynamicInputValues.map((optionText, index) => {
                if (optionText !== "") {
                    const selectableOption = makeSelectableOption(
                        question.id,
                        index,
                        optionText
                    );
                    selectableOptions.push(selectableOption);
                }
            });
        }
        question.selectableOptions = selectableOptions;
        logObject("question added", question);
        onAdd(question);
    };
    const toggleExtraOptionSwitch = () => {
        setIsExtraOptionEnabled(prev => !prev);
    };

    const handleModalClose = () => {
        console.log(`dynamicInputValues: ${dynamicInputValues}`);
        onClose();
    };

    useEffect(() => {
        if (
            questionType !== undefined &&
            questionTitle !== "" &&
            dynamicInputValues[0] !== ""
        ) {
            setSatisfied(true);
            console.log(`satisfied: true`);
        } else if (
            questionType === QuestionType.Essay &&
            questionTitle !== ""
        ) {
            setSatisfied(true);
        } else {
            setSatisfied(false);
        }
        console.log(
            `questionTitle: ${questionTitle}, questionType: ${questionType}, dynamicInputValues: ${dynamicInputValues}`
        );
    }, [questionType, questionTitle, dynamicInputValues]);

    useEffect(() => {
        setDynamicInputValues([""]);
        setQuestionTitle("");
        setPlaceHolder("");
        setQuestionType(undefined);
    }, [isCreatingQuestionModalVisible]);

    const handleDismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isCreatingQuestionModalVisible}
            onRequestClose={handleModalClose}
        >
            <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View>
                            <TextInput
                                placeholder="질문을 입력해주세요 "
                                style={styles.questionTextStyle}
                                value={questionTitle}
                                onChangeText={setQuestionTitle}
                                autoComplete="off"
                            />
                            <View style={{ height: 16 }} />
                            <QuestionTypeSelectionBoxContainer
                                handleSelect={setQuestionType}
                            />
                        </View>
                        <View
                            style={{ justifyContent: "space-between", flex: 1 }}
                        >
                            {questionType === QuestionType.Essay ? (
                                <View
                                    style={{
                                        width: screenWidth - 80,
                                        marginTop: 60,
                                        marginLeft: 20,
                                    }}
                                >
                                    <TextInput
                                        placeholder="placeHolder"
                                        style={{
                                            fontSize: fontSizes.m20,
                                            color: colors.gray3,
                                        }}
                                        onChangeText={setPlaceHolder}
                                        value={placeHolder}
                                        autoComplete="off"
                                    />
                                    <View
                                        style={{
                                            backgroundColor: colors.gray2,
                                            height: 1,
                                            marginTop: 5,
                                        }}
                                    />
                                </View>
                            ) : (
                                <DynamicTextInputsForCreation
                                    dynamicInputValues={dynamicInputValues}
                                    setDynamicInputValues={
                                        setDynamicInputValues
                                    }
                                    keys={dynamicInputValues.map((_, index) =>
                                        index.toString()
                                    )}
                                />
                            )}

                            <View></View>

                            {/*  Two Switches */}
                            <View
                                style={{
                                    marginHorizontal: 30,
                                    marginBottom: 30,
                                }}
                            >
                                {questionType === QuestionType.Essay ? (
                                    <View />
                                ) : (
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            // justifyContent: "center",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text
                                            style={{ fontSize: fontSizes.m20 }}
                                        >
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
                                            onValueChange={
                                                toggleExtraOptionSwitch
                                            }
                                            value={isExtraOptionEnabled}
                                        />
                                    </View>
                                )}

                                <View style={{ height: 20 }} />
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                ></View>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <TextButton
                                title="취소"
                                textStyle={styles.bottomTextStyle}
                                onPress={handleModalClose}
                                backgroundStyle={
                                    styles.bottomLeftButtonTextContainer
                                }
                            />

                            <TextButton
                                onPress={handleConfirm}
                                title="확인"
                                backgroundStyle={
                                    satisfied
                                        ? [
                                              styles.bottomRightButtonTextContainer,
                                              styles.activatedStyle,
                                          ]
                                        : [
                                              styles.bottomRightButtonTextContainer,
                                              styles.inactivatedStyle,
                                          ]
                                }
                                textStyle={styles.bottomTextStyle}
                            />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    questionTextStyle: {
        marginTop: 60,
        textAlign: "center",
        fontSize: fontSizes.l24,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
        flexGrow: 1,
        marginVertical: 60, // 전체 화면 관리
        marginHorizontal: 20,
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "space-between",
    },
    bottomLeftButtonTextContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        // borderWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        height: 40,
        alignItems: "center",
        margin: 0,
    },
    bottomRightButtonTextContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        borderTopWidth: 1,
        height: 40,
        alignItems: "center",
        margin: 0,
    },
    bottomTextStyle: {
        textAlign: "center",
        fontSize: fontSizes.s16,
    },
    inactivatedStyle: {
        backgroundColor: colors.gray2,
    },
    activatedStyle: {
        backgroundColor: colors.white,
    },
});

export default CreatingQuestionModal;
