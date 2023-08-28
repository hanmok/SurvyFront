import { View } from "react-native";
import { SelectableOption } from "../types/SelectableOption";
import SelectableOptionBox from "./SelectableOptionBox";
import { useState } from "react";

interface SelectablContainerProps {
    selectableOptions: SelectableOption[];
    questionType: string;
}

const SelectableOptionContainer: React.FC<SelectablContainerProps> = ({
    selectableOptions,
    questionType,
}) => {
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

    return (
        <View>
            {selectableOptions.map((selectableOption, index) => {
                return (
                    <SelectableOptionBox
                        {...selectableOption}
                        questionType={questionType}
                    />
                );
            })}
        </View>
    );
};

export default SelectableOptionContainer;
