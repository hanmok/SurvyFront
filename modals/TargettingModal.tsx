import {
    Button,
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
import { useState } from "react";
import AgeSlider from "../components/posting/AgeSlider";
import GenderSelection from "../components/posting/GenderSelection";
import { Entypo } from "@expo/vector-icons";
import Spacer from "../components/Spacer";

interface TargettingModalProps {
    // isCreatingQuestionModalVisible: boolean;
    onClose: () => void;
    isTargettingModalVisible: boolean;
    onConfirm: () => void;
    // onAdd: (question: Question) => void;
    // position: number;
}

const TargettingModal: React.FC<TargettingModalProps> = ({
    onClose,
    onConfirm,
    isTargettingModalVisible,
}) => {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    const [satisfied, setSatisfied] = useState(false);

    return (
        <Modal transparent={true} visible={isTargettingModalVisible}>
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* 나이 */}
                        <AgeSlider />

                        {/* 성별 */}
                        <View>
                            <Text
                                style={{
                                    marginBottom: 20,
                                    // alignSelf: "center",
                                    fontSize: fontSizes.m20,
                                }}
                            >
                                성별
                            </Text>
                            <GenderSelection />
                        </View>
                        {/* 지역 */}
                        <View>
                            <Text style={{ fontSize: fontSizes.m20 }}>
                                지역
                            </Text>
                        </View>
                        <View>
                            <Text
                                style={{
                                    fontSize: fontSizes.m20,
                                    // alignSelf: "center",
                                    marginBottom: 10,
                                }}
                            >
                                Category
                            </Text>
                            {/* Horizontal Search*/}
                            <View style={{ flexDirection: "row" }}>
                                <TextInput
                                    style={{
                                        borderRadius: 10,
                                        backgroundColor: "white",
                                        overflow: "hidden",
                                        borderColor: "black",
                                        borderWidth: 1,
                                        width: 200,
                                    }}
                                />
                                <Spacer size={10} />
                                <Entypo
                                    name="magnifying-glass"
                                    size={24}
                                    color="black"
                                />
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
                                title="다음"
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
export default TargettingModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
        flexGrow: 1,
        marginVertical: 60, // 전체 화면 관리
        marginHorizontal: 20,
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 20,
        // gap: 10,
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
        // borderWidth: 1,
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
    },
    inactivatedStyle: {
        backgroundColor: colors.gray2,
    },
    activatedStyle: {
        backgroundColor: colors.white,
    },
});
