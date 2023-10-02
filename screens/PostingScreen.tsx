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
import CreatingQuestionModal from "../modals/CreatingQuestionModal";
import ImageButton from "../components/ImageButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/NavHelper";
// import { NavigationTitle } from "../utils/NavigationTitle";
import { NavigationTitle } from "../utils/NavHelper";

import { log, logObject } from "../utils/Log";
import ModifyingQuestionModal from "../modals/ModifyingQuestionModal";
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuProvider,
    MenuTrigger,
} from "react-native-popup-menu";
import { Entypo, Foundation } from "@expo/vector-icons";
import { SelectableOption } from "../interfaces/SelectableOption";
import { Section, makeSection } from "../interfaces/Section";
import { Survey, makeSurvey } from "../interfaces/Survey";
import { postWholeSurvey } from "../API/SurveyAPI";
import {
    loadPostingSurvey,
    loadUserState,
    savePostingSurvey,
} from "../utils/Storage";
import SurveyTitleModal from "../modals/SurveyTitleModal";
import { PostingSurveyState } from "../interfaces/PostingSurveyState";

interface TestItem {
    id: number;
}

// Header, Footer 로 중첩 Scroll 해결하기.
export default function PostingScreen({
    navigation,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.posting
    >;
}) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [uniqueQuestions, setUniqueQuestions] = useState<Question[]>([]);
    const [sections, setSections] = useState<Section[]>([]);

    const [selectedQuestionIndex, setSelectedQuestionIndex] =
        useState<number>(undefined);
    const [surveyTitle, setSurveyTitle] = useState<string>("");
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

    const [numberOfSections, setNumberOfSections] = useState(1);
    const [titleModalVisible, setTitleModalVisible] = useState(false);
    const [isConfirmTapped, setConfirmTapped] = useState(false);
    const [isCreatingQuestionModalVisible, setIsCreatingQuestionModalVisible] =
        useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const addSection = () => {
        setNumberOfSections(numberOfSections + 1);
        console.log(
            "[PostingScreen] current numberofSections: ",
            numberOfSections
        );
    };

    const renderSectionOptions = () => {
        const sectionOptions = [];
        for (let i = 1; i <= numberOfSections; i++) {
            sectionOptions.push(
                <MenuOption
                    key={`section-option-${i}`}
                    onSelect={() => {
                        handleMenuOptionSelect(i);
                    }}
                    style={styles.option}
                >
                    <Text style={{ fontSize: fontSizes.s16 }}>
                        Section Option {i}
                    </Text>
                </MenuOption>
            );
        }
        return sectionOptions;
    };

    const handleMenuPress = () => {
        setIsMenuOpen(true);
    };

    const handleMenuOptionSelect = (sectionIndex: number) => {
        console.log(
            "[PostingScreen] section menu tapped, idx:  " + sectionIndex
        );
        setCurrentSectionIndex(sectionIndex);
        setIsMenuOpen(false);
    };

    const handleAddMenu = () => {
        setIsMenuOpen(false);
        addSection();
    };

    const toggleCreateModal = () => {
        setIsCreatingQuestionModalVisible(!isCreatingQuestionModalVisible);
    };

    const [
        isModifyingQuestionModalVisible,
        setIsModifyingQuestionModalVisible,
    ] = useState(false);

    // Section 존재하지 않을 시, sequence 0 으로 추가 후 sections 등록.
    useEffect(() => {
        if (sections.length === 0) {
            const newSection = makeSection(0);
            setSections([newSection]);
        }
    });
    useEffect(() => {}, []);

    useEffect(() => {
        if (isConfirmTapped && questions.length === 0) {
            setIsCreatingQuestionModalVisible(true);
        }
        setConfirmTapped(false);
    }, [isConfirmTapped]);

    const toggleModifyingModal = () => {
        setIsModifyingQuestionModalVisible(!isModifyingQuestionModalVisible);
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.rightNavContainer}>
                    <Menu style={styles.threeDotMenu}>
                        <MenuTrigger
                            customStyles={{}}
                            style={{ marginRight: 12 }}
                        >
                            <Entypo
                                name="dots-three-horizontal"
                                size={24}
                                color="black"
                            />
                        </MenuTrigger>
                        <MenuOptions
                            customStyles={{
                                optionsContainer: styles.optionsContainer,
                            }}
                            optionsContainerStyle={{
                                marginTop: 20,
                                marginRight: 10,
                            }}
                        >
                            <MenuOption
                                onSelect={handleFirstOptionTapped}
                                style={styles.option}
                            >
                                <Text>순서 바꾸기</Text>
                            </MenuOption>
                            <View style={styles.divider} />
                            <MenuOption
                                onSelect={handleSecondOptionTapped}
                                style={styles.option}
                            >
                                <Text>초기화</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                    <ImageButton
                        img={require("../assets/sendIcon.png")}
                        onPress={handleSendButtonTapped}
                        backgroundStyle={{ marginHorizontal: 8 }}
                    />
                </View>
            ),
        });
    }, [navigation]);

    const handleSendButtonTapped = async () => {
        log("send pressed");
        let selectableOptions: SelectableOption[] = [];
        let sections: Section[] = [];
        // Section 을 안만들어두었구나?
        // const testSection = makeSection("sectionTitle", 100, 5);
        const testSection = makeSection(1);

        sections.push(testSection);
        logObject(`passing section:`, sections);

        questions.forEach(q => {
            q.selectableOptions.forEach(so => {
                selectableOptions.push(so);
            });
            q.sectionId = testSection.id;
        });

        logObject(`passing questions:`, questions);
        logObject(`passing selectableoptions:`, selectableOptions);

        const userId = (await loadUserState()).userId;
        const participationGoal = 100;
        const survey = makeSurvey(userId, surveyTitle, participationGoal);
        await postWholeSurvey(survey, sections, questions, selectableOptions);
    };

    const handleFirstOptionTapped = () => {
        log("first option tapped");
    };

    const handleSecondOptionTapped = async () => {
        log("first option tapped");
        setQuestions([]);
        setSections([]);
        setSurveyTitle("");
    };

    const addQuestion = async (newQuestion: Question) => {
        let prevQuestions = questions;
        newQuestion.sectionId = sections[currentSectionIndex].id;

        logObject("[PostingScreen] questions:", questions);
        console.log("[PostingScreen] flag 1");
        logObject("sections: ", sections);
        logObject("currentSection: ", sections[currentSectionIndex]);
        logObject("questions: ", sections[currentSectionIndex].questions);

        logObject("after question add flag 1, ", questions);
        sections[currentSectionIndex].questions.push(newQuestion);
        // console.log("[PostingScreen] flag 2");
        logObject("after question add flag 2, ", questions);

        if (
            prevQuestions.findIndex(
                question => question.id === newQuestion.id
            ) === -1
        ) {
            prevQuestions.push(newQuestion);
        }

        logObject("after question add flag 3, ", questions);
        setQuestions(prevQuestions);
        // 여기서 중복 일어남
        logObject("after question add flag 4, ", questions);
        // setIsCreatingQuestionModalVisible(!isCreatingQuestionModalVisible);
        setIsCreatingQuestionModalVisible(false);

        const postingSurvey: PostingSurveyState = {
            surveyTitle,
            sections,
        };
        await savePosting(postingSurvey);
        console.log("[PostingScreen] savePosting ended");
        logObject("questions: ", questions);
    };

    const savePosting = async (postingSurvey: PostingSurveyState) => {
        await savePostingSurvey(postingSurvey);
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

    useEffect(() => {
        if (surveyTitle === "") {
            setTitleModalVisible(true);
        }
        console.log("PostingSurvey loaded");
        loadPostingSurvey().then(result => {
            setSections(result.sections);
            setSurveyTitle(result.surveyTitle);

            const sections = result.sections;
            const firstSectionQuestions = sections[0].questions;
            setQuestions(firstSectionQuestions);
        });
    }, []);

    const openTitleModal = () => {
        console.log("[PostingScreen] surveyTitle:" + surveyTitle);
        if (surveyTitle === "") {
            setTitleModalVisible(true);
        }
    };

    useEffect(() => {
        // setUniqueQuestions(questions.filter((question) => ))
        const uniques = questions.filter(
            (question, index, arr) =>
                arr.findIndex(t => t.id === question.id) === index
        );
        setUniqueQuestions(uniques);
    }, [questions]);

    const listHeader = () => {
        return (
            <SurveyTitleModal
                setSurveyTitle={setSurveyTitle}
                surveyTitle={surveyTitle}
                titleModalVisible={titleModalVisible}
                setTitleModalVisible={setTitleModalVisible}
                setConfirmTapped={setConfirmTapped}
            />
        );
    };
    const listFooter = () => {
        return (
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
        );
    };
    const postingQuestionBoxItem: ListRenderItem<Question> = ({ item }) => {
        return (
            <View style={{ marginHorizontal: marginSizes.l20 }}>
                <PostingQuestionBox
                    key={item.id}
                    question={item}
                    onPress={() => {
                        toggleModifyingModal();

                        let currentIdx = questions.findIndex(q => {
                            log(`q.id: ${q.id}, item.id: ${item.id}`);
                            return q.id === item.id;
                        });

                        setSelectedQuestionIndex(currentIdx);
                        log(
                            `QuestionBox tapped, currentIdx: ${currentIdx}, selectedIndex: ${selectedQuestionIndex}`
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
            <CreatingQuestionModal
                isCreatingQuestionModalVisible={isCreatingQuestionModalVisible}
                onClose={toggleCreateModal}
                onAdd={addQuestion}
                position={questions.length}
            />

            <ModifyingQuestionModal
                isModifyingQuestionModalVisible={
                    isModifyingQuestionModalVisible
                }
                onClose={toggleModifyingModal}
                onModify={modifyQuestion}
                selectedQuestion={questions[selectedQuestionIndex]}
            />

            <View style={styles.subContainer}>
                {/* <Spacer size={30} /> */}
                <FlatList
                    data={uniqueQuestions.filter(
                        q => q.sectionId === sections[currentSectionIndex].id
                    )}
                    renderItem={postingQuestionBoxItem}
                    keyExtractor={item => `${item.id}`}
                    // key={item => `${item.id}`}
                    // key={id}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 12 }} />
                    )}
                    style={styles.questionList}
                    ListFooterComponent={listFooter}
                    ListFooterComponentStyle={{
                        marginTop: 30,
                        marginBottom: 20,
                        marginHorizontal: marginSizes.l20,
                    }}
                    ListHeaderComponent={listHeader}
                    ListHeaderComponentStyle={{
                        marginTop: 20,
                        marginBottom: 20,
                    }}
                />
            </View>
            {/* <Menu style={styles.sectionMenu}> */}
            <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
                <Menu style={styles.sectionMenu}>
                    <MenuTrigger
                        onPress={handleMenuPress}
                        customStyles={{
                            triggerOuterWrapper: { flexDirection: "row" },
                        }}
                    >
                        <Foundation name="page-copy" size={30} />
                    </MenuTrigger>
                    <MenuOptions
                        customStyles={{
                            optionsContainer: styles.sectionOptionContainer,
                        }}
                        // optionsContainerStyle={{ marginop: 20, marginRight: 10 }}
                        optionsContainerStyle={{ marginBottom: 70 }}
                    >
                        <Text
                            style={{
                                padding: 10,
                                fontWeight: "bold",
                                fontSize: fontSizes.s16,
                            }}
                        >
                            Section
                        </Text>

                        {renderSectionOptions()}

                        <MenuOption
                            onSelect={handleAddMenu}
                            style={styles.option}
                        >
                            <Text style={styles.optionText}>Add Section</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
                <Text
                    style={{
                        flexDirection: "row",
                        marginBottom: 5,
                        marginRight: 5,
                    }}
                >
                    {currentSectionIndex + 1}
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "space-between",
        backgroundColor: colors.background,
    },
    subContainer: {
        // marginHorizontal: marginSizes.l20,
        // backgroundColor: "magenta",
        // marginVertical: marginSizes.m16,
        // gap: 20,
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
        // marginBottom: marginSizes.xl24,
        // marginTop: marginSizes.s12,
        borderRadius: 12,
        overflow: "hidden",
        justifyContent: "center",
        height: 40,
    },
    plusButtonText: {
        color: colors.white,
        textAlign: "center",
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
        borderRadius: borderSizes.l20,
        flexDirection: "row",
        height: 60,
        marginBottom: marginSizes.l20,
        paddingVertical: 5,
        // paddingHorizontal: paddingSizes.l20,
        paddingHorizontal: paddingSizes.m16,
        justifyContent: "space-between",
        marginHorizontal: 15,
    },
    requestText: {
        color: colors.white,
        textAlign: "center",
        fontSize: 20,
    },

    questionList: {
        // marginHorizontal: marginSizes.l20,
        // marginTop: marginSizes.xl24,
        // marginBottom: marginSizes.m16,
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
    },
    sectionBoxItemStyle: {
        // backgroundColor: "magenta",
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
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#7F8487",
    },
    optionsContainer: {
        borderRadius: 10,
        padding: 5,
        marginTop: 25,
        width: 100,
    },
    sectionOptionContainer: {
        borderRadius: 10,
        width: 150,
    },
    option: {
        paddingVertical: 10,
        justifyContent: "center",
        fontSize: fontSizes.m20,
    },
    optionText: {
        fontSize: fontSizes.s16,
    },
    threeDotMenu: {
        marginTop: 5,
    },
    rightNavContainer: {
        flexDirection: "row",
        marginRight: 20,
    },
    sectionMenu: {
        // alignSelf: "flex-end",
        margin: 20,
    },
});
