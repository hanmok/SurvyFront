import React from "react";
import { View } from "react-native";
import { colors } from "../utils/colors";

const Spacer = ({ size }) => (
    <View style={{ height: size, backgroundColor: colors.background }} />
);

export default Spacer;
