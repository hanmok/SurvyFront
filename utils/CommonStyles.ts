import { colors } from "./colors";
import { StyleSheet } from "react-native";
import { fontSizes } from "./sizes";

export const commonStyles = StyleSheet.create({
    font16: {
        fontSize: fontSizes.s16,
    },
    font20: {
        fontSize: fontSizes.m20,
    },
    font24: {
        fontSize: fontSizes.l24,
    },
    border: {
        borderWidth: 1,
        overflow: "hidden",
    },

    magenta: {
        backgroundColor: "magenta",
    },
});
