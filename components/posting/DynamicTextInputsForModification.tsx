import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import TextButton from "../TextButton";
import { fontSizes } from "../../utils/sizes";
import ImageButton from "../ImageButton";
import { log, logObject } from "../../utils/Log";
import { colors } from "../../utils/colors";
const DynamicTextInputsForModification = ({
    parentInputValues,
    setParentInputValues,
    isModifyingModalVisible,
    setSecondTexts,
    isExtraOptionEnabled,
}) => {
    const [inputValues, setInputValues] = useState([""]);

    useEffect(() => {
        setParentInputValues(inputValues);
    }, [isModifyingModalVisible]);

    useEffect(() => {
        setSecondTexts(inputValues);
    }, [inputValues]);

    useEffect(() => {
        setInputValues(parentInputValues);
    }, [parentInputValues]);

    useEffect(() => {
        return () => {
            logObject(`current input Values: `, inputValues);
            setParentInputValues(inputValues);
        };
    }, []);

    const handleAddInput = () => {
        setInputValues([...inputValues, ""]); // 새로운 빈 문자열을 배열에 추가
    };

    const handleInputChange = (text, index) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = text; // 해당 인덱스의 입력 값을 업데이트
        setInputValues(newInputValues);
        console.log(`inputValues: ${inputValues}`);
    };

    const handleRemoveInput = index => {
        const newInputValues = [...inputValues];
        newInputValues.splice(index, 1); // 해당 인덱스의 입력 값을 제거
        setInputValues(newInputValues);
    };

    return (
        <View style={styles.container}>
            {inputValues.map((value, index) => (
                <View key={index} style={styles.inputContainer}>
                    <TextInput
                        placeholder={`옵션 ${index + 1}`}
                        style={styles.input}
                        value={value}
                        onChangeText={text => handleInputChange(text, index)}
                        autoComplete="off"
                        autoCorrect={false}
                    />
                    <ImageButton
                        img={require("../../assets/minusIcon.png")}
                        onPress={() => handleRemoveInput(index)}
                        backgroundStyle={{ marginLeft: 10 }}
                    />
                </View>
            ))}
            {isExtraOptionEnabled && (
                <TextButton
                    title="기타"
                    onPress={() => {}}
                    backgroundStyle={styles.extraBtnBG}
                    hasShadow={false}
                    textStyle={styles.extraBtnText}
                    isEnabled={false}
                />
            )}
            <TextButton
                title="Add Input"
                backgroundStyle={styles.addInputBG}
                textStyle={styles.addInputText}
                onPress={handleAddInput}
                isEnabled={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        justifyContent: "space-around",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
    },
    extraBtnBG: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    extraBtnText: {
        color: colors.gray3,
        fontSize: fontSizes.s16,
        fontWeight: "400",
        textAlign: "left",
    },
    addInputBG: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray4,
        overflow: "hidden",
        height: 30,
        backgroundColor: colors.white,
    },
    addInputText: {
        color: colors.buttonText,
        textAlign: "center",
        fontSize: fontSizes.m20,
        overflow: "hidden",
    },
});

export default DynamicTextInputsForModification;
