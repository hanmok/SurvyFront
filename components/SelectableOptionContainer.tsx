import { View } from "react-native";
import { SelectableOption } from "../types/SelectableOption";
import SelectableOptionBox from "./SelectableOptionBox";
import { useCallback, useState } from "react";
import {
    selectSingleSelection,
    selectMultipleSelection,
} from "../features/selector/selectorSlice";
import { useSelector, useDispatch } from "react-redux";

interface SelectablContainerProps {
    selectableOptions: SelectableOption[];
    questionType: string;
    questionIndex: number;
}

const SelectableOptionContainer: React.FC<SelectablContainerProps> = ({
    selectableOptions,
    questionType,
    questionIndex,
}) => {
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
    const dispatch = useDispatch();

    const handlePress = useCallback(
        (selectedIndex: number) => {
            if (questionType === "SINGLE_SELECTION") {
                dispatch(
                    selectSingleSelection({ questionIndex, selectedIndex })
                );
            } else {
                dispatch(
                    selectMultipleSelection({ questionIndex, selectedIndex })
                );
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
                        questionIndex={questionIndex}
                        key={`${selectableOption.id}`}
                    />
                );
            })}
        </View>
    );
};

export default SelectableOptionContainer;
