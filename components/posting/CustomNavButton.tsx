import React from "react";
import { ImageRequireSource, View } from "react-native";
import ImageButton from "../ImageButton";

interface CustomNavButtonProps {
    img: ImageRequireSource;
    onPress: () => void;
}

const CustomNavButton: React.FC<CustomNavButtonProps> = ({ onPress, img }) => {
    return <ImageButton img={img} onPress={onPress} />;
};

export default CustomNavButton;
