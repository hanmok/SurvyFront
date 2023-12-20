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
import { Question } from "../interfaces/Question";
import { QuestionTypeId } from "../QuestionType";
import {
    SelectableOption,
    makeSelectableOption,
} from "../interfaces/SelectableOption";
import { log, logObject } from "../utils/Log";
import { colors } from "../utils/colors";
import { screenWidth } from "../utils/ScreenSize";
import DynamicTextInputsForModification from "../components/posting/DynamicTextInputsForModification";
import DefaultSwitch from "../components/DefaultSwitch";

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
    const [questionTypeId, setQuestionTypeId] =
        useState<QuestionTypeId>(undefined);
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
        setIsExtraOptionEnabled(false);
    };

    useEffect(() => {
        if (selectedQuestion) {
            logObject("currently selectedQuestion: ", selectedQuestion);
            setQuestionTypeId(selectedQuestion.questionTypeId);

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
            questionTypeId !== undefined &&
            questionTitle !== "" &&
            dynamicInputValues[0] !== ""
        ) {
            setSatisfied(true);
        } else if (
            questionTypeId === QuestionTypeId.Essay &&
            questionTitle !== ""
        ) {
            setSatisfied(true);
        } else {
            setSatisfied(false);
        }
    }, [questionTypeId, questionTitle, dynamicInputValues]);

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
                                autoCorrect={false}
                            />
                            <View style={{ height: 16 }} />
                            <QuestionTypeSelectionBoxContainer
                                handleSelect={setQuestionTypeId}
                                preselectedIndex={questionTypeId}
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
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text
                                            style={{ fontSize: fontSizes.m20 }}
                                        >
                                            기타 옵션 추가
                                        </Text>
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

                                    if (
                                        questionTypeId === QuestionTypeId.Essay
                                    ) {
                                        const selectableOption =
                                            makeSelectableOption(
                                                selectedQuestion.id,
                                                0,
                                                placeHolder,
                                                0
                                            );
                                        selectableOptions.push(
                                            selectableOption
                                        );
                                    } else {
                                        secondTexts.map((optionText, index) => {
                                            if (optionText !== "") {
                                                const selectableOption =
                                                    makeSelectableOption(
                                                        selectedQuestion.id,
                                                        index,
                                                        optionText,
                                                        isExtraOptionEnabled
                                                            ? 1
                                                            : 0
                                                    );
                                                selectableOptions.push(
                                                    selectableOption
                                                );
                                            }
                                        });
                                    }
                                    selectedQuestion.text = questionTitle;
                                    selectedQuestion.questionTypeId =
                                        questionTypeId;
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

export default ModifyingQuestionModal;
