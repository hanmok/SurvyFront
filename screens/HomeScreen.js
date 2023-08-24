import React from "react";
import { View, Text, Button, FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import { paddingSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import AvailableSurvey from "./AvailableSurvey";

const data = [
    {
        id: "1",
        title: "Item 1",
        currentParticipation: "10",
        participationGoal: "100",
    },
    {
        id: "2",
        title: "Item 2",
        currentParticipation: "10",
        participationGoal: "100",
    },
    {
        id: "3",
        title: "Item 3",
        currentParticipation: "10",
        participationGoal: "100",
    },
    // ... 더 많은 아이템 추가 가능
];

function HomeView({ navigation }) {
    const renderItem = ({ item }) => (
        <AvailableSurvey
            title={item.title}
            currentParticipation={item.currentParticipation}
            participationGoal={item.participationGoal}
        />
    );
    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <Text style={styles.collectedMoney}>Collected Money</Text>
            <Text style={styles.genre}>Genre</Text>
            {/* onPress 에 navigation.navigate("설문 참여") */}
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                style={styles.surveyListContainer}
            />

            {/*
            <Button
                title="설문 요청"
                onPress={() => navigation.navigate("설문 요청")}
            >
                설문 요청
            </Button>
			*/}
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
        paddingRight: paddingSizes.s12,
    },
    genre: {
        // flex: 1,
        justifyContent: "center",
        alignSelf: "stretch",
        flexBasis: 40,
        backgroundColor: colors.magenta,
        paddingTop: 10,
        paddingBottom: 16,
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
    surveyListContainer: {
        paddingTop: 20,
        paddingHorizontal: 12,
    },
});

export default HomeView;
