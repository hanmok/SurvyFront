import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import { marginSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import AvailableSurvey from "./AvailableSurvey";
import CollectedMoney from "../components/CollectedMoney";
import axios from "axios";
import TextButton from "../components/TextButton";
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

const screenWidth = Dimensions.get("window").width;

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
            {/* onPress 에 navigation.navigate("설문 참여") */}
            <View style={styles.subContainer}>
                <FlatList
                    data={myData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 16 }} />
                    )}
                    style={styles.surveyListContainer}
                />
                <View style={styles.floatingButtonContainer}>
                    <TextButton
                        title="설문 요청"
                        onPress={() => navigation.navigate("설문 요청")}
                        backgroundStyle={styles.requestContainer}
                        textStyle={styles.requestText}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: colors.background,
    },
    subContainer: {
        justifyContent: "flex-end",
        // alignItems: "center",
        alignItems: "stretch",
    },

    floatingButtonContainer: {
        alignItems: "center",
        // flex: 1,
        position: "absolute",
        bottom: 0,
        width: screenWidth,
        // backgroundColor: "magenta",
        // backgroundColor: "rgba(0,0,0,0)",
    },

    collectedMoney: {
        width: 120,
        justifyContent: "flex-end",
        textAlign: "right",
        alignSelf: "flex-end",
        flexBasis: 30,
        marginRight: marginSizes.s12,
        borderRadius: 10,
    },
    genre: {
        justifyContent: "center",
        alignSelf: "stretch",
        flexBasis: 40,
        backgroundColor: colors.magenta,
        paddingTop: 10,
        paddingBottom: 16,
    },
    surveyListContainer: {
        paddingTop: 20,
        marginHorizontal: marginSizes.m16,
    },

    requestText: {
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    requestContainer: {
        backgroundColor: "blue",
        height: 60,
        width: 60,
        borderRadius: 30,
        marginBottom: 50,
    },
});

export default HomeView;
