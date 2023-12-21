import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "../utils/colors";

interface TextInputInsideProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
}

const TextInputContainerView: React.FC<TextInputInsideProps> = ({
    children,
    style,
}) => {
    return <View style={[styles.textInputBox, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    textInputBox: {
        height: 42,
        backgroundColor: colors.white,
        justifyContent: "center",
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 6,
    },
});

export default TextInputContainerView;
