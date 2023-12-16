import {
    Keyboard,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { fontSizes } from "../utils/sizes";
import TextButton from "../components/TextButton";
import { colors } from "../utils/colors";
import { useEffect, useState } from "react";
import { screenWidth } from "../utils/ScreenSize";
import { commonStyles } from "../utils/CommonStyles";
// import CostSelectionContainer from "../CostSelectionContainer";
import * as accounting from "accounting";
import { BottomButtonContainer } from "../components/common/BottomButtonContainer";
import Spacer from "../components/common/Spacer";
import showToast from "../components/common/toast/Toast";

interface FreeCostGuideModalProps {
    onClose: () => void;
    onConfirm: () => void;
    isCostGuideModalVisible: boolean;
    participationGoal: string;
    setParticipationGoal: (string) => void;
}

const FreeCostGuideModal: React.FC<FreeCostGuideModalProps> = ({
    onClose,
    onConfirm,
    isCostGuideModalVisible,
    setParticipationGoal,
    participationGoal,
}) => {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    useEffect(() => {
        if (parseInt(participationGoal) > 100) {
            setParticipationGoal("100");
        } else if (parseInt(participationGoal) === 0) {
            setParticipationGoal("1");
        }
    }, [participationGoal]);

    return (
        <Modal transparent={true} visible={isCostGuideModalVisible}>
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text
                            style={{
                                fontSize: fontSizes.m20,
                                textAlign: "center",
                                paddingVertical: 10,
                            }}
                        >
                            설문 제출
                        </Text>
                        <View>
                            <View style={styles.mainContent}>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: 16 }}>
                                        설문 참여 희망 인원을 입력해주세요.
                                    </Text>
                                    <Spacer size={10} />
                                    <View
                                        style={{
                                            // backgroundColor: "magenta",
                                            backgroundColor: colors.gray4,
                                            borderRadius: 6,
                                            overflow: "hidden",
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                        }}
                                    >
                                        <TextInput
                                            value={participationGoal}
                                            onChangeText={setParticipationGoal}
                                            placeholderTextColor={colors.gray2}
                                            keyboardType="number-pad"
                                            placeholder="10"
                                            textAlign="right"
                                            style={{ fontSize: 16 }}
                                        />
                                    </View>
                                    <Text
                                        style={{
                                            color: "red",
                                            fontSize: 11,
                                            marginTop: 10,
                                        }}
                                    >
                                        {" "}
                                        1~100 명의 설문 참여 인원을 설정할 수
                                        있습니다.
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        {
                                            alignItems: "center",
                                            flexDirection: "column",
                                        },
                                    ]}
                                ></View>
                            </View>
                        </View>

                        {/* <BottomButtonContainer */}
                        <BottomButtonContainer
                            leftAction={onClose}
                            rightAction={onConfirm}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
export default FreeCostGuideModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 20,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        height: 240,
        width: 300,
        // marginHorizontal: 40,
        // marginHorizontal: 20,
        backgroundColor: colors.background,
        // backgroundColor: "cyan",
        borderRadius: 10,
        borderWidth: 1,
        overflow: "hidden",
        justifyContent: "space-between",
        alignItems: "center",
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    bottomTextStyle: {
        textAlign: "center",
        fontSize: fontSizes.s16,
    },

    bottomLeftButtonTextContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        borderTopWidth: 1,
        borderRightWidth: 1,
        height: 40,
        alignItems: "center",
        margin: 0,
        borderBottomLeftRadius: 10,
        backgroundColor: "white",
    },
    bottomRightButtonTextContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        borderTopWidth: 1,
        height: 40,
        alignItems: "center",
        margin: 0,
    },
    inactivatedStyle: {
        backgroundColor: colors.gray2,
    },
    activatedStyle: {
        backgroundColor: colors.white,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    mainContent: {
        flexDirection: "column",
        justifyContent: "center",
        // flex: 1,
        gap: 30,
        marginHorizontal: 20,
    },
});
