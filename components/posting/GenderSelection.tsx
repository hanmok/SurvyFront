import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

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
    return (
        <View>
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
                            onGenderIndexSelection(index);
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                letterSpacing: 2,
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
    buttonContainer: {
        flexDirection: "row",
        gap: 0,
    },
    optionButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderWidth: 1,
        borderRadius: 5,
        // borderColor: "#ccc",
        borderColor: "#fff",
        backgroundColor: "#e4e4e4",
    },
    selectedOptionButton: {
        backgroundColor: "white",
    },
});

export default GenderSelection;
