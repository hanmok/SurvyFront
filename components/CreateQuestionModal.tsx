// CustomModal.tsx

import React, { useState } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from "react-native";
import TextButton from "./TextButton";
import { fontSizes } from "../utils/sizes";
import QuestionTypeSelectionBox from "./QuestionTypeSelectionBox";
import QuestionTypeSelectionBoxContainer from "./QuestionTypeSelectionBoxContainer";

interface CreateQuestionModalProps {
    visible: boolean;
    onClose: () => void;
}

const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({
    visible,
    onClose,
}) => {
    const [questionTitle, setQuestionTitle] = useState("");
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TextInput
                        placeholder="질문 ?? "
                        style={styles.questionTextStyle}
                        value={questionTitle}
                        onChangeText={setQuestionTitle}
                    />
                    <QuestionTypeSelectionBoxContainer />
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.bottomButtonContainer}
                        >
                            <Text style={styles.bottomTextStyle}>취소</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.bottomButtonContainer}
                        >
                            <Text style={styles.bottomTextStyle}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    questionTextStyle: {
        marginTop: 80,
        backgroundColor: "magenta",
        textAlign: "center",
        fontSize: fontSizes.m20,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        flexGrow: 1,
        marginVertical: 40,
        marginHorizontal: 20,
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        justifyContent: "space-between",
    },
    bottomButtonContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        borderTopColor: "magenta",
        borderWidth: 1,
        height: 40,
        alignItems: "center",
        margin: 0,
    },
    bottomTextStyle: {
        textAlign: "center",
        fontSize: fontSizes.s16,
    },
});

export default CreateQuestionModal;
