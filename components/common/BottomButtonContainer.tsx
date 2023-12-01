import React from "react";
import { View } from "react-native";
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
                backgroundStyle={[
                    modalStyles.confirmBtnBG,
                    !satisfied && { backgroundColor: colors.gray4 },
                ]}
                textStyle={modalStyles.confirmBtnText}
            />
        </View>
    );
};
