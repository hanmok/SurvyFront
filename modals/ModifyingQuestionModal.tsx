// CustomModal.tsx

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import { fontSizes } from "../utils/sizes";
import QuestionTypeSelectionBoxContainer from "../components/QuestionTypeSelectionBoxContainer";
import { Switch } from "react-native";
import { Question } from "../interfaces/Question";
import { QuestionType, getQuestionTypeIndex } from "../QuestionType";
import {
    SelectableOption,
    makeSelectableOption,
} from "../interfaces/SelectableOption";
import { log, logObject } from "../utils/Log";
import { colors } from "../utils/colors";
import { screenWidth } from "../utils/ScreenSize";
import DynamicTextInputsForModification from "../components/posting/DynamicTextInputsForModification";

interface ModifyingQuestionModalProps {
    isModifyingQuestionModalVisible: boolean;
    onClose: () => void;
    onModify: (question: Question) => void;
    selectedQuestion?: Question;
}

const ModifyingQuestionModal: React.FC<ModifyingQuestionModalProps> = ({
    isModifyingQuestionModalVisible,
    onClose,
    onModify,
    selectedQuestion,
}) => {
    const [questionTitle, setQuestionTitle] = useState("");
    const [isExtraOptionEnabled, setIsExtraOptionEnabled] = useState(false);
    const [dynamicInputValues, setDynamicInputValues] = useState([""]);
    const [questionType, setQuestionType] = useState<QuestionType>(undefined);
    const [satisfied, setSatisfied] = useState<boolean>(false);
    const [placeHolder, setPlaceHolder] = useState<string>("placeholder");
    const [removingTexts, setRemovingText] = useState<boolean>(false);
    const [secondTexts, setSecondTexts] = useState([""]);

    const handleDismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const toggleExtraOptionSwitch = () => {
        setIsExtraOptionEnabled(prev => !prev);
    };

    const handleModalClose = () => {
        setRemovingText(true);
        console.log(`dynamicInputValues: ${dynamicInputValues}`);
        onClose();
    };

    useEffect(() => {
        if (selectedQuestion) {
            logObject("currently selectedQuestion: ", selectedQuestion);
            setQuestionType(selectedQuestion.questionType);

            const texts = selectedQuestion.selectableOptions.map(
                option => option.value
            );
            logObject("texts: ", texts); // 정상적으로 뜸. 그럼 문제는? dynamic 에 있겠군.

            setDynamicInputValues(texts);
            setQuestionTitle(selectedQuestion.text);
        }
    }, [selectedQuestion, isModifyingQuestionModalVisible]);

    useEffect(() => {
        if (
            questionType !== undefined &&
            questionTitle !== "" &&
            dynamicInputValues[0] !== ""
        ) {
            setSatisfied(true);
            // console.log(`satisfied: true`);
        } else if (
            questionType === QuestionType.Essay &&
            questionTitle !== ""
        ) {
            setSatisfied(true);
        } else {
            setSatisfied(false);
        }
    }, [questionType, questionTitle, dynamicInputValues]);
    // }, [questionType, questionTitle]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModifyingQuestionModalVisible}
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
                                preselectedIndex={getQuestionTypeIndex(
                                    questionType
                                )}
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
                                <DynamicTextInputsForModification
                                    parentInputValues={dynamicInputValues}
                                    setParentInputValues={setDynamicInputValues}
                                    isModifyingModalVisible={removingTexts}
                                    setSecondTexts={setSecondTexts}
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
                            <TouchableOpacity
                                onPress={handleModalClose}
                                style={styles.bottomLeftButtonTextContainer}
                            >
                                <Text style={styles.bottomTextStyle}>취소</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setRemovingText(true);
                                    log(
                                        `dynamic input values: ${dynamicInputValues}`
                                    );
                                    let selectableOptions: SelectableOption[] =
                                        [];

                                    log(
                                        `question made: ${JSON.stringify(
                                            selectedQuestion
                                        )}`
                                    );

                                    if (questionType === QuestionType.Essay) {
                                        // selectableOptions
                                        const selectableOption =
                                            makeSelectableOption(
                                                selectedQuestion.id,
                                                0,
                                                placeHolder
                                            );
                                        selectableOptions.push(
                                            selectableOption
                                        );
                                    } else {
                                        log(`modify called`);
                                        // dynamicInputValues.map(
                                        secondTexts.map((optionText, index) => {
                                            if (optionText !== "") {
                                                const selectableOption =
                                                    makeSelectableOption(
                                                        selectedQuestion.id,
                                                        index,
                                                        optionText
                                                    );
                                                selectableOptions.push(
                                                    selectableOption
                                                );
                                            }
                                        });
                                    }
                                    selectedQuestion.text = questionTitle;
                                    selectedQuestion.questionType =
                                        questionType;
                                    selectedQuestion.selectableOptions =
                                        selectableOptions;

                                    onModify(selectedQuestion);
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
        // 전체 화면 관리
        flexGrow: 1,
        marginVertical: 60,
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

export default ModifyingQuestionModal;
