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
import TextButton from "../TextButton";
import { fontSizes } from "../../utils/sizes";
import QuestionTypeSelectionBox from "../QuestionTypeSelectionBox";
import QuestionTypeSelectionBoxContainer from "../QuestionTypeSelectionBoxContainer";
import { Switch } from "react-native";
import DynamicTextInputs from "./DynamicTextInputs";
import { Question, makeQuestion } from "../../interfaces/Question";
import { QuestionType } from "../../QuestionType";
import {
    SelectableOption,
    makeSelectableOption,
} from "../../interfaces/SelectableOption";
import { log } from "../../utils/Log";
import { colors } from "../../utils/colors";
import { screenWidth } from "../../utils/ScreenSize";

interface CreateQuestionModalProps {
    isCreateQuestionModalVisible: boolean;
    onClose: () => void;
    onAdd: (question: Question) => void;
    position: number;
}

const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({
    isCreateQuestionModalVisible,
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
    }, [questionType, questionTitle, dynamicInputValues]);

    useEffect(() => {
        setDynamicInputValues([""]);
        setQuestionTitle("");
    }, [isCreateQuestionModalVisible]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isCreateQuestionModalVisible}
            onRequestClose={handleModalClose}
        >
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
                    <View style={{ justifyContent: "space-between", flex: 1 }}>
                        {questionType === QuestionType.Essay ? (
                            <View
                                style={{
                                    width: screenWidth - 80,
                                    marginTop: 60,
                                    marginLeft: 20,
                                }}
                            >
                                <TextInput
                                    placeholder={placeHolder}
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
                            <DynamicTextInputs
                                dynamicInputValues={dynamicInputValues}
                                setDynamicInputValues={setDynamicInputValues}
                            />
                        )}

                        <View></View>

                        {/*  Two Switches */}
                        <View
                            style={{ marginHorizontal: 30, marginBottom: 30 }}
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
                        <TouchableOpacity
                            onPress={handleModalClose}
                            style={styles.bottomLeftButtonTextContainer}
                        >
                            <Text style={styles.bottomTextStyle}>취소</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                log(
                                    `dynamic input values: ${dynamicInputValues}`
                                );
                                let selectableOptions: SelectableOption[] = [];

                                let question = makeQuestion(
                                    position,
                                    questionTitle,
                                    questionType,
                                    []
                                );
                                log(
                                    `question made: ${JSON.stringify(question)}`
                                );

                                if (questionType === QuestionType.Essay) {
                                    // selectableOptions
                                    const selectableOption =
                                        makeSelectableOption(
                                            question.id,
                                            0,
                                            placeHolder
                                        );
                                    selectableOptions.push(selectableOption);
                                } else {
                                    dynamicInputValues.map(
                                        (optionText, index) => {
                                            const selectableOption =
                                                makeSelectableOption(
                                                    question.id,
                                                    index,
                                                    optionText
                                                );
                                            selectableOptions.push(
                                                selectableOption
                                            );
                                        }
                                    );
                                }
                                question.selectableOptions = selectableOptions;

                                onAdd(question);
                            }}
                            style={
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
        textAlign: "center",
        fontSize: fontSizes.l24,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
        flexGrow: 1,
        marginVertical: 40, // 전체 화면 관리
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
        // borderWidth: 1,
        borderTopWidth: 1,
        // borderRightWidth: 1,
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

export default CreateQuestionModal;
