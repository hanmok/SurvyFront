import React, { useEffect, useRef, useState } from "react";
import {
    View,
    TextInput,
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
    // const inputRefs = useRef([React.createRef()]);
    // const inputRefs = useRef([React.createRef()]);
    const inputRefs = useRef([]);
    // const inputRefs = useRef<Array<React.RefObject<TextInput>>>([
    //     React.createRef(),
    // ]);

    useEffect(() => {
        setDynamicInputValues(inputValues);
    }, [inputValues]);

    useEffect(() => {
        setInputValues(dynamicInputValues);
    }, []);

    // useEffect(() => {
    //     const newRef = React.createRef();

    //     // inputRefs.current.push(React.createRef());

    //     // inputRefs.current[inputValues.length];
    //     inputRefs.current.push(newRef);
    // }, []);

    const handleAddInput = () => {
        setInputValues([...inputValues, ""]); // 새로운 빈 문자열을 배열에 추가
        // const newRef = React.createRef();
        // inputRefs.current.push(newRef);
        inputRefs.current.push(React.createRef());
    };
    // 랜더링 되기 전에 focus 가 호출되므로 동작하지 않는다.
    // 따라서, TextInput 이 마운트 된 후에 focus 를 호출해야한다.
    // 그렇게 하기 위해서는 'useEffect' 훅을 사용하여 비동기적으로 처리해야한다.

    // useEffect(() => {
    //     if (inputRefs.current.length < inputValues.length) {
    //         const newRef = React.createRef();
    //         inputRefs.current.push(newRef);
    //     }
    //     console.log(
    //         `num of inputs: ${inputValues.length}, num of refs: ${inputRefs.current.length}`
    //     );
    //     if (
    //         inputRefs.current.length > 0 &&
    //         inputRefs.current[inputRefs.current.length - 1].current
    //     ) {
    //         inputRefs.current[inputRefs.current.length - 1].current.focus();
    //         console.log(`focused index: ${inputRefs.current.length - 1}`);
    //     }
    // }, [inputRefs.current.length]);

    // useEffect(() => {
    //     const newRef = React.createRef();
    //     inputRefs.current.push(newRef);
    // }, []);

    useEffect(() => {
        // if (inputValues.length !== inputRefs.current.length) {
        //     const newRef = React.createRef();
        //     inputRefs.current.push(newRef);
        // }

        const lastInputRef = inputRefs.current[inputRefs.current.length - 1];
        if (lastInputRef && lastInputRef.current) {
            lastInputRef.current.focus();
        }
    }, [inputValues.length]);

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
        inputRefs.current.splice(index, 1); // 해당 인덱스의 ref 도 제거.
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
                {inputValues.map((value, index) => (
                    <View key={index} style={styles.inputContainer}>
                        <TextInput
                            key={keys[index]}
                            ref={inputRefs.current[index]} // ref 연결
                            placeholder={`옵션 ${index + 1}`}
                            style={styles.input}
                            value={value}
                            onChangeText={text =>
                                handleInputChange(text, index)
                            }
                            autoComplete="off"
                            autoCorrect={false}
                            blurOnSubmit={false}
                            onSubmitEditing={() => {
                                console.log(`index: ${index}`); // 첫번째꺼 0

                                // if (index + 1 === inputValues.length) {
                                handleAddInput();

                                // }
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
                    onPress={() => {
                        handleAddInput();
                    }}
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

export default DynamicTextInputsForCreation;
