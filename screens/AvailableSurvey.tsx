import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import TextButton from "../components/TextButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { fontSizes, marginSizes } from "../utils/sizes";

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
    currentParticipation: number;
    participationGoal: number;
    onPress: () => void;
}

const AvailableSurvey: React.FC<MyCustomComponentProps> = ({
    title,
    currentParticipation,
    participationGoal,
    onPress,
    // genres
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.participationText}>
                {currentParticipation}/{participationGoal}
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
        fontSize: fontSizes.m20,
        marginTop: marginSizes.s12,
        marginHorizontal: marginSizes.s12,
        fontWeight: "bold",
    },
    participationText: {
        marginTop: 8,
        color: colors.gray1,
        fontSize: fontSizes.s16,
        marginHorizontal: marginSizes.s12,
    },
    participateButtonText: {
        fontSize: fontSizes.s16,
        marginRight: marginSizes.m16,
        marginTop: marginSizes.l20,
    },
});
