import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import TextButton from "../TextButton";
import { fontSizes } from "../../utils/sizes";
import ImageButton from "../ImageButton";

const DynamicTextInputsForCreation = ({
    dynamicInputValues,
    setDynamicInputValues,
}) => {
    const [inputValues, setInputValues] = useState([""]);

    useEffect(() => {
        console.log(`dynamicTextInput renders, ${dynamicInputValues}`);
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
                        onSubmitEditing={() => {
                            console.log(`index: ${index}`); // 첫번째꺼 0
                            if (index + 1 === inputValues.length) {
                                handleAddInput();
                            }
                        }}
                    />
                    <ImageButton
                        // img={require("../assets/minusIcon.png")}
                        // img={require('../../')}
                        img={require("../../assets/minusIcon.png")}
                        onPress={() => handleRemoveInput(index)}
                        backgroundStyle={{ marginLeft: 10 }}
                    />
                </View>
            ))}
            <Button title="Add Input" onPress={handleAddInput} />
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
});

export default DynamicTextInputsForCreation;
