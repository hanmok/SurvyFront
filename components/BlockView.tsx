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
    isSmall?: boolean;
}

const BlockView: React.FC<BlockProps> = ({
    onPress,
    backgroundStyle,
    children,
    isSmall = true,
}) => {
    return (
        <TouchableOpacity
            style={[
                isSmall ? styles.smallContainer : styles.bigContainer,
                styles.basicContainer,
                backgroundStyle,
            ]}
            onPress={onPress}
        >
            {children}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    smallContainer: {
        justifyContent: "center",
        height: 60,
    },

    bigContainer: {
        justifyContent: "center",
        height: 120,
    },
    basicContainer: {
        borderRadius: 10,
        backgroundColor: colors.white,
        paddingLeft: 20,
    },
    text: { fontSize: fontSizes.l24 },
});

export default BlockView;
