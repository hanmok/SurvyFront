import { View } from "react-native";
import { SelectableOption } from "../interfaces/SelectableOption";
import SelectableOptionBox from "./SelectableOptionBox";
import { useCallback, useEffect, useState } from "react";
import {
    selectSingleSelection,
    selectMultipleSelection,
    textInputAction,
    // CustomAnswer,
} from "../features/selector/selectorSlice";
import { CustomAnswer, makeCustomAnswer } from "../interfaces/CustomAnswer";
import { useDispatch } from "react-redux";
import { QuestionTypeEnum } from "../enums/QuestionTypeEnum";
import { QuestionTypeId } from "../QuestionType";
import { logObject } from "../utils/Log";

interface SelectablContainerProps {
    selectableOptions: SelectableOption[];
    questionTypeId: number;
    questionIndex: number; // questionId 를 알아야 하는건 아냐?
    questionId: number;
}

const SelectableOptionContainer: React.FC<SelectablContainerProps> = ({
    selectableOptions,
    questionTypeId,
    questionIndex,
    questionId,
}) => {
    const dispatch = useDispatch();
    const [userInput, setUserInput] = useState<string>("");

    useEffect(() => {
        logObject("passed selectableOptions:", selectableOptions);
        logObject("questionIndex", questionIndex);
        logObject("questionTypeId: ", questionTypeId);
    }, []);

    // TODO: 상태 변수 하나 써서 더 간단히 할 수 있을 것 같아.
    const handleUserInput = useCallback(
        (userInput: string, soIndex: number) => {
            console.log(`handleUserInput called, input: ${userInput}`);
            const selectableOptionId = selectableOptions[soIndex].id;

            const customAnswer: CustomAnswer = {
                selectableOptionId,
                answerText: userInput,
                questionId,
                // soIndex,
            };
            dispatch(textInputAction({ customAnswer }));
        },
        [textInputAction]
        // [dispatch]
    );

    const handlePress = useCallback(
        (selectedIndex: number, answerText: string) => {
            console.log(
                `[SelectableOptionContainer] handlePress, questionTypeId: ${questionTypeId}`
            );
            switch (questionTypeId) {
                case QuestionTypeId.SingleSelection:
                    dispatch(
                        selectSingleSelection({
                            questionId,
                            questionIndex,
                            selectedSOId: selectableOptions[selectedIndex].id,
                            answerText,
                        })
                    );
                    break;

                case QuestionTypeId.MultipleSelection:
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
                        answerText
                    );
                    dispatch(textInputAction({ customAnswer }));
                    break;
            }
        },
        [dispatch, questionTypeId, questionIndex]
    );

    return (
        <View>
            {selectableOptions.map((selectableOption, soIndex) => {
                return (
                    <SelectableOptionBox
                        {...selectableOption}
                        questionTypeId={questionTypeId}
                        onPress={() =>
                            handlePress(
                                soIndex,
                                selectableOption.isExtra === 1 ? userInput : ""
                            )
                        } // text 추가
                        handleUserInput={text => {
                            handleUserInput(text, soIndex);
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
