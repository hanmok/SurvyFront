import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import { paddingSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";

function HomeView() {
    return (
        // <View
        //     style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        // >
        // <View style={styles.container}>
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* <View style={styles.topContainer}> */}
            <Text style={styles.collectedMoney}>Collected Money</Text>
            <Text style={styles.genre}>Genre</Text>
            <Text style={styles.surveyList}>Survey List</Text>
            <Text style={styles.bottomText}>설문 요청</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        // alignItems: "center",
        backgroundColor: colors.gray,
        // alignItems: "stretch",
    },
    collectedMoney: {
        width: 150,
        justifyContent: "flex-end",
        textAlign: "right",
        alignSelf: "flex-end",
        flexBasis: 30,
        paddingRight: paddingSizes.s,
    },
    genre: {
        // flex: 1,
        justifyContent: "center",
        alignSelf: "stretch",
        flexBasis: 40,
        backgroundColor: colors.magenta,
    },
    surveyList: {
        flex: 1,
        justifyContent: "center",
        alignSelf: "stretch",
        flexGrow: 1,
        backgroundColor: "white",
    },
    topContainer: {
        flexDirection: "row",
        direction: "rtl",
        // justifyContent: "flex-end",
    },
    bottomText: {
        height: 50,
        flexBasis: 50,
        fontSize: 30,
        backgroundColor: "blue",
        fontWeight: "bold",
        width: "auto",
        textAlign: "center",
    },
});

export default HomeView;
