import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    NativeSyntheticEvent,
    TextInputSubmitEditingEventData,
} from "react-native";
import { fontSizes, marginSizes, paddingSizes } from "../utils/sizes";
import { Button } from "react-native";
import ImageButton from "./ImageButton";
import { useSelector } from "react-redux";
import { RootState } from "../store";
// import { QuestionTypeEnum } from "../enums/QuestionTypeEnum";
import { QuestionTypeId } from "../QuestionType";
import { colors } from "../utils/colors";

interface SelectableOptionProps {
    id: number;
    questionId: number;
    position: number;
    value: string;
    questionTypeId: number;
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

    const handleFocusTextInput = () => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };

    const [text, setText] = useState("");

    const [userInput, setUserInput] = useState("");

    const selectedIndexIds = useSelector((state: RootState) => {
        return state.selector.selectedIndexIds;
    });

    let selectableOptionComponent;

    if (!selectedIndexIds[questionIndex]) {
        return <Text>Selected indexes are empty</Text>;
    }

    if (selectedIndexIds == null) {
        return <Text>selectedIndexes: null </Text>;
    }

    {
        switch (questionTypeId) {
            case QuestionTypeId.SingleSelection:
                selectableOptionComponent = selectedIndexIds[
                    questionIndex
                ].includes(id) ? (
                    <View style={styles.container}>
                        <ImageButton
                            img={require("../assets/selectedSingleSelection.png")}
                            onPress={onPress}
                        />
                        {isExtra === 1 ? (
                            <TextInput
                                placeholder="기타"
                                value={userInput}
                                onChangeText={setUserInput}
                                style={{
                                    backgroundColor: colors.lightMainTrans,
                                    marginLeft: marginSizes.s12,
                                    fontSize: fontSizes.s16,
                                    paddingVertical: 5,
                                    paddingLeft: 5,
                                    width: 200,
                                }}
                                // return 누른 후 호출되는거 확인함.
                                onSubmitEditing={() => {
                                    console.log(`${userInput} has submitted`);
                                }}
                            />
                        ) : (
                            // </View>
                            <Text style={styles.textStyle}>{value}</Text>
                        )}
                    </View>
                ) : (
                    <View style={styles.container}>
                        <ImageButton
                            img={require("../assets/unselectedSingleSelection.png")}
                            onPress={onPress}
                        />
                        <Text style={styles.textStyle}>{value}</Text>
                    </View>
                );
                break;

            case QuestionTypeId.MultipleSelection:
                selectableOptionComponent = selectedIndexIds[
                    questionIndex
                ].includes(id) ? (
                    <View style={styles.container}>
                        <ImageButton
                            img={require("../assets/selectedMultipleSelection.png")}
                            backgroundStyle={{ justifyContent: "center" }}
                            onPress={onPress}
                        />
                        {isExtra === 1 ? (
                            <TextInput
                                placeholder="기타"
                                value={userInput}
                                onChangeText={setUserInput}
                                style={{
                                    backgroundColor: colors.lightMainTrans,
                                    marginLeft: marginSizes.s12,
                                    fontSize: fontSizes.s16,
                                    paddingVertical: 5,
                                    paddingLeft: 5,
                                    width: 200,
                                }}
                                // return 누른 후 호출되는거 확인함.
                                onSubmitEditing={() => {
                                    console.log(`${userInput} has submitted`);
                                }}
                            />
                        ) : (
                            // </View>
                            <Text style={styles.textStyle}>{value}</Text>
                        )}
                    </View>
                ) : (
                    <View style={styles.container}>
                        <ImageButton
                            img={require("../assets/unselectedMultipleSelection.png")}
                            backgroundStyle={{ justifyContent: "center" }}
                            onPress={onPress}
                        />
                        {isExtra === 1 ? (
                            <TextInput
                                placeholder="기타"
                                value={userInput}
                                onChangeText={setUserInput}
                                style={{
                                    backgroundColor: colors.lightMainTrans,
                                    marginLeft: marginSizes.s12,
                                    fontSize: fontSizes.s16,
                                    paddingVertical: 5,
                                    paddingLeft: 5,
                                    width: 200,
                                }}
                                // return 누른 후 호출되는거 확인함.
                                onSubmitEditing={() => {
                                    console.log(`${userInput} has submitted`);
                                }}
                            />
                        ) : (
                            // </View>
                            <Text style={styles.textStyle}>{value}</Text>
                        )}
                    </View>
                );
                break;
            default:
                selectableOptionComponent = (
                    <View style={styles.textContainer}>
                        <TextInput
                            ref={textInputRef}
                            placeholder="hi"
                            multiline
                            numberOfLines={5}
                            style={styles.textInput}
                            autoCorrect={false}
                            value={text}
                            onChangeText={newText => setText(newText)}
                            onSubmitEditing={() => {
                                console.log(text);
                                // handleUserInput(text);
                            }} // 리턴 키 누를 때 호출
                            returnKeyType="done"
                        />
                        <Button
                            title="submit"
                            onPress={() => {
                                handleUserInput(text);
                                onPress();
                            }}
                        />
                    </View>
                );
                break;
        }
    }

    return <View style={styles.container}>{selectableOptionComponent}</View>;
};

export default SelectableOptionBox;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingLeft: paddingSizes.m16,
        alignItems: "center",
        marginTop: marginSizes.s12,
    },
    textStyle: {
        fontSize: fontSizes.s16,
        marginLeft: marginSizes.s12,
    },

    textContainer: {
        flex: 1,
        // padding: 16,
        paddingRight: 20,
        justifyContent: "center",
    },

    textInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        fontSize: 16,
        textAlignVertical: "top", // 텍스트 상단 정렬
    },
});
