import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../utils/colors";

// props
// title
// currentParticipation
// ParticipationGoal
// Genres

interface MyCustomComponentProps {
    title: string;
    currentParticipation: number;
    participationGoal: number;
    // genres: string[];
}

const AvailableSurvey: React.FC<MyCustomComponentProps> = ({
    title,
    currentParticipation,
    participationGoal,
    // genres
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.participationText}>
                {currentParticipation}/{participationGoal}
            </Text>
            <View style={{ direction: "rtl" }}>
                <Text style={styles.participateButtonText}>참여하기 &gt;</Text>
            </View>
        </View>
    );
};

export default AvailableSurvey;

const styles = StyleSheet.create({
    container: {
        height: 120,
        borderRadius: 20,
        backgroundColor: colors.white,
    },
    titleText: {
        color: colors.black,
        // backgroundColor: colors.deepMainColor,
        fontSize: 20,
        paddingTop: 12,
        paddingHorizontal: 12,
        fontWeight: "bold",
    },
    participationText: {
        paddingTop: 8,
        color: colors.gray1,
        fontSize: 16,
        paddingHorizontal: 12,
    },
    participateButtonText: {
        fontSize: 20,
        backgroundColor: "magenta",
        width: 100,
        margin: 10,
    },
});
