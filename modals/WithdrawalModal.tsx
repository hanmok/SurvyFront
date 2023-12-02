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
import { modalStyles } from "../utils/CommonStyles";
import { BottomButtonContainer } from "../components/common/BottomButtonContainer";
import Spacer from "../components/common/Spacer";
import { createWithdrawal, patchWithdrawal } from "../API/WithdrawalAPI";
import { useCustomContext } from "../features/context/CustomContext";
import { Withdrawal } from "../interfaces/Withdrawal";
import showToast from "../components/common/toast/Toast";
import showAdminToast from "../components/common/toast/showAdminToast";

interface WithdrawalModalProps {
    isModalVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    totalPoint: number;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
    isModalVisible,
    onClose,
    onConfirm,
    totalPoint,
}) => {
    const [bankAccount, setBankAccount] = useState("");
    const [username, setUserName] = useState("");
    const [bankName, setBankName] = useState("");

    const [amount, setAmount] = useState(0);
    const translateY = useRef(new Animated.Value(0)).current;
    const [satisfied, setSatisfied] = useState(false);

    useEffect(() => {
        setSatisfied(
            bankAccount !== "" &&
                username !== "" &&
                amount !== 0 &&
                amount <= totalPoint &&
                bankName !== ""
        );
    }, [bankAccount, username, amount, bankName]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            "keyboardWillShow",
            () => {
                Animated.timing(translateY, {
                    toValue: -100,
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

    const { accessToken, userId, updateLoadingStatus } = useCustomContext();
    const [confirmTapped, setConfirmTapped] = useState(false);

    const handleConfirm = () => {
        setConfirmTapped(true);
    };

    const handleWithdrawal = async () => {
        updateLoadingStatus(true);

        try {
            const withdrawal: Withdrawal = await createWithdrawal(
                accessToken,
                userId,
                amount
            );
            await patchWithdrawal(accessToken, withdrawal.id);
            showToast("success", `${amount} 원이 출금되었습니다.`);
            onConfirm();
        } catch (error) {
            showAdminToast("error", error);
        } finally {
            updateLoadingStatus(false);
        }
    };

    useEffect(() => {
        if (confirmTapped) {
            handleWithdrawal();
        }
    }, [confirmTapped, amount]);

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
                        {/* Title */}
                        <View
                            style={{
                                marginTop: 30,
                                alignItems: "center",
                                marginHorizontal: 30,
                            }}
                        >
                            <Text style={{ fontSize: 22, fontWeight: "800" }}>
                                출금
                            </Text>
                            <Spacer size={10} />
                            <Text>
                                계좌와 이름이 일치하지 않을 시 출금이 정상적으로
                                되지 않습니다.
                            </Text>
                            <Spacer size={10} />
                        </View>
                        <Spacer size={20} />
                        <View style={{ width: 300, gap: 6 }}>
                            {/* 이름 입력 */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text>이름</Text>
                                <Spacer size={10} />
                                <View style={styles.rowContainer}>
                                    <Spacer size={10} />
                                    <TextInput
                                        style={styles.searchInput}
                                        keyboardType="default"
                                        value={username}
                                        onChangeText={setUserName}
                                    />
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text>계좌번호</Text>
                                <Spacer size={10} />
                                <View style={styles.rowContainer}>
                                    <Spacer size={10} />
                                    <TextInput
                                        style={styles.searchInput}
                                        keyboardType="number-pad"
                                        value={bankAccount}
                                        onChangeText={setBankAccount}
                                    />
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text>은행 명</Text>
                                <Spacer size={10} />
                                <View style={styles.rowContainer}>
                                    <Spacer size={10} />
                                    <TextInput
                                        style={styles.searchInput}
                                        keyboardType="default"
                                        value={bankName}
                                        onChangeText={setBankName}
                                    />
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text>인출할 포인트</Text>
                                <Spacer size={10} />
                                <View style={styles.rowContainer}>
                                    <Spacer size={10} />
                                    <TextInput
                                        style={styles.searchInput}
                                        keyboardType="number-pad"
                                        value={`${amount}`}
                                        placeholder=""
                                        onChangeText={amt => {
                                            setAmount(Number(amt));
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={{ alignSelf: "flex-end" }}>
                                <Text>{totalPoint} P 인출 가능</Text>
                            </View>
                        </View>

                        <BottomButtonContainer
                            leftAction={onClose}
                            rightTitle="출금"
                            rightAction={() => {
                                // setConfirmTapped(true);
                                handleConfirm();
                            }}
                            satisfied={satisfied}
                        />
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
        height: 440,
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
    rowContainer: {
        borderWidth: 1,
        borderRadius: 6,
        width: 200,
        height: 40,

        // justifyContent: "center",
        // alignItems: "center",
        // alignItems: "center",
        // alignSelf: "center",
    },
});
