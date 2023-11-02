import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface GenderSelectionProps {
    onGenderIndexSelection: (number) => void;
}

const GenderSelection: React.FC<GenderSelectionProps> = ({
    onGenderIndexSelection,
}) => {
    const [selectedGender, setSelectedGender] = useState(2);

    const genderOptions = ["여성", "남성", "무관"];

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
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                letterSpacing: 0.5,
                            }}
                        >
                            {option}
                        </Text>
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
        gap: 0,
    },
    optionButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        // marginHorizontal: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#ccc",
        // backgroundColor:
        backgroundColor: "#dbdbdc",
    },
    selectedOptionButton: {
        // backgroundColor: "#4caf50",
        // backgroundColor: "#dbdbdc",
        backgroundColor: "white",
        // borderColor: "#4caf50",
    },
});

export default GenderSelection;
