import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Touchable,
} from "react-native";
import { commonStyles } from "./utils/CommonStyles";
import { colors } from "./utils/colors";
import SingleSelectionButton from "./components/SingleSelectionButton";

interface CostSelectionProps {
    initialIndex: number;
    toggleFreeState: (boolean) => void;
}

const CostSelectionContainer: React.FC<CostSelectionProps> = ({
    initialIndex,
    toggleFreeState,
}) => {
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);
    return (
        <View style={{ flexDirection: "row", gap: 5 }}>
            <SingleSelectionButton
                index={0}
                title="free"
                selectedIndex={selectedIndex}
                onPress={() => {
                    setSelectedIndex(0);
                    toggleFreeState(true);
                }}
                backgroundStyle={styles.buttonContainer}
                textStyle={{ textAlign: "center" }}
                selectedTextColor="white"
                unselectedTextColor="black"
                selectedBackgroundColor={colors.magenta}
                unselectedBackgroundColor={colors.transparent}
            />
            <SingleSelectionButton
                index={1}
                title="paid"
                selectedIndex={selectedIndex}
                onPress={() => {
                    setSelectedIndex(1);
                    toggleFreeState(false);
                }}
                textStyle={{ textAlign: "center" }}
                backgroundStyle={styles.buttonContainer}
                selectedTextColor="white"
                unselectedTextColor="black"
                selectedBackgroundColor={colors.magenta}
                unselectedBackgroundColor={colors.transparent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        // [
        // commonStyles.border,
        // backgroundColor: "magenta",
        borderRadius: 5,
        height: 40,
        width: 80,
        justifyContent: "center",
        borderWidth: 1,
        overflow: "hidden",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        fontSize: 24,
        marginBottom: 20,
    },
    slider: {
        width: 300,
        height: 40,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#007bff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 18,
    },
});

export default CostSelectionContainer;
