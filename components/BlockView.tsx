import React, { ReactNode } from "react";
import {
    Text,
    TouchableOpacity,
    ViewStyle,
    StyleProp,
    StyleSheet,
    TextStyle,
} from "react-native";
import { colors } from "../utils/colors";
import { fontSizes } from "../utils/sizes";

interface BlockProps {
    onPress?: () => void;
    textStyle?: StyleProp<TextStyle>;
    backgroundStyle?: StyleProp<ViewStyle>;
    children: ReactNode;
}

const BlockView: React.FC<BlockProps> = ({
    onPress,
    textStyle,
    backgroundStyle,
    children,
}) => {
    return (
        <TouchableOpacity
            style={[styles.container, styles.basicContainer, backgroundStyle]}
            onPress={onPress}
        >
            {children}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        height: 80,
    },
    basicContainer: {
        borderRadius: 10,
        backgroundColor: colors.white,
        paddingLeft: 20,
        // alignItems: "center",
    },
    text: { fontSize: fontSizes.l24 },
});

export default BlockView;
