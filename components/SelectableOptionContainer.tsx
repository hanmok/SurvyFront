import { View } from "react-native";
import SelectableOptionBox from "./SelectableOptionBox";
import { useCallback, useEffect, useState } from "react";
import {
    selectSingleSelection,
    selectMultipleSelection,
    textInputAction,
} from "../features/selector/selectorSlice";
import { CustomAnswer, makeCustomAnswer } from "../interfaces/CustomAnswer";
import { useDispatch } from "react-redux";
import { QuestionTypeIdEnum } from "../enums/QuestionTypeEnum";
import { logArray, logObject } from "../utils/Log";
import {
    GQLQuestionType,
    GQLSelectableOption,
} from "../interfaces/GQLInterface";

interface SelectablContainerProps {
    selectableOptions: GQLSelectableOption[];
    questionType: GQLQuestionType;
    questionIndex: number;
    questionId: number;
}

const SelectableOptionContainer: React.FC<SelectablContainerProps> = ({
    selectableOptions,
    questionType,
    questionIndex,
    questionId,
}) => {
    const dispatch = useDispatch();
    const [userInput, setUserInput] = useState<string>("");

    useEffect(() => {
        logArray(
            "[SelectableeOptionContainer] passed selectableOptions",
            selectableOptions
        );
        logObject("questionIndex", questionIndex);
        logObject("questionType", questionType);
    }, []);

    const handleUserInput = useCallback(
        (userInput: string, soIndex: number, questionIndex: number) => {
            console.log(
                `handleUserInput called, input: ${userInput}, soIndex: ${soIndex}`
            );
            const selectableOptionId = selectableOptions[soIndex].id;

            const customAnswer: CustomAnswer = {
                selectableOptionId,
                answerText: userInput,
                questionId,
                questionIndex,
            };
            dispatch(textInputAction({ customAnswer }));
        },
        [textInputAction]
    );

    const handlePress = useCallback(
        (selectedIndex: number, answerText: string) => {
            logObject(
                `[SelectableOptionContainer] handlePress, questionTypeId:`,
                questionType
            );
            switch (questionType.id) {
                case `${QuestionTypeIdEnum.SingleSelection}`:
                    dispatch(
                        selectSingleSelection({
                            questionId,
                            questionIndex,
                            selectedSOId: selectableOptions[selectedIndex].id,
                            answerText,
                        })
                    );
                    break;

                case `${QuestionTypeIdEnum.MultipleSelection}`:
                    dispatch(
                        selectMultipleSelection({
                            questionId,
                            questionIndex,
                            selectedSOId: selectableOptions[selectedIndex].id,
                            answerText,
                        })
                    );
                    break;

                default:
                    const customAnswer = makeCustomAnswer(
                        selectableOptions[0].id,
                        questionId,
                        answerText,
                        questionIndex
                    );
                    dispatch(textInputAction({ customAnswer }));
                    break;
            }
        },
        [dispatch, questionType, questionIndex]
    );

    return (
        <View>
            {selectableOptions.map((selectableOption, soIndex) => {
                return (
                    <SelectableOptionBox
                        questionId={questionId}
                        {...selectableOption}
                        questionTypeId={questionType.id}
                        onPress={() =>
                            handlePress(
                                soIndex,
                                selectableOption.isExtra === 1 ? userInput : ""
                            )
                        } // text 추가
                        handleUserInput={text => {
                            handleUserInput(text, soIndex, questionIndex);
                            setUserInput(text);
                        }}
                        questionIndex={questionIndex}
                        key={`${selectableOption.id}`}
                    />
                );
            })}
        </View>
    );
};

export default SelectableOptionContainer;
