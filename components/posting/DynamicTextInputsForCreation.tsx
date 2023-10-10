import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import TextButton from "../TextButton";
import { fontSizes } from "../../utils/sizes";
import ImageButton from "../ImageButton";
import { colors } from "../../utils/colors";

const DynamicTextInputsForCreation = ({
    dynamicInputValues,
    setDynamicInputValues,
    keys,
    isExtraOptionEnabled,
}) => {
    const [inputValues, setInputValues] = useState([""]);

    useEffect(() => {
        // console.log(`dynamicTextInput renders, ${dynamicInputValues}`);
    }, [dynamicInputValues]);

    useEffect(() => {
        setDynamicInputValues(inputValues);
    }, [inputValues]);

    useEffect(() => {
        setInputValues(dynamicInputValues);
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

    const handleDismissKeyboard = () => {
        console.log("dismiss keyboard called");
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
            <View style={styles.container}>
                {inputValues.map((value, index) => (
                    <View key={index} style={styles.inputContainer}>
                        <TextInput
                            key={keys[index]}
                            placeholder={`옵션 ${index + 1}`}
                            style={styles.input}
                            value={value}
                            onChangeText={text =>
                                handleInputChange(text, index)
                            }
                            autoComplete="off"
                            autoCorrect={false}
                            onSubmitEditing={() => {
                                console.log(`index: ${index}`); // 첫번째꺼 0
                                if (index + 1 === inputValues.length) {
                                    handleAddInput();
                                }
                            }}
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
                        backgroundStyle={{
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: 5,
                            padding: 10,
                            marginBottom: 10,
                        }}
                        textStyle={{ color: colors.gray2 }}
                    />
                )}

                <TextButton
                    title="Add Input"
                    backgroundStyle={{
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: colors.gray4,
                        overflow: "hidden",
                        height: 30,
                    }}
                    textStyle={{
                        color: colors.buttonText,
                        textAlign: "center",
                        fontSize: fontSizes.m20,
                    }}
                    onPress={handleAddInput}
                />
            </View>
        </TouchableWithoutFeedback>
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
});

export default DynamicTextInputsForCreation;
