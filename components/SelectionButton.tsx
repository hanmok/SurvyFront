import React, { useEffect, useState } from "react";
import {
    TouchableOpacity,
    ViewStyle,
    StyleProp,
    StyleSheet,
    Image,
    ImageStyle,
    ImageRequireSource,
    View,
} from "react-native";
import ImageButton from "./ImageButton";

export type SelectionType = "Single" | "Multi";

interface SelectionButtonProps {
    onPress?: () => void;
    imageStyle?: StyleProp<ImageStyle>;
    backgroundStyle?: StyleProp<ViewStyle>;
    selectionType: SelectionType;
    isSelected: boolean;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({
    onPress,
    imageStyle,
    backgroundStyle,
    selectionType,
    isSelected,
}) => {
    const [image, setImage] = useState<ImageRequireSource | null>(undefined);

    useEffect(() => {
        // setImageAddress
        switch ([selectionType, isSelected]) {
            case ["Single", true]:
                setImage(require("../assets/selectedSingleSelection.png"));
            case ["Single", false]:
                setImage(require("../assets/unselectedSingleSelection.png"));
            case ["Multi", true]:
                setImage(require("../assets/selectedMultipleSelection.png"));
            case ["Multi", false]:
                setImage(require("../assets/unselectedMultipleSelection.png"));
        }
    }, [selectionType, isSelected]);

    return (
        <TouchableOpacity
            style={[styles.container, backgroundStyle]}
            onPress={onPress}
        >
            {/* <Image
                source={img}
                style={[imageStyle, { aspectRatio: "1" }]}
            /> */}

            {/* <ImageButton img={require('../assets/unselectedMultipleSelection.png')}/> */}
            <ImageButton
                img={image}
                backgroundStyle={{ backgroundColor: "magenta" }}
                onPress={onPress}
            />
            <View style={{ backgroundColor: "magenta" }} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
});

export default SelectionButton;
