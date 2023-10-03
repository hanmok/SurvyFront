import React from "react";
import { View } from "react-native";
import { colors } from "../utils/colors";

const Spacer = ({ size }) => (
    <View
        style={{
            height: size,
            width: size,
            // backgroundColor: colors.background,
            // backgroundColor: colors.transparent,
        }}
    />
);

export default Spacer;
