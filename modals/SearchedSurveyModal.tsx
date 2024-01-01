import {
    Modal,
    StyleSheet,
    View,
    Text,
    Keyboard,
    TouchableOpacity,
    Animated,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { colors } from "../utils/colors";
import { fontSizes } from "../utils/sizes";
import { screenHeight, screenWidth } from "../utils/ScreenSize";
import { useContext, useEffect, useRef, useState } from "react";
import { BottomButtonContainer } from "../components/common/BottomButtonContainer";
import { Survey } from "../interfaces/Survey";
import { useCustomContext } from "../features/context/CustomContext";
import { convertReward, convertToMin } from "../utils/numbers";

interface SearhchedSurveyModalProps {
    onConfirmAction: () => void;
    confirmText: string;
    onClose: () => void;
    // title: string;
    isModalVisible: boolean;
    searchedSurvey: Survey | null;
}

export const SearhchedSurveyModal: React.FC<SearhchedSurveyModalProps> = ({
    onConfirmAction: onSecondSelection,
    // title,
    isModalVisible,
    confirmText,
    onClose,
    searchedSurvey,
}) => {
    const { updateParticipatingSurveyId } = useCustomContext();

    return (
        <Modal transparent={true} visible={isModalVisible}>
            <TouchableOpacity
                style={styles.modalContainer}
                onPress={() => {
                    Keyboard.dismiss();
                }}
                activeOpacity={1}
            >
                <View style={styles.modalContent}>
                    {/* Title */}
                    {/* <View style={{ marginTop: 30, alignItems: "center" }}>
                            <Text style={{ fontSize: 22, fontWeight: "800" }}>
                                {title}
                            </Text>
                        </View> */}
                    {/* Search */}
                    <View
                        style={{
                            alignItems: "center",
                        }}
                    >
                        <View>
                            <Text>{searchedSurvey?.title}</Text>
                            <Text>
                                {convertToMin(
                                    searchedSurvey?.expectedTimeInSec
                                )}{" "}
                                분
                            </Text>
                            <Text>{convertReward(searchedSurvey?.reward)}</Text>
                        </View>
                    </View>
                    <BottomButtonContainer
                        rightTitle={confirmText}
                        leftAction={() => {
                            onClose();
                        }}
                        rightAction={() => {
                            // navigation 이 없는데?
                            onSecondSelection();
                            onClose();
                        }}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        width: screenWidth,
        height: screenHeight,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        borderWidth: 1,
        borderColor: colors.black,
        borderRadius: 20,
        overflow: "hidden",
        justifyContent: "center",
    },
    modalContent: {
        height: 240,
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
        backgroundColor: colors.white,
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
    searchInput: {
        fontSize: 20,
        textAlignVertical: "center",
        paddingLeft: 10,
    },
    searchContainer: {
        borderWidth: 1,
        borderRadius: 6,
        width: 200,
        height: 40,
        justifyContent: "center",
    },
});
