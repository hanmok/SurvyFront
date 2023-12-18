import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Keyboard,
    InputAccessoryView,
    Button,
} from "react-native";
import { fontSizes, marginSizes } from "../utils/sizes";
import ImageButton from "./ImageButton";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { logObject } from "../utils/Log";
// import { QuestionTypeIdEnum } from "../enums/QuestionTypeEnum";
import { QuestionTypeId } from "../QuestionType";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TextButton from "./TextButton";
// import SelectionButton from "./SelectionButton";
import { QuestionTypeIdStrings } from "../QuestionType";
import CompleteAccessoryView from "./CompleteAccessoryView";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { SelectionImage } from "./common/ImageNameType";
import { screenHeight } from "../utils/ScreenSize";

interface SelectableOptionProps {
    id: number;
    questionId: number;
    position: number;
    value: string;
    // questionTypeId: string;
    questionTypeId: QuestionTypeIdStrings;
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

    const scrollViewRef = useRef(null);
    //   const inputRef = useRef(null);

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

    const completeInput = (input: string) => {
        console.log("completeInput tapped");
        handleUserInput(input);
        Keyboard.dismiss();
    };

    // const handleFocus = () => {
    //     const keyboardDidShowListener = Keyboard.addListener(
    //         "keyboardDidShow",
    //         event => {
    //             const keyboardHeight = event.endCoordinates.height;
    //             // const screenHeight = Dimensions.get('window').height;
    //             if (textInputRef && textInputRef.current) {
    //                 const inputPosition = textInputRef.current.measure(
    //                     (fx, fy, width, height, px, py) => py
    //                 );

    //                 console.log(`inputPosition: ${inputPosition}`);
    //                 if (inputPosition < screenHeight / 2) {
    //                     // TextInput이 화면의 절반 이하에 위치한 경우에만 스크롤 조절
    //                     scrollViewRef.current.scrollTo({
    //                         y: inputPosition - keyboardHeight,
    //                         animated: true,
    //                     });
    //                     console.log("scrolled");
    //                 }
    //                 console.log("not scrolled");
    //             }
    //         }
    //     );

    //     const keyboardDidHideListener = Keyboard.addListener(
    //         "keyboardDidHide",
    //         () => {}
    //     );

    //     return () => {
    //         keyboardDidShowListener.remove();
    //         keyboardDidHideListener.remove();
    //     };
    // };

    const handleFocus = () => {};

    const inputAccessoryViewId = "accessoryViewId";

