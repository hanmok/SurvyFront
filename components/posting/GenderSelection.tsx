import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface GenderSelectionProps {
    onGenderIndexSelection: (number) => void;
    selectionOptions: string[];
    selectedIndex: number;
}

const GenderSelection: React.FC<GenderSelectionProps> = ({
    onGenderIndexSelection,
    selectionOptions,
    selectedIndex,
}) => {
    // const [selectedGender, setSelectedGender] = useState(2);

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                {selectionOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.optionButton,
                            ,
                            {
                                flex: 1 / selectionOptions.length,
                                alignItems: "center",
                            },
                            selectedIndex === index &&
                                styles.selectedOptionButton,
                        ]}
                        onPress={() => {
                            // setSelectedGender(index);
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
        // flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 0,
    },
    optionButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#ccc",
        backgroundColor: "#dbdbdc",
    },
    selectedOptionButton: {
        backgroundColor: "white",
    },
});

export default GenderSelection;
