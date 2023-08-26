import React from "react";
import { View, Text } from "react-native";
interface SelectableOptionProps {
    id: number;
    questionId: number;
    position: number;
    value: string;
}

const SelectableOptionBox: React.FC<SelectableOptionProps> = ({
    id,
    questionId,
    position,
    value,
}) => {
    return (
        <View>
            <Text>
                value: {value}, position: {position}
            </Text>
        </View>
    );
};

export default SelectableOptionBox;
