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
import TextButton from "../components/TextButton";
import { useEffect, useRef, useState } from "react";

interface SearhchingModalProps {
    cancelText: string;
    onSearchAction: () => void;
    searchText: string;
    onClose: () => void;
    title: string;
    isModalVisible: boolean;
    searchingCode: string;
    setSearchingCode: (text) => void;
}

export const SearchingModal: React.FC<SearhchingModalProps> = ({
    onSearchAction: onSecondSelection,
    title,
    isModalVisible,
    searchText: secondSelectionText,
    cancelText,
    onClose,
    searchingCode,
    setSearchingCode,
}) => {
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            "keyboardWillShow",
            () => {
                Animated.timing(translateY, {
                    toValue: -200,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            "keyboardWillHide",
            () => {
                // Animate modal content when the keyboard hides
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [translateY]);

    return (
        <Modal transparent={true} visible={isModalVisible}>
            <Animated.View style={{ transform: [{ translateY: translateY }] }}>
                <TouchableOpacity
                    style={styles.modalContainer}
                    onPress={() => {
                        Keyboard.dismiss();
                    }}
                    activeOpacity={1}
                >
                    <View style={styles.modalContent}>
                        <View style={{ marginTop: 30, alignItems: "center" }}>
                            <Text style={{ fontSize: 22, fontWeight: "800" }}>
                                {title}
                            </Text>
                        </View>
                        <View
                            style={{
                                alignItems: "center",
                            }}
                        >
                            <View
                                style={{
                                    borderWidth: 1,
                                    borderRadius: 6,
                                    width: 200,
                                    height: 40,
                                    justifyContent: "center",
                                }}
                            >
                                <TextInput
                                    style={{
                                        fontSize: 20,
                                        textAlignVertical: "center",
                                        paddingLeft: 10,
                                    }}
                                    autoCapitalize="characters"
                                    keyboardType="default"
                                    value={searchingCode}
                                    onChangeText={setSearchingCode}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                height: 60,
                                alignSelf: "stretch",
                                marginBottom: 10,
                                marginHorizontal: 10,
                            }}
                        >
                            <TextButton
                                title={cancelText}
                                onPress={() => {
                                    onClose();
                                }}
                                backgroundStyle={{
                                    flex: 0.5,
                                    backgroundColor: "white",
                                    margin: 6,
                                    borderRadius: 6,
                                }}
                            />
                            <TextButton
                                title={secondSelectionText}
                                onPress={() => {
                                    onSecondSelection();
                                    onClose();
                                }}
                                backgroundStyle={{
                                    backgroundColor: colors.deeperMainColor,
                                    flex: 0.5,
                                    margin: 6,
                                    borderRadius: 6,
                                }}
                                textStyle={{ color: "white" }}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        width: screenWidth,
        height: screenHeight,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        borderWidth: 1,
        borderColor: "black",
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