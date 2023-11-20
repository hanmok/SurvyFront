import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, Keyboard } from "react-native";
import { fontSizes, marginSizes } from "../utils/sizes";
import ImageButton from "./ImageButton";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { logObject } from "../utils/Log";
import { QuestionTypeIdEnum } from "../enums/QuestionTypeEnum";

interface SelectableOptionProps {
    id: number;
    questionId: number;
    position: number;
    value: string;
    questionTypeId: string;
    onPress?: () => void;
    handleUserInput?: (text: string) => void;
    questionIndex: number;
    isExtra: number;
}

const SelectableOptionBox: React.FC<SelectableOptionProps> = ({
    id,
    questionId,
    position,
    value,
    // questionTypeId,
    questionTypeId,
    onPress,
    handleUserInput,
    questionIndex,
    isExtra,
}) => {
    useEffect(() => {
        console.log("selectableOption value:", value);
        console.log("question type id:", questionTypeId);
    }, []);

    const textInputRef = useRef(null);

    const [userInput, setUserInput] = useState("");

    const selectedIndexIds = useSelector((state: RootState) => {
        return state.selector.selectedOptionIds;
    });

    let selectableOptionComponent;

    if (!selectedIndexIds || !selectedIndexIds[questionIndex]) {
        return <Text>Selected indexes are empty</Text>;
    }

    if (selectedIndexIds == null) {
        return <Text>selectedIndexes: null </Text>;
    }

    {
        switch (questionTypeId) {
            case `${QuestionTypeIdEnum.SingleSelection}`:
                selectableOptionComponent = selectedIndexIds[
                    questionIndex
                ].includes(id) ? (
                    // 선택된 상태
                    <View style={styles.container}>
                        <ImageButton
                            img={require("../assets/selectedSingleSelection.png")}
                            onPress={onPress}
                        />
                        {isExtra === 1 ? (
                            <View style={styles.textContainer}>
                                <TextInput
                                    placeholder="기타"
                                    value={userInput}
                                    onChangeText={setUserInput}
                                    style={styles.extraInput}
                                    onSubmitEditing={() => {
                                        console.log(
                                            `${userInput} has submitted`
                                        );
                                        logObject(
                                            `[SelectableOptionBox] submitting text`,
                                            userInput
                                        );
                                        handleUserInput(userInput);
                                    }}
                                    onEndEditing={() => {
                                        logObject(
                                            "onEndEditing, userInput",
                                            userInput
                                        );
                                        handleUserInput(userInput);
                                    }}
                                />
                            </View>
                        ) : (
                            // </View>
                            <Text style={styles.textStyle}>{value}</Text>
                        )}
                    </View>
                ) : (
                    // 선택 되어있지 않은 상태
                    <View style={styles.container}>
                        <ImageButton
                            img={require("../assets/unselectedSingleSelection.png")}
                            onPress={() => {
                                onPress();
                                // handleFocusTextInput();
                            }}
                        />
                        {isExtra === 1 ? (
                            <TextInput
                                ref={textInputRef}
                                placeholder="기타"
                                value={userInput}
                                onChangeText={setUserInput}
                                style={styles.extraInput}
                                // return 누른 후 호출되는거 확인함.
                                onSubmitEditing={() => {
                                    console.log(`${userInput} has submitted`);
                                }}
                                onFocus={() => {
                                    onPress();
                                    console.log("기타 tapped");
                                }}
                                onEndEditing={() => {
                                    logObject(
                                        "onEndEditing, userInput",
                                        userInput
                                    );
                                    handleUserInput(userInput);
                                }}
                            />
                        ) : (
                            // </View>
                            <Text style={styles.textStyle}>{value}</Text>
                        )}
                    </View>
                );
                break;

            case `${QuestionTypeIdEnum.MultipleSelection}`:
                selectableOptionComponent = selectedIndexIds[
                    questionIndex
                ].includes(id) ? (
                    // 선택 되어있는 상태
                    <View style={styles.container}>
                        <ImageButton
                            img={require("../assets/selectedMultipleSelection.png")}
                            backgroundStyle={{ justifyContent: "center" }}
                            onPress={onPress}
                        />
                        {isExtra === 1 ? (
                            <View style={styles.textContainer}>
                                <TextInput
                                    placeholder="기타"
                                    value={userInput}
                                    onChangeText={setUserInput}
                                    style={styles.extraInput}
                                    // return 누른 후 호출되는거 확인함.
                                    onSubmitEditing={() => {
                                        console.log(
                                            `${userInput} has submitted`
                                        );
                                        logObject(
                                            `[SelectableOptionBox] submitting text`,
                                            userInput
                                        );
                                        handleUserInput(userInput);
                                    }}
                                    onEndEditing={() => {
                                        logObject(
                                            "onEndEditing, userInput",
                                            userInput
                                        );
                                        handleUserInput(userInput);
                                    }}
                                />
                            </View>
                        ) : (
                            // </View>
                            <Text style={styles.textStyle}>{value}</Text>
                        )}
                    </View>
                ) : (
                    // 선택 되어있지 않은 상태
                    <View style={styles.container}>
                        <ImageButton
                            img={require("../assets/unselectedMultipleSelection.png")}
                            backgroundStyle={{ justifyContent: "center" }}
                            onPress={() => {
                                onPress();
                                // handleFocusTextInput();
                            }}
                        />
                        {isExtra === 1 ? (
                            <TextInput
                                ref={textInputRef}
                                placeholder="기타"
                                value={userInput}
                                onChangeText={setUserInput}
                                style={styles.extraInput}
                                // return 누른 후 호출되는거 확인함.
                                onSubmitEditing={() => {
                                    console.log(`${userInput} has submitted`);
                                }}
                                onFocus={() => {
                                    onPress();
                                    console.log("기타 tapped");
                                }}
                                onEndEditing={() => {
                                    logObject(
                                        "onEndEditing, userInput",
                                        userInput
                                    );
                                    handleUserInput(userInput);
                                }}
                            />
                        ) : (
                            <Text style={styles.textStyle}>{value}</Text>
                        )}
                    </View>
                );
                break;
            // default:
            // case "300":
            case `${QuestionTypeIdEnum.Essay}`:
                selectableOptionComponent = (
                    <View style={styles.textContainer}>
                        <TextInput
                            ref={textInputRef}
                            placeholder="답변을 입력해주세요."
                            // multiline
                            numberOfLines={5}
                            style={styles.textInput}
                            autoCorrect={false}
                            value={userInput}
                            onChangeText={setUserInput}
                            onSubmitEditing={() => {
                                logObject(
                                    "[SelectableOptionBox] submitting text",
                                    userInput
                                );
                                handleUserInput(userInput);
                                Keyboard.dismiss();
                            }} // 리턴 키 누를 때 호출
                            onEndEditing={() => {
                                logObject("onEndEditing, userInput", userInput);
                            }}
                            returnKeyType="done"
                        />
                    </View>
                );
                break;
            // default:
            //     throw new console.error("Question type error");
        }
    }

    return <View style={styles.container}>{selectableOptionComponent}</View>;
};

export default SelectableOptionBox;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingLeft: 8,
        alignItems: "center",
        marginTop: 8,
    },
    textStyle: {
        fontSize: fontSizes.s16,
        marginLeft: marginSizes.s12,
    },
    textContainer: {
        flex: 1,
        paddingRight: 20,
        marginHorizontal: 6,
        marginBottom: 4,
        // borderRadius: 6,
        // backgroundColor: "magenta",
        justifyContent: "center",
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
        textAlignVertical: "top", // 텍스트 상단 정렬
    },
    extraInput: {
        marginLeft: 8,
        fontSize: fontSizes.s16,
        paddingVertical: 5,
        paddingLeft: 5,
        // width: 200,
        marginHorizontal: 10,
        minWidth: 250,
        // backgroundColor: "cyan",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 6,
    },
});
