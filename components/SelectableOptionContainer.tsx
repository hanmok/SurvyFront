import { View } from "react-native";
import { SelectableOption } from "../types/SelectableOption";
import SelectableOptionBox from "./SelectableOptionBox";
import { useCallback, useState } from "react";
import {
    selectSingleSelection,
    selectMultipleSelection,
    textInputAction,
    CustomAnswer,
} from "../features/selector/selectorSlice";
import { useDispatch } from "react-redux";

interface SelectablContainerProps {
    selectableOptions: SelectableOption[];
    questionType: string;
    questionIndex: number; // questionId 를 알아야 하는건 아냐?
    questionId: number;
}

const SelectableOptionContainer: React.FC<SelectablContainerProps> = ({
    selectableOptions,
    questionType,
    questionIndex,
    questionId,
}) => {
    const dispatch = useDispatch();

    const handleUserInput = useCallback(
        (userInput: string, index: number) => {
            console.log(`handleUserInput called, input: ${userInput}`);
            const selectableOptionId = selectableOptions[index].id;
            const sequence = index;
            const customAnswer: CustomAnswer = {
                selectableOptionId,
                userInput,
                sequence,
            };
            dispatch(dispatch(textInputAction({ customAnswer })));
        },
        [dispatch]
    );

    const handlePress = useCallback(
        (selectedIndex: number) => {
            switch (questionType) {
                case "SINGLE_SELECTION":
                    dispatch(
                        selectSingleSelection({
                            questionIndex,
                            selectedIndexId:
                                selectableOptions[selectedIndex].id,
                        })
                    );
                    break;
                case "MULTIPLE_SELECTION":
                    dispatch(
                        selectMultipleSelection({
                            questionIndex,
                            selectedIndexId:
                                selectableOptions[selectedIndex].id,
                        })
                    );
                    break;
            }
        },
        [dispatch, questionType, questionIndex]
    );

    return (
        <View>
            {selectableOptions.map((selectableOption, index) => {
                return (
                    <SelectableOptionBox
                        {...selectableOption}
                        questionType={questionType}
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
