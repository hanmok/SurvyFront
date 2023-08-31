import { View } from "react-native";
import { SelectableOption } from "../types/SelectableOption";
import SelectableOptionBox from "./SelectableOptionBox";
import { useCallback, useState } from "react";
import {
    selectSingleSelection,
    selectMultipleSelection,
    textInputAction,
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
    const [selectedIndexIds, setSelectedIndexIds] = useState<number[]>([]);

    const dispatch = useDispatch();

    // const handleUserInput = useCallback(userInput: string) => {
    // 	dispatch(textInputAction({questionId, userInput})
    // }

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

    // const handleTextInput = useCallback(
    // 	(userInput: string) => {
    // 		dispatch(textInputAction({ questionId, userInput}))
    // 	}, [dispatch]
    // )

    return (
        <View>
            {selectableOptions.map((selectableOption, index) => {
                return (
                    <SelectableOptionBox
                        {...selectableOption}
                        questionType={questionType}
                        onPress={() => handlePress(index)}
                        // onTextInput={() => handleTextInput(asd)}
                        questionIndex={questionIndex}
                        key={`${selectableOption.id}`}
                    />
                );
            })}
        </View>
    );
};

export default SelectableOptionContainer;
