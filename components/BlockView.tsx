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
    size?: number;
    children: ReactNode;
}

const BlockView: React.FC<BlockProps> = ({
    onPress,
    backgroundStyle,
    children,
    size = 60,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                styles.basicContainer,
                backgroundStyle,
                { height: size },
            ]}
            onPress={onPress}
        >
            {children}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        height: 60,
    },
    basicContainer: {
        borderRadius: 10,
        backgroundColor: colors.white,
        paddingLeft: 20,
    },
    text: { fontSize: fontSizes.l24 },
});

export default BlockView;