    {
        switch (questionTypeId) {
            case `${QuestionTypeId.SingleSelection}`:
                selectableOptionComponent = selectedIndexIds[
                    questionIndex
                ].includes(id) ? (
                    // 선택된 상태
                    <View style={styles.container}>
                        <Feather
                            name={SelectionImage.selectedSingleSelection}
                            size={24}
                            color="black"
                            onPress={onPress}
                        />
                        {isExtra === 1 ? (
                            <View style={styles.textContainer}>
                                <TextInput
                                    placeholder="기타"
                                    ref={textInputRef}
                                    onFocus={handleFocus}
                                    value={userInput}
                                    onChangeText={setUserInput}
                                    style={styles.extraInput}
                                    onSubmitEditing={() => {
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
                            <TextButton
                                title={value}
                                onPress={onPress}
                                textStyle={styles.textStyle}
                                hasShadow={false}
                            />
                        )}
                    </View>
                ) : (
                    // 선택 되어있지 않은 상태
                    <View style={styles.container}>
                        <Feather
                            name={SelectionImage.unselectedSingleSelection}
                            size={24}
                            color="black"
                            onPress={onPress}
                        />
                        {isExtra === 1 ? (
                            <View style={styles.textContainer}>
                                <TextInput
                                    ref={textInputRef}
                                    placeholder="기타"
                                    value={userInput}
                                    onChangeText={setUserInput}
                                    style={styles.extraInput}
                                    // return 누른 후 호출되는거 확인함.
                                    onSubmitEditing={() => {
                                        console.log(
                                            `${userInput} has submitted`
                                        );
                                    }}
                                    onFocus={() => {
                                        handleFocus();
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
                            </View>
                        ) : (
                            <TextButton
                                title={value}
                                onPress={onPress}
                                textStyle={styles.textStyle}
                                hasShadow={false}
                                backgroundStyle={{
                                    flex: 1,
                                }}
                            />
                        )}
                    </View>
                );
                break;

            case `${QuestionTypeId.MultipleSelection}`:
                selectableOptionComponent = selectedIndexIds[
                    questionIndex
                ].includes(id) ? (
                    // 선택 되어있는 상태
                    <View style={styles.container}>
                        <Feather
                            name={SelectionImage.selectedMultipleSelection}
                            size={24}
                            color="black"
                            onPress={onPress}
                        />

                        {isExtra === 1 ? (
                            <View style={styles.textContainer}>
                                <TextInput
                                    ref={textInputRef}
                                    onFocus={() => {
                                        handleFocus();
                                        onPress();
                                    }}
                                    placeholder="기타"
                                    value={userInput}
                                    onChangeText={setUserInput}
                                    style={styles.extraInput}
                                    // return 누른 후 호출되는거 확인함.
                                    onSubmitEditing={() => {
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
                            <TextButton
                                title={value}
                                onPress={onPress}
                                textStyle={styles.textStyle}
                                hasShadow={false}
                                backgroundStyle={{
                                    flex: 1,
                                }}
                            />
                        )}
                    </View>
                ) : (
                    // 선택 되어있지 않은 상태
                    <View style={styles.container}>
                        <Feather
                            name={SelectionImage.unselectedMultipleSelection}
                            size={24}
                            color="black"
                            onPress={onPress}
                        />
                        {isExtra === 1 ? (
                            <View style={styles.textContainer}>
                                <TextInput
                                    ref={textInputRef}
                                    placeholder="기타"
                                    value={userInput}
                                    onChangeText={setUserInput}
                                    style={styles.extraInput}
                                    // return 누른 후 호출되는거 확인함.
                                    onSubmitEditing={() => {
                                        console.log(
                                            `${userInput} has submitted`
                                        );
                                    }}
                                    onFocus={() => {
                                        handleFocus();
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
                            </View>
                        ) : (
                            <TextButton
                                title={value}
                                onPress={onPress}
                                textStyle={styles.textStyle}
                                hasShadow={false}
                                backgroundStyle={{
                                    flex: 1,
                                }}
                            />
                        )}
                    </View>
                );
                break;
            case `${QuestionTypeId.Essay}`:
                selectableOptionComponent = (
                    <View style={styles.textContainer}>
                        {/* <KeyboardAwareScrollView> */}
                        <TextInput
                            onFocus={handleFocus}
                            ref={textInputRef}
                            placeholder="답변을 입력해주세요."
                            multiline
                            numberOfLines={2} // Initial number of line
                            style={[
                                styles.textInput,
                                // { height: Math.max(35, userInput.length * 10) },
                            ]}
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
                                handleUserInput(userInput);
                                logObject("onEndEditing, userInput", userInput);
                            }}
                            returnKeyType="done"
                            inputAccessoryViewID={inputAccessoryViewId}
                            // https://reactnative.dev/docs/inputaccessoryview
                        />

                        <InputAccessoryView
                            nativeID={inputAccessoryViewId}
                            style={styles.accessoryView}
                        >
                            <View
                                style={[
                                    styles.accessoryBorder,
                                    styles.accessoryContent,
                                ]}
                            >
                                <Button
                                    title="완료"
                                    onPress={() => {
                                        // completeInput(userInput);
                                        console.log("completeInput tapped");
                                        handleUserInput(userInput);
                                        Keyboard.dismiss();
                                    }}
                                />
                            </View>
                        </InputAccessoryView>
                        {/* <CompleteAccessoryView
                            id={inputAccessoryViewId}
                            onPress={() => {
                                completeInput(userInput);
                            }}
                        /> */}
                    </View>
                );
                break;
        }
    }

    return (
        <View style={styles.container} ref={scrollViewRef}>
            {selectableOptionComponent}
        </View>
    );
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
        textAlign: "left",
    },
    textContainer: {
        flex: 1,
        paddingRight: 20,
        marginHorizontal: 6,
        // marginBottom: 4,
        // marginTop: -7,
        justifyContent: "center",
    },
    essayInput: {},
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

    accessoryView: {
        position: "absolute",
        bottom: 0, // Set the distance from the bottom of the screen
        left: 0,
        right: 0,
        backgroundColor: "#F3F4F6",
        borderTopColor: "#A8B7B6",
        borderTopWidth: 1,
    },
    accessoryContent: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingRight: 20,
        alignItems: "center",
        height: "100%", // Ensure the content takes the full height
    },
    accessoryBorder: {
        backgroundColor: "#F3F4F6",
        paddingRight: 20,
        borderTopColor: "#A8B7B6",
        borderTopWidth: 1,
    },
});
