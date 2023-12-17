import React from "react";
import { Button, Modal, StyleSheet, View } from "react-native";
import Separator from "../components/common/Separator";
import { colors } from "../utils/colors";
// import TouchableNativeFeedback from "react-native-gesture-handler/lib/typescript/components/touchables/TouchableNativeFeedback.android";
import { TouchableNativeFeedback } from "react-native";
import TextButton from "../components/TextButton";

interface PostingMenuModalProps {
    isMenuModalVisible: boolean;
    onClose: () => void;
    onInitialize: () => void;
    onInitializeCurrent: () => void;
    onSave: () => void;
}

export const PostingMenuModal: React.FC<PostingMenuModalProps> = ({
    isMenuModalVisible,
    onClose,
    onInitialize,
    onInitializeCurrent,
    onSave,
}) => {
    return (
        <Modal
            transparent={true}
            visible={isMenuModalVisible}
            animationType="slide"
        >
            <TouchableNativeFeedback
                style={styles.wholeContainer}
                onPress={() => {
                    console.log("hi");
                    onClose();
                }}
            >
                <View style={styles.wholeContainer}>
                    <View style={styles.mainContainer}>
                        {/* <Separator /> */}

                        <TextButton
                            title={"전체 초기화"}
                            onPress={() => {
                                onInitialize();
                                onClose();
                            }}
                            backgroundStyle={{
                                height: 50,
                            }}
                            textStyle={{
                                fontSize: 16,
                                textAlign: "left",
                                paddingLeft: 12,
                            }}
                            hasShadow={false}
                        />

                        <Separator />
                        <TextButton
                            title={"현재 섹션 초기화"}
                            onPress={() => {
                                onInitializeCurrent();
                                onClose();
                            }}
                            backgroundStyle={{
                                height: 50,
                            }}
                            textStyle={{
                                fontSize: 16,
                                textAlign: "left",
                                paddingLeft: 12,
                            }}
                            hasShadow={false}
                        />
                        {/* <Button
                            title="현재 섹션 초기화"
                            onPress={() => {
                                // onAdd();
                                // onClose();
                                // onInitialize()
                                onInitializeCurrent();
								onClose()
								
                            }}
							
                        /> */}
                        <Separator />
                        <TextButton
                            title={"저장"}
                            onPress={() => {
                                onSave();
                                onClose();
                            }}
                            backgroundStyle={{
                                height: 50,
                            }}
                            textStyle={{
                                fontSize: 16,
                                textAlign: "left",
                                paddingLeft: 12,
                            }}
                            hasShadow={false}
                        />
                        {/* <Button
                            title="저장"
                            onPress={() => {
                                onSave();
                            }}
                        /> */}
                    </View>
                </View>
            </TouchableNativeFeedback>
        </Modal>
    );
};

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
