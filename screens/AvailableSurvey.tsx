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
    numOfParticipation: number;
    participationGoal: number;
    // genres: string[];
}

const AvailableSurvey: React.FC<MyCustomComponentProps> = ({
    title,
    numOfParticipation,
    participationGoal,
    // genres
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.participationText}>
                {numOfParticipation}/{participationGoal}
            </Text>
            <View
                style={{
                    flexDirection: "row-reverse",
                    alignItems: "flex-end",
                }}
            >
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
        backgroundColor: colors.surveyBoxBackground,
    },
    titleText: {
        color: colors.black,
        fontSize: 20,
        marginTop: 12,
        marginHorizontal: 12,
        fontWeight: "bold",
    },
    participationText: {
        marginTop: 8,
        color: colors.gray1,
        fontSize: 16,
        marginHorizontal: 12,
    },
    participateButtonText: {
        fontSize: 16,
        marginRight: 15,
        marginTop: 20,
    },
});
