import { colors } from "./colors";
import { StyleSheet } from "react-native";
import { fontSizes } from "./sizes";

export const commonStyles = StyleSheet.create({
    border: {
        borderWidth: 1,
        overflow: "hidden",
    },
});

export const genreStyles = StyleSheet.create({
    selectedGenreButtonBG: {
        padding: 4,
        paddingHorizontal: 12,
        marginHorizontal: 6,
        borderRadius: 14,
        height: 32,
        marginVertical: 4,
        backgroundColor: colors.gray14,
    },
    unselectedGenreButtonBG: {
        padding: 4,
        paddingHorizontal: 12,
        marginHorizontal: 6,
        borderRadius: 14,
        height: 32,
        marginVertical: 4,
        backgroundColor: colors.white,
    },
    selectedGenreText: {
        color: colors.white,
    },
    unselectedGenreText: {
        color: colors.black,
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
        backgroundColor: colors.white,
        marginHorizontal: 9,
        marginTop: 12,
        marginBottom: 6,
        borderRadius: 6,
    },
    cancelBtnText: {
        color: colors.black,
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
        color: colors.white,
        letterSpacing: 2,
        fontSize: 16,
    },
});
