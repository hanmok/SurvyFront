import React from "react";
import { FC } from "react";
import { View } from "react-native";
import { Switch } from "react-native-gesture-handler";
import { colors } from "../utils/colors";

interface DefaultSwitchProps {
    onValueChange?: (boolean) => void;
    value?: boolean;
}

const DefaultSwitch: React.FC<DefaultSwitchProps> = ({
    onValueChange,
    value,
}) => {
    return (
        <Switch
            trackColor={{
                false: "cyan",
                true: "#34C759",
            }}
            thumbColor={colors.white}
            ios_backgroundColor="#E5E5E5"
            onValueChange={onValueChange}
            value={value}
        />
    );
};
export default DefaultSwitch;
