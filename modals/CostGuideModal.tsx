import {
    FlatList,
    Keyboard,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { fontSizes } from "../utils/sizes";
import SelectableTextButton from "../components/SelectableTextButton";
import TextButton from "../components/TextButton";
import { colors } from "../utils/colors";
import { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { getAllGenres } from "../API/GenreAPI";
import { log, logObject } from "../utils/Log";
import { screenWidth } from "../utils/ScreenSize";

interface CostGuideModalProps {
    onClose: () => void;
    onConfirm: () => void;
    isCostGuideModalVisible: boolean;
}

const CostGuideModal: React.FC<CostGuideModalProps> = ({
    onClose,
    onConfirm,
    isCostGuideModalVisible,
}) => {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const [participationGoal, setParticipationGoal] = useState(undefined);
    const [satisfied, setSatisfied] = useState(false);

    const toggleCostGuideSelection = () => {};

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
                            }}
                        >
                            Cost Guide
                        </Text>

                        <View style={{ height: 300, width: 300 }}>
                            <View style={styles.mainContent}>
                                <View style={styles.rowContainer}>
                                    <Text>설문 인원</Text>
                                    <TextInput
                                        value={participationGoal}
                                        onChangeText={setParticipationGoal}
                                        keyboardType="number-pad"
                                        placeholder="10"
                                    />
                                </View>
                                <View style={styles.rowContainer}>
                                    <Text>예상 소요 시간</Text>
                                    <Text> 5분 </Text>
                                </View>
                                <View style={styles.rowContainer}>
                                    <Text>가격</Text>
                                    <Text>
                                        {parseInt(participationGoal || "10") *
                                            5 *
                                            300}
                                        원
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.bottomContainer}>
                            <TextButton
                                title="취소"
                                textStyle={styles.bottomTextStyle}
                                onPress={onClose}
                                backgroundStyle={
                                    styles.bottomLeftButtonTextContainer
                                }
                            />
                            <TextButton
                                onPress={onConfirm}
                                title="확인"
                                backgroundStyle={
                                    satisfied
                                        ? [
                                              styles.bottomRightButtonTextContainer,
                                              styles.activatedStyle,
                                          ]
                                        : [
                                              styles.bottomRightButtonTextContainer,
                                              styles.inactivatedStyle,
                                          ]
                                }
                                textStyle={styles.bottomTextStyle}
                            />
                        </View>
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
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 20,
        overflow: "hidden",
    },
    modalContent: {
        flexGrow: 1,
        marginVertical: 240, // 전체 화면 관리
        marginHorizontal: 40,
        backgroundColor: colors.gray4,
        borderRadius: 10,
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
    },
    bottomRightButtonTextContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        borderTopWidth: 1,
        height: 40,
        alignItems: "center",
        margin: 0,
        // borderRadius: 30,
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
        backgroundColor: "magenta",
        flexDirection: "column",
        // justifyContent: "flex-start",
        justifyContent: "center",
        // alignItems: "center",
        flex: 1,
        // alignItems: "stretch",
        gap: 30,
        marginHorizontal: 20,
    },
});
