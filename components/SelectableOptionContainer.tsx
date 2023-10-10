import { View } from "react-native";
import { SelectableOption } from "../interfaces/SelectableOption";
import SelectableOptionBox from "./SelectableOptionBox";
import { useCallback, useEffect, useState } from "react";
import {
    selectSingleSelection,
    selectMultipleSelection,
    textInputAction,
    CustomAnswer,
} from "../features/selector/selectorSlice";
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

    useEffect(() => {
        logObject("passed selectableOptions:", selectableOptions);
        logObject("questionIndex", questionIndex);

        logObject("questionTypeId: ", questionTypeId);
    }, []);

    // TODO: 상태 변수 하나 써서 더 간단히 할 수 있을 것 같아.
    const handleUserInput = useCallback(
        (userInput: string, index: number) => {
            console.log(`handleUserInput called, input: ${userInput}`);
            const selectableOptionId = selectableOptions[index].id;
            const sequence = index;
            const customAnswer: CustomAnswer = {
                selectableOptionId,
                answerText: userInput,
                sequence,
            };
            dispatch(dispatch(textInputAction({ customAnswer })));
        },
        [textInputAction]
        // [dispatch]
    );

    const handlePress = useCallback(
        (selectedIndex: number) => {
            switch (questionTypeId) {
                case QuestionTypeId.SingleSelection:
                    dispatch(
                        selectSingleSelection({
                            questionIndex,
                            selectedIndexId:
                                selectableOptions[selectedIndex].id,
                        })
                    );
                    break;
                case QuestionTypeId.MultipleSelection:
                    dispatch(
                        selectMultipleSelection({
                            questionIndex,
                            selectedIndexId:
                                selectableOptions[selectedIndex].id,
                        })
                    );
                    break;
                default:
                    dispatch(
                        selectSingleSelection({
                            questionIndex,
                            selectedIndexId: selectableOptions[0].id,
                        })
                    );
                    break;
            }
        },
        [dispatch, questionTypeId, questionIndex]
    );

    return (
        <View>
            {selectableOptions.map((selectableOption, index) => {
                return (
                    <SelectableOptionBox
                        {...selectableOption}
                        questionTypeId={questionTypeId}
                        onPress={() => handlePress(index)}
                        handleUserInput={text => handleUserInput(text, index)}
                        questionIndex={questionIndex}
                        key={`${selectableOption.id}`}
                    />
                );
            })}
        </View>
    );
};

export default SelectableOptionContainer;
