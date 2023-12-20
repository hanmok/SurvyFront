import React from "react";
import { InputAccessoryView, StyleSheet, View, Button } from "react-native";

interface CompleteAccessoryViewProps {
    id: string;
    onPress: () => void;
}

const CompleteAccessoryView: React.FC<CompleteAccessoryViewProps> = ({
    id,
    onPress,
}) => {
    return (
        <InputAccessoryView nativeID={id} style={styles.accessoryView}>
            <View style={[styles.accessoryBorder, styles.accessoryContent]}>
                <Button
                    title="완료"
                    onPress={() => {
                        onPress();
                    }}
                />
            </View>
        </InputAccessoryView>
    );
};

export default CompleteAccessoryView;

const styles = StyleSheet.create({
    accessoryView: {
        position: "absolute",
        bottom: 0, // Set the distance from the bottom of the screen
        left: 0,
        right: 0,
        backgroundColor: "#F3F4F6",
        borderTopColor: "#A8B7B6",
        borderTopWidth: 1,
    },
    accessoryContent: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingRight: 20,
        alignItems: "center",
        height: "100%", // Ensure the content takes the full height
    },
    accessoryBorder: {
        backgroundColor: "#F3F4F6",
        paddingRight: 20,
        borderTopColor: "#A8B7B6",
        borderTopWidth: 1,
    },
});
