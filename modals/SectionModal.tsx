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
import TextButton from "../components/TextButton";

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
        // <View style={{ alignItems: "center" }} key={index}>
        <View key={index}>
            {/* <Button
                // key={index}
                title={`Section ${index + 1}`} // 보이는 인덱스 : 1,2,3
                onPress={() => {
                    onSelection(index); // 실제 인덱스: 0, 1, 2
                    onClose();
                }}
            /> */}
            <TextButton
                title={`Section ${index + 1}`}
                onPress={() => {
                    onSelection(index);
                    onClose();
                }}
                backgroundStyle={{
                    height: 50,
                }}
                textStyle={{
                    fontSize: 18,
                    textAlign: "left",
                    paddingLeft: 12,
                    color: "#007AFF",
                }}
                hasShadow={false}
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
                        {sections}
                        <Separator />
                        {/* <Button
                            title="Add Section"
                            onPress={() => {
                                onAdd();
                                onClose();
                            }}
                        /> */}
                        <TextButton
                            title={"Add Section"}
                            onPress={() => {
                                onAdd();
                                onClose();
                            }}
                            backgroundStyle={{
                                height: 50,
                            }}
                            textStyle={{
                                fontSize: 18,
                                textAlign: "left",
                                paddingLeft: 12,
                                color: "#007AFF",
                            }}
                            hasShadow={false}
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
