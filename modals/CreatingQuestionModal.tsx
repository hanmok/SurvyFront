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
import { QuestionTypeKorean, QuestionTypeId } from "../QuestionType";
import {
    SelectableOption,
    makeSelectableOption,
} from "../interfaces/SelectableOption";
import { log, logObject } from "../utils/Log";
import { colors } from "../utils/colors";
import { screenWidth } from "../utils/ScreenSize";
import DefaultSwitch from "../components/DefaultSwitch";

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
    // const [questionType, setQuestionType] = useState<QuestionType>(undefined);
    const [questionTypeId, SetQuestionTypeId] =
        useState<QuestionTypeId>(undefined);
    const [satisfied, setSatisfied] = useState<boolean>(false);
    const [placeHolder, setPlaceHolder] = useState<string>("placeholder");

    const handleConfirm = () => {
        let selectableOptions: SelectableOption[] = [];
        let question = makeQuestion(
            position,
            questionTitle,
            questionTypeId,
            [] // selectableOptions
        );
        log(`question made: ${JSON.stringify(question)}`);

        if (questionTypeId === QuestionTypeId.Essay) {
            const selectableOption = makeSelectableOption(
                question.id,
                0,
                placeHolder,
                0
            );
            selectableOptions.push(selectableOption);
        } else {
            dynamicInputValues.map((optionText, index) => {
                if (optionText !== "") {
                    const selectableOption = makeSelectableOption(
                        question.id,
                        index,
                        optionText,
                        0
                    );
                    selectableOptions.push(selectableOption);
                }
            });

            if (isExtraOptionEnabled) {
                const selectableOption = makeSelectableOption(
                    question.id,
                    dynamicInputValues.length,
                    "기타",
                    1
                );
                selectableOptions.push(selectableOption);
            }
        }

        question.selectableOptions = selectableOptions;
        logObject("question added", question);
        onAdd(question);

        setIsExtraOptionEnabled(false);
    };
    const toggleExtraOptionSwitch = () => {
        setIsExtraOptionEnabled(prev => !prev);
    };

    useEffect(() => {
        console.log(`isExtraOptionEnabled: ${isExtraOptionEnabled}`);
    }, [isExtraOptionEnabled]);

    const handleModalClose = () => {
        console.log(`dynamicInputValues: ${dynamicInputValues}`);
        setIsExtraOptionEnabled(false);
        onClose();
    };

    useEffect(() => {
        if (
            questionTypeId !== undefined &&
            questionTitle !== "" &&
            dynamicInputValues[0] !== ""
        ) {
            setSatisfied(true);
            console.log(`satisfied: true`);
        } else if (
            questionTypeId === QuestionTypeId.Essay &&
            questionTitle !== ""
        ) {
            setSatisfied(true);
        } else {
            setSatisfied(false);
        }
        // console.log(
        //     `questionTitle: ${questionTitle}, questionType: ${questionType}, dynamicInputValues: ${dynamicInputValues}`
        // );
    }, [questionTypeId, questionTitle, dynamicInputValues]);

    useEffect(() => {
        setDynamicInputValues([""]);
        setQuestionTitle("");
        setPlaceHolder("");
        // setQuestionType(undefined);
        SetQuestionTypeId(undefined);
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
                                autoCorrect={false}
                            />
                            <View style={{ height: 16 }} />
                            <QuestionTypeSelectionBoxContainer
                                handleSelect={SetQuestionTypeId}
                            />
                        </View>
                        <View
                            style={{ justifyContent: "space-between", flex: 1 }}
                        >
                            {questionTypeId === QuestionTypeId.Essay ? (
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
                                    isExtraOptionEnabled={isExtraOptionEnabled}
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
                                {questionTypeId === QuestionTypeId.Essay ? (
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
                                        {/* <Switch
                                            trackColor={{
                                                false: "cyan",
                                                true: "#34C759",
                                            }}
                                            thumbColor={
                                                colors.white
                                            }
                                            ios_backgroundColor="#E5E5E5"
                                            onValueChange={
                                                toggleExtraOptionSwitch
                                            }
                                            value={isExtraOptionEnabled}
                                        /> */}
                                        <DefaultSwitch
                                            onValueChange={
                                                toggleExtraOptionSwitch
                                            }
                                            value={isExtraOptionEnabled}
                                        />
                                    </View>
                                )}

                                <View style={{ height: 20 }} />
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
                                              //   styles.bottomLeftButtonTextContainer,
                                              styles.bottomRightButtonTextContainer,
                                              styles.activatedStyle,
                                          ]
                                        : [
                                              //   styles.bottomLeftButtonTextContainer,
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
        borderTopWidth: 1,
        borderRightWidth: 1,
        height: 40,
        alignItems: "center",
        margin: 0,
        backgroundColor: "white",
        borderBottomLeftRadius: 10,
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
        borderBottomRightRadius: 10,
    },
    activatedStyle: {
        backgroundColor: colors.white,
        borderBottomRightRadius: 10,
    },
});

export default CreatingQuestionModal;
