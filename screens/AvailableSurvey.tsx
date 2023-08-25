import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import TextButton from "../components/TextButton";
import { StackNavigationProp } from "@react-navigation/stack";

// props
// title
// currentParticipation
// ParticipationGoal
// Genres

// type RootStackParamList = {
//     Participate: { sectionId: number };
// };

interface MyCustomComponentProps {
    title: string;
    numOfParticipation: number;
    participationGoal: number;
    onPress: () => void;
}

const AvailableSurvey: React.FC<MyCustomComponentProps> = ({
    title,
    numOfParticipation,
    participationGoal,
    onPress,
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
                {/* <Text style={styles.participateButtonText}>참여하기 &gt;</Text> */}
                <TextButton
                    title="참여하기 >"
                    onPress={onPress}
                    textStyle={styles.participateButtonText}
                    backgroundStyle={{ backgroundColor: colors.white }}
                />
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
