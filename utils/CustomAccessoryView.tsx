// CustomAccessoryView.tsx
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface CustomAccessoryViewProps {
    onPress: (buttonName: string) => void;
}

const CustomAccessoryView: React.FC<CustomAccessoryViewProps> = ({
    onPress,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => onPress("Button 1")}>
                <Text>Button 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPress("Button 2")}>
                <Text>Button 2</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#eee",
        padding: 10,
    },
});

export default CustomAccessoryView;
