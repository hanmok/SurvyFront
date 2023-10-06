import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface GenderSelectionProps {
    onGenderIndexSelection: (number) => void;
}

const GenderSelection: React.FC<GenderSelectionProps> = ({
    onGenderIndexSelection,
}) => {
    const [selectedGender, setSelectedGender] = useState(2);

    const genderOptions = ["남성", "여성", "무관"];

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                {genderOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.optionButton,
                            selectedGender === index &&
                                styles.selectedOptionButton,
                        ]}
                        onPress={() => {
                            setSelectedGender(index);
                            onGenderIndexSelection(index);
                        }}
                    >
                        <Text>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        // marginTop: 20,
    },
    optionButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#ccc",
    },
    selectedOptionButton: {
        backgroundColor: "#4caf50",
        borderColor: "#4caf50",
    },
});

export default GenderSelection;
