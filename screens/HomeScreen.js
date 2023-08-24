import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import { paddingSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import AvailableSurvey from "./AvailableSurvey";
import CollectedMoney from "../components/CollectedMoney";
import axios from "axios";

// participationGoal
// numOfParticipation

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
    const [myData, setMyData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSurveys = async () => {
        try {
            // const response = await axios.get("http://127.0.0.1:3000/survey");
            // http://localhost:3000/survey
            await fetch("http://localhost:3000/survey")
                .then(response => response.json())
                .then(jsonData =>
                    jsonData.data.map(item => ({
                        title: item.title,
                        id: item.id,
                        numOfParticipation: item.numOfParticipation,
                        participationGoal: item.participationGoal,
                    }))
                )
                .then(sth => {
                    console.log(`umm.. `, sth);
                    setIsLoading(false);
                    setMyData(sth);
                    // console.log("myData: ", myData);
                });
        } catch (error) {
            console.log("Error fetching data: ", error.message);
        }
    };

    // Component 가 Rendering 될 때 API 호출
    useEffect(() => {
        fetchSurveys();
    }, []);

    const renderItem = ({ item }) => (
        <AvailableSurvey
            title={item.title}
            numOfParticipation={item.numOfParticipation}
            participationGoal={item.participationGoal}
        />
    );

    if (isLoading) {
        return (
            <View>
                <Text style={{ backgroundColor: "magenta" }}>loading..</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* <Text style={styles.collectedMoney}>Collected Money</Text> */}
            <CollectedMoney amount={10000} style={styles.collectedMoney} />
            {/* <Text style={styles.genre}>Genre</Text> */}
            {/* onPress 에 navigation.navigate("설문 참여") */}
            <FlatList
                data={myData}
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
        // backgroundColor: colors.gray,
        backgroundColor: colors.background,
        // alignItems: "stretch",
    },
    collectedMoney: {
        width: 150,
        justifyContent: "flex-end",
        textAlign: "right",
        alignSelf: "flex-end",
        flexBasis: 30,
        paddingRight: paddingSizes.s12,
        borderRadius: 10,
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
