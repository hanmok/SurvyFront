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
import CostSelectionContainer from "../CostSelectionContainer";
import * as accounting from "accounting";
import { BottomButtonContainer } from "../components/common/BottomButtonContainer";

interface CostGuideModalProps {
    onClose: () => void;
    onConfirm: () => void;
    isCostGuideModalVisible: boolean;
    expectedTimeInMin: number;
    participationGoal: string;
    setParticipationGoal: (string) => void;
    setIsFree: (boolean) => void;
    isFree: boolean;
    price: string;
    setPrice: (string) => void;
}

const CostGuideModal: React.FC<CostGuideModalProps> = ({
    onClose,
    onConfirm,
    isCostGuideModalVisible,
    expectedTimeInMin,
    setIsFree,
    isFree,
    price,
    setPrice,
    setParticipationGoal,
    participationGoal,
}) => {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    useEffect(() => {
        console.log(`[CostGuideModal], isFree: ${isFree}, price: ${price}`);
        if (isFree) {
            setPrice("0");
        } else {
            const value = parseInt(participationGoal) * 300 * expectedTimeInMin;
            const numWithComma = accounting.formatMoney(value, {
                symbol: "",
                precision: 0,
                thousand: ",",
            });

            setPrice(`${numWithComma}`);
        }
    }, [price, isFree, isCostGuideModalVisible, participationGoal]);

    return (
        <Modal transparent={true} visible={isCostGuideModalVisible}>
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text
                            style={{
                                fontSize: fontSizes.m20,
                                backgroundColor: colors.gray4,
                                width: screenWidth - 40 * 2,
                                textAlign: "center",
                                paddingVertical: 10,
                            }}
                        >
                            설문 제출
                        </Text>

                        <View style={{ height: 200, width: 300 }}>
                            <View style={styles.mainContent}>
                                <View style={styles.rowContainer}>
                                    <Text style={{ fontSize: fontSizes.s16 }}>
                                        설문 인원
                                    </Text>
                                    <TextInput
                                        value={participationGoal}
                                        onChangeText={setParticipationGoal}
                                        keyboardType="number-pad"
                                        placeholder="10"
                                        style={[
                                            {
                                                fontSize: fontSizes.m20,
                                                color: colors.gray2,
                                                borderColor: colors.gray3,
                                                borderWidth: 1,
                                                borderRadius: 6,
                                                minWidth: 50,
                                                textAlign: "right",
                                                paddingRight: 6,
                                                backgroundColor: "white",
                                            },
                                        ]}
                                    />
                                </View>

                                <View style={styles.rowContainer}>
                                    <Text style={{ fontSize: fontSizes.s16 }}>
                                        예상 소요 시간
                                    </Text>
                                    <Text style={{ fontSize: fontSizes.s16 }}>
                                        {" "}
                                        {expectedTimeInMin} 분{" "}
                                    </Text>
                                </View>
                                <View style={styles.rowContainer}>
                                    <Text style={{ fontSize: fontSizes.s16 }}>
                                        가격
                                    </Text>
                                    <Text style={{ fontSize: fontSizes.s16 }}>
                                        {price} 원
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        {
                                            alignItems: "center",
                                            flexDirection: "column",
                                        },
                                    ]}
                                >
                                    <CostSelectionContainer
                                        initialIndex={isFree ? 0 : 1}
                                        toggleFreeState={setIsFree}
                                    />
                                </View>
                            </View>
                        </View>
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
export default CostGuideModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 20,
        overflow: "hidden",
    },
    modalContent: {
        flexGrow: 1,
        marginVertical: 240, // 전체 화면 관리
        marginHorizontal: 40,
        backgroundColor: colors.background,
        borderRadius: 10,
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
        flex: 1,
        gap: 30,
        marginHorizontal: 20,
    },
});
