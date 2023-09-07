import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import TextButton from "../TextButton";
import { fontSizes } from "../../utils/sizes";
import ImageButton from "../ImageButton";

const DynamicTextInputs = ({ dynamicInputValues, setDynamicInputValues }) => {
    const [inputValues, setInputValues] = useState([""]); // 초기에 빈 문자열 하나를 가진 배열

    const handleAddInput = () => {
        setInputValues([...inputValues, ""]); // 새로운 빈 문자열을 배열에 추가
    };

    const handleInputChange = (text, index) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = text; // 해당 인덱스의 입력 값을 업데이트
        setInputValues(newInputValues);
        console.log(`inputValues: ${inputValues}`);
    };

    // 컴포넌트가 언마운트 되는 시점에 업데이트 되지 않음.

    // useEffect(() => {
    //     return () => {
    //         setDynamicInputValues(inputValues);
    //         console.log(`from dynamicTextInputs, ${inputValues}`);
    //     };
    // }, [dynamicInputValues]);

    // dynamicInputValues 값이 변경될 때마다 부모 컴포넌트로 전달

    useEffect(() => {
        setDynamicInputValues(inputValues);
    }, [inputValues]);

    useEffect(() => {
        setInputValues(dynamicInputValues);
    }, []);

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
                        // onSubmitEditing={text => handleInputChange(text, index)}
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

export default DynamicTextInputs;
