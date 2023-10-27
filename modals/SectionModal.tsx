import { Button, Modal, StyleSheet, Text, View } from "react-native";
import { colors } from "../utils/colors";
import { useEffect } from "react";
import { screenWidth } from "../utils/ScreenSize";
import { Feather } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

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
    const toggleVisible = () => {
        onClose();
    };

    useEffect(() => {
        console.log(`current numOfSections: ${numOfSections}`);
    }, [numOfSections]);

    const sections = Array.from({ length: numOfSections }, (_, index) => (
        <View style={{ alignItems: "center" }}>
            <Button
                key={index}
                title={`Section ${index + 1}`}
                onPress={() => {
                    onSelection(index + 1);
                    onClose();
                }}
            />
            <View
                style={{
                    backgroundColor: colors.gray5,
                    width: screenWidth - 100,
                    height: 1,
                }}
            />
        </View>
    ));

    return (
        // <TouchableWithoutFeedback
        //     onPress={onClose}
        //     style={{ backgroundColor: "magenta" }}
        // >
        <Modal
            transparent={true}
            visible={isSectionModalVisible}
            animationType="slide"
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
                    <Button title="Add Section" onPress={onAdd} />
                </View>
            </View>
        </Modal>
    );
};

export default SectionModal;

const styles = StyleSheet.create({
    wholeContainer: {
        flex: 1,
        justifyContent: "flex-end",
        // backgroundColor: colors.modalBackground,
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
