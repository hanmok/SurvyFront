import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { fontSizes, marginSizes, paddingSizes } from "../utils/sizes";
import ImageButton from "./ImageButton";

interface SelectableOptionProps {
    id: number;
    questionId: number;
    position: number;
    value: string;
    questionType: string;
    onPress?: () => {};
}

const SelectableOptionBox: React.FC<SelectableOptionProps> = ({
    id,
    questionId,
    position,
    value,
    questionType,
    onPress,
}) => {
    const [isSelected, setIsSelected] = useState(false);
    return (
        <View style={styles.container}>
            {questionType === "SINGLE_SELECTION" ? (
                isSelected === true ? (
                    <ImageButton
                        img={require("../assets/selectedSingleSelection.png")}
                        onPress={() => {
                            console.log(`isSelected: ${isSelected}`);
                            setIsSelected(!isSelected);
                        }}
                    />
                ) : (
                    <ImageButton
                        img={require("../assets/unselectedSingleSelection.png")}
                        onPress={() => {
                            console.log(`isSelected: ${isSelected}`);
                            setIsSelected(!isSelected);
                        }}
                    />
                )
            ) : isSelected === true ? (
                <ImageButton
                    img={require("../assets/selectedMultipleSelection.png")}
                    backgroundStyle={{ justifyContent: "center" }}
                    onPress={() => {
                        console.log(`isSelected: ${isSelected}`);
                        setIsSelected(!isSelected);
                    }}
                />
            ) : (
                <ImageButton
                    // img={require("../assets/unselectedMultipleSelection.png")}
                    img={require("../assets/unselectedSingleSelection.png")}
                    backgroundStyle={{ justifyContent: "center" }}
                    onPress={() => {
                        console.log(`isSelected: ${isSelected}`);
                        setIsSelected(!isSelected);
                    }}
                />
            )}
            <Text style={styles.textStyle}>{value}</Text>
        </View>
    );
};

export default SelectableOptionBox;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingLeft: paddingSizes.m16,
        alignItems: "center",
        marginTop: marginSizes.s12,
    },
    textStyle: {
        fontSize: fontSizes.s16,
        marginLeft: marginSizes.s12,
    },
});
