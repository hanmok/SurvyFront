import {
    Button,
    Modal,
    StyleSheet,
    TouchableNativeFeedback,
    View,
} from "react-native";
import { colors } from "../utils/colors";
import { useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import React from "react";
import Separator from "../components/common/Separator";
import { log } from "../utils/Log";

interface SectionModalProps {
    onClose: () => void;
    isSectionModalVisible: boolean;
    numOfSections: number;
    onAdd: () => void;
    onSelection: (number) => void;
}

const SectionModal: React.FC<SectionModalProps> = ({
    onClose,
    isSectionModalVisible,
    numOfSections,
    onAdd,
    onSelection,
}) => {
    useEffect(() => {
        console.log(`current numOfSections: ${numOfSections}`);
    }, [numOfSections]);

    const sections = Array.from({ length: numOfSections }, (_, index) => (
        <View style={{ alignItems: "center" }}>
            <Button
                key={index}
                title={`Section ${index + 1}`} // 보이는 인덱스 : 1,2,3
                onPress={() => {
                    onSelection(index); // 실제 인덱스: 0, 1, 2
                    onClose();
                }}
            />
            <Separator />
        </View>
    ));

    return (
        <Modal
            transparent={true}
            visible={isSectionModalVisible}
            animationType="slide"
        >
            <TouchableNativeFeedback
                style={styles.wholeContainer}
                onPress={() => {
                    log("hi");
                    onClose();
                }}
            >
                <View style={styles.wholeContainer}>
                    <View style={styles.mainContainer}>
                        <Feather
                            name="x"
                            size={30}
                            color="black"
                            style={{ alignSelf: "flex-end", marginRight: 10 }}
                            onPress={onClose}
                        />
                        {sections}
                        <Separator />
                        <Button
                            title="Add Section"
                            onPress={() => {
                                onAdd();
                                onClose();
                            }}
                        />
                    </View>
                </View>
            </TouchableNativeFeedback>
        </Modal>
    );
};

export default SectionModal;

const styles = StyleSheet.create({
    wholeContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: colors.bottomModalBackground,
    },
    mainContainer: {
        backgroundColor: "white",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: 50,
        paddingTop: 20,
        paddingHorizontal: 12,
    },
});
