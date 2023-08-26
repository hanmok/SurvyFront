import React from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../utils/colors";

interface ParticipatingQuestionProps {
    id: number;
    text: string;
    required: number;
}

const ParticipatingQuestionBox: React.FC<ParticipatingQuestionProps> = ({
    id,
    text,
    required,
}) => {
    return (
        <View style={styles.container}>
            {/* <Text>q_id: {id}</Text> */}
            <Text>{text}</Text>
            {/* <Text>q_required: {required}</Text> */}
        </View>
    );
};

export default ParticipatingQuestionBox;

const styles = StyleSheet.create({
    container: {
        margin: 20,
        backgroundColor: colors.lightMainColor,
    },
});
