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

export const modalStyles = StyleSheet.create({
    bottomBtnContainer: {
        flexDirection: "row",
        height: 60,
        alignSelf: "stretch",
        marginBottom: 10,
        marginHorizontal: 10,
    },
    cancelBtnBG: {
        flex: 0.5,
        backgroundColor: "white",
        marginHorizontal: 9,
        marginTop: 12,
        marginBottom: 6,
        borderRadius: 6,
    },
    cancelBtnText: {
        color: "black",
        letterSpacing: 2,
        fontSize: 16,
    },
    confirmBtnBG: {
        backgroundColor: colors.deeperMainColor,
        flex: 0.5,
        marginHorizontal: 9,
        marginTop: 12,
        marginBottom: 6,
        borderRadius: 6,
    },
    confirmBtnText: {
        color: "white",
        letterSpacing: 2,
        fontSize: 16,
    },
});
