import React from "react";
import { StyleSheet, View } from "react-native";
import { modalStyles } from "../../utils/CommonStyles";
import TextButton from "../TextButton";
import { colors } from "../../utils/colors";

interface BottomButtonContainerProps {
    leftTitle?: string;
    leftAction: () => void;
    rightTitle?: string;
    rightAction: () => void;
    satisfied?: boolean;
}

export const BottomButtonContainer: React.FC<BottomButtonContainerProps> = ({
    leftTitle = "취소",
    leftAction,
    rightTitle = "확인",
    rightAction,
    satisfied = true,
}) => {
    return (
        <View style={modalStyles.bottomBtnContainer}>
            <TextButton
                title={leftTitle}
                onPress={() => {
                    leftAction();
                    console.log("cancel tapped");
                }}
                backgroundStyle={modalStyles.cancelBtnBG}
                textStyle={modalStyles.cancelBtnText}
            />
            <TextButton
                title={rightTitle}
                onPress={() => {
                    rightAction();
                }}
                isEnabled={satisfied}
                backgroundStyle={[
                    styles.confirmBtnBG,
                    {
                        backgroundColor: satisfied
                            ? colors.deeperMainColor
                            : colors.gray4,
                    },
                ]}
                textStyle={modalStyles.confirmBtnText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    confirmBtnBG: {
        backgroundColor: colors.deeperMainColor,
        flex: 0.5,
        marginHorizontal: 9,
        marginTop: 12,
        marginBottom: 6,
        borderRadius: 6,
    },
});
