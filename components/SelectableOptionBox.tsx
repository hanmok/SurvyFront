import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { fontSizes, marginSizes, paddingSizes } from "../utils/sizes";
import ImageButton from "./ImageButton";
import { useSelector } from "react-redux";
// import RootState from "../store";
// import SelectorRootState from "../RootState";
// import { SelectorRootState } from "../RootState";
import { RootState } from "../store";

interface SelectableOptionProps {
    id: number;
    questionId: number;
    position: number;
    value: string;
    questionType: string;
    onPress?: () => void;
    questionIndex: number;
}

const SelectableOptionBox: React.FC<SelectableOptionProps> = ({
    id,
    questionId,
    position,
    value,
    questionType,
    onPress,
    questionIndex,
}) => {
    const sth = [[], []];
    const [isSelected, setIsSelected] = useState(false);
    const selectedIndexes = useSelector((state: RootState) => {
        return state.selector.selectedIndexes;
    });

    if (selectedIndexes == null) {
        return <Text>selectedIndexes: null </Text>;
    }

    return (
        <View style={styles.container}>
            {questionType === "SINGLE_SELECTION" ? (
                selectedIndexes[questionIndex].includes(position) ? (
                    <ImageButton
                        img={require("../assets/selectedSingleSelection.png")}
                        onPress={onPress}
                    />
                ) : (
                    <ImageButton
                        img={require("../assets/unselectedSingleSelection.png")}
                        onPress={onPress}
                    />
                )
            ) : selectedIndexes[questionIndex].includes(position) ? (
                <ImageButton
                    img={require("../assets/selectedMultipleSelection.png")}
                    backgroundStyle={{ justifyContent: "center" }}
                    onPress={onPress}
                />
            ) : (
                <ImageButton
                    img={require("../assets/unselectedMultipleSelection.png")}
                    backgroundStyle={{ justifyContent: "center" }}
                    onPress={onPress}
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
