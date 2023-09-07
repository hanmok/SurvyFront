import React, { useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    ScrollView,
    SectionList,
    FlatList,
    ListRenderItem,
    Modal,
    TouchableOpacity,
    Animated,
} from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import {
    fontSizes,
    marginSizes,
    borderSizes,
    paddingSizes,
} from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import Spacer from "../components/Spacer";
import TextButton from "../components/TextButton";
// import PostingQuestionBox from "../components/PostingQuestionBox";
import { useState } from "react";
import { QuestionType } from "../QuestionType";
import { Question } from "../interfaces/Question";
import { fakeQuestions } from "../fakeQuestion";
import PostingQuestionBox from "../components/posting/PostingQuestionBox";
import CreateQuestionModal from "../components/posting/CreateQuestionModal";
import ImageButton from "../components/ImageButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackParamList";
import { NavigationTitle } from "../utils/NavigationTitle";
import { log, logObject } from "../utils/Log";
import ModifyQuestionModal from "../components/posting/ModifyQuestionModal";

interface TestItem {
    id: number;
}

// Header, Footer 로 중첩 Scroll 해결하기.
export default function SurveyPostingScreen({
    navigation,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.posting
    >;
}) {
    const [customViews, setCustomViews] = useState([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(undefined);

    const [isCreateQuestionModalVisible, setIsCreateQuestionModalVisible] =
        useState(false);

    const toggleCreateModal = () => {
        setIsCreateQuestionModalVisible(!isCreateQuestionModalVisible);
    };

    const [
        isModifyingQuestionModalVisible,
        setIsModifyingQuestionModalVisible,
    ] = useState(false);

    const toggleModifyingModal = () => {
        setIsModifyingQuestionModalVisible(!isModifyingQuestionModalVisible);
        // setSelectedIndex(null);
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                // <Button onPress={() => log("hi")} title="Button" />
                <View
                    style={{
                        flexDirection: "row",
                        marginRight: 20,
                    }}
                >
                    <ImageButton
                        img={require("../assets/moreIcon.png")}
                        onPress={() => {
                            log("more tapped");
                        }}
                        backgroundStyle={{ marginHorizontal: 6 }}
                    />
                    <ImageButton
                        img={require("../assets/sendIcon.png")}
                        onPress={() => {
                            log("send pressed");
                        }}
                        backgroundStyle={{ marginHorizontal: 6 }}
                    />
                </View>
            ),
        });
    }, [navigation]);

    const addQuestion = (question: Question) => {
        // questions
        let newQuestions = questions;
        newQuestions.push(question);
        setQuestions(newQuestions);
        setIsCreateQuestionModalVisible(!isCreateQuestionModalVisible);
    };

    const modifyQuestion = (question: Question) => {
        let newQuestions = questions;
        const modifiedQuestionId = question.id;

        const modifiedIdx = newQuestions.findIndex(q => {
            return q.id === modifiedQuestionId;
        });

        newQuestions[modifiedIdx] = question;
        setQuestions(newQuestions);
        logObject(`newQuestions: `, questions);
        setIsModifyingQuestionModalVisible(!isModifyingQuestionModalVisible);
    };

    const handleAddCustomView = inputValue => {
        setCustomViews(prevViews => [...prevViews, inputValue]);
    };

    useEffect(() => {
        setQuestions(fakeQuestions);
    }, []);

    const fakeTitle = "내 설문조사 제목";

    // let myData = fakeQuestions;

    const postingQuestionBoxItem: ListRenderItem<Question> = ({ item }) => {
        return (
            <View>
                {/* <PostingQuestionBox question={item} onPress={toggleCreateModal} /> */}
                <PostingQuestionBox
                    question={item}
                    onPress={() => {
                        toggleModifyingModal();

                        let currentIdx = questions.findIndex(q => {
                            log(`q.id: ${q.id}, item.id: ${item.id}`);
                            return q.id === item.id;
                        });

                        setSelectedIndex(currentIdx);
                        log(
                            `QuestionBox tapped, currentIdx: ${currentIdx}, selectedIndex: ${selectedIndex}`
                        );
                    }}
                />
            </View>
        );
    };

    const sectionBoxItem: ListRenderItem<TestItem> = ({ item }) => (
        <View style={styles.sectionBoxItemStyle}>
            <Text
                style={{
                    color: "black",
                    marginHorizontal: 30,
                    paddingVertical: 10,
                }}
            >
                {item.id}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={[]}>
            <CreateQuestionModal
                isCreateQuestionModalVisible={isCreateQuestionModalVisible}
                onClose={toggleCreateModal}
                onAdd={addQuestion}
                position={questions.length}
            />

            <ModifyQuestionModal
                isModifyQuestionModalVisible={isModifyingQuestionModalVisible}
                onClose={toggleModifyingModal}
                onModify={modifyQuestion}
                selectedQuestion={questions[selectedIndex]}
            />

            <View style={styles.subContainer}>
                <TextInput
                    placeholder="설문 제목을 입력해주세요"
                    style={styles.surveyTitleBox}
                    value={fakeTitle}
                />

                <FlatList
                    data={questions}
                    renderItem={postingQuestionBoxItem}
                    keyExtractor={item => `${item.id}`}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 12 }} />
                    )}
                    style={styles.questionList}
                />

                <View style={{ justifyContent: "center" }}>
                    <TextButton
                        // title="+"
                        title="질문 추가"
                        // onPress={() => console.log}
                        onPress={toggleCreateModal}
                        textStyle={[
                            styles.plusButtonText,
                            { textAlignVertical: "center" },
                        ]}
                        backgroundStyle={[
                            styles.plusButtonBG,
                            { justifyContent: "center" },
                        ]}
                    />
                </View>
            </View>

            {/* 하단  */}
            <View style={styles.bottomContainer}>
                <FlatList
                    renderItem={sectionBoxItem}
                    data={[{ id: 1 }, { id: 2 }, { id: 3 }]}
                    keyExtractor={item => `${item.id}`}
                    horizontal={true}
                    style={styles.flatListStyle}
                    contentContainerStyle={{
                        alignItems: "center",
                        marginHorizontal: 5,
                        justifyContent: "space-between",
                    }}
                />
                <ImageButton img={require("../assets/smallPlusIcon.png")} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: colors.background,
    },
    subContainer: {
        marginHorizontal: marginSizes.l20,
        marginVertical: marginSizes.m16,
        // marginVertical: 8,
    },
    questionContainer: {
        padding: 10,
        borderRadius: 10,
        overflow: "hidden",
    },
    questionWithIndex: {
        flexDirection: "row",
    },
    surveyTitleBox: {
        borderColor: colors.deepMainColor,
        borderWidth: 5,
        borderRadius: borderSizes.m10,
        height: 50,
        marginTop: marginSizes.xxs4,
        marginBottom: marginSizes.xxs4,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },

    addButton: {
        backgroundColor: "black",
        color: "white",
    },
    moduleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: marginSizes.m16,
    },
    selectionButtonBG: {
        backgroundColor: colors.blurredGray,
        width: 60,
        fontWeight: "bold",
        justifyContent: "center",
        height: 30,
        borderRadius: borderSizes.m10,
        overflow: "hidden",
        marginHorizontal: 10,
    },
    selectionButtonText: {
        color: colors.buttonBlue,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    },

    sectionHeader: {
        marginLeft: marginSizes.xs8,
        fontWeight: "500",
        marginTop: marginSizes.l20,
        marginBottom: marginSizes.xs8,
        backgroundColor: colors.selectedQuestionBoxBG,
        borderRadius: 5,
        overflow: "hidden",
        paddingHorizontal: 10,
        width: 90,
        textAlign: "center",
        // width: 200,
        // whiteSpace: "nowrap",
        // textOverflow: "ellipsis",
    },

    plusButtonBG: {
        backgroundColor: colors.deepMainColor,
        marginBottom: marginSizes.xl24,
        // marginTop: marginSizes.s12,
        borderRadius: 12,
        overflow: "hidden",
        justifyContent: "center",
        height: 40,
    },
    plusButtonText: {
        color: colors.white,
        textAlign: "center",
        // fontSize: 60,
        // fontSize: 40,
        fontSize: fontSizes.m20,
        fontWeight: "500",
        borderRadius: 40,
    },

    expectedTime: {
        flexBasis: 24,
        height: 24,
        marginRight: marginSizes.l20,
        textAlign: "right",
    },

    bottomContainer: {
        backgroundColor: colors.deepMainColor,
        color: colors.white,
        borderRadius: borderSizes.m10,
        flexDirection: "row",
        height: 60,
        marginBottom: marginSizes.l20,
        paddingVertical: 5,
        // paddingHorizontal: paddingSizes.l20,
        paddingHorizontal: paddingSizes.m16,
        justifyContent: "space-between",
    },
    requestText: {
        color: colors.white,
        textAlign: "center",
        fontSize: 20,
    },

    questionList: {
        marginTop: marginSizes.xl24,
        marginBottom: marginSizes.m16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
    flatListStyle: {
        flexGrow: 0.9,
        // backgroundColor: 'magenta'
    },
    sectionBoxItemStyle: {
        backgroundColor: "magenta",
        marginHorizontal: 5,
        borderRadius: 6,
        overflow: "hidden",
    },
    itemContainer: {
        // flexDirection: "row",
        // alignItems: "center",
        // justifyContent: "space-between",
        // padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "lightgray",
    },
});
