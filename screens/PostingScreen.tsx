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
import {
    Entypo,
    Feather,
    Foundation,
    SimpleLineIcons,
} from "@expo/vector-icons";
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
    const [titleModalVisible, setTitleModalVisible] = useState(false);
    const [creatingQuestionModalVisible, setCreatingQuestionModalVisible] =
        useState(false);
    // const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [questionsToShow, setQuestionsToShow] = useState<Question[]>([]);
    const [isConfirmTapped, setConfirmTapped] = useState(false);
    const addSection = () => {
        const newSection = makeSection(sections.length);
        setSections(prev => [...prev, newSection]);

        console.log("addSection tapped, numberOfSections: " + sections.length);
    };

    useEffect(() => {
        console.log(`section changed, current length: ${sections.length}`);
    }, [sections]);

    // const renderSectionOptions = (mysections: Section[]) => {
    const renderSectionOptions = React.useCallback(
        (mysections: Section[]) => {
            const sectionOptions = [];
            for (let i = 1; i <= mysections.length; i++) {
                sectionOptions.push(
                    <MenuOption
                        key={`section-option-${i}`}
                        onSelect={() => {
                            handleMenuOptionSelect(i - 1);
                        }}
                        style={styles.option}
                    >
                        <Text style={{ fontSize: fontSizes.s16 }}>
                            Section {i}
                        </Text>
                    </MenuOption>
                );
            }
            return sectionOptions;
        },
        [sections]
    );

    const handleTargetSelection = () => {
        log("target called");
    };

    // const handleMenuPress = () => {
    //     setIsMenuOpen(!isMenuOpen);
    // };

    const handleMenuOptionSelect = (sectionIndex: number) => {
        console.log(
            "[PostingScreen] section menu tapped, idx:  " + sectionIndex
        );
        setCurrentSectionIndex(sectionIndex);
        // setIsMenuOpen(false);
    };

    const handleAddSection = () => {
        // setIsMenuOpen(false);
        addSection();
    };

    const toggleCreateModal = () => {
        setCreatingQuestionModalVisible(!creatingQuestionModalVisible);
    };

    const [
        isModifyingQuestionModalVisible,
        setIsModifyingQuestionModalVisible,
    ] = useState(false);

    // Section 존재하지 않을 시, sequence 0 으로 추가 후 sections 등록.
    useEffect(() => {
        if (sections.length < 2) {
            const newSection = makeSection(sections.length);
            setSections([...sections, newSection]);
        }
    });

    useEffect(() => {
        if (isConfirmTapped && questions.length === 0) {
            setCreatingQuestionModalVisible(true);
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
                    {/* three-dot menu */}
                    <Menu style={styles.threeDotMenu}>
                        <MenuTrigger
                            // customStyles={{}}
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
                                onSelect={handleInitializeTapped}
                                style={styles.option}
                            >
                                <Text>초기화</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>

                    {/*  */}
                    <Menu style={styles.sectionMenu}>
                        <MenuTrigger
                            // onPress={handleMenuPress}
                            customStyles={{
                                triggerOuterWrapper: { flexDirection: "row" },
                            }}
                        >
                            <Foundation name="page-copy" size={24} />
                        </MenuTrigger>
                        <MenuOptions
                            customStyles={{
                                optionsContainer: styles.sectionOptionContainer,
                            }}
                        >
                            <TextButton
                                title="Section"
                                textStyle={{
                                    padding: 10,
                                    fontWeight: "bold",
                                    fontSize: fontSizes.s16,
                                }}
                                onPress={() => {
                                    console.log("section tapped");
                                    // handleMenuPress();
                                }}
                            />

                            {renderSectionOptions(sections)}

                            <MenuOption
                                onSelect={handleAddSection}
                                style={styles.option}
                            >
                                <Text style={styles.optionText}>
                                    Add Section
                                </Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                    <Feather
                        name="target"
                        size={24}
                        color="black"
                        onPress={handleTargetSelection}
                    />

                    {/* <ImageButton
                        img={require("../assets/sendIcon.png")}
                        onPress={handleSendButtonTapped}
                        // onPress={handleAddSection}
                        backgroundStyle={{ marginHorizontal: 8 }}
                    /> */}
                    <SimpleLineIcons
                        name="paper-plane"
                        size={24}
                        color="black"
                        onPress={handleSendButtonTapped}
                    />
                    {/* <Text>{sections.length}</Text> */}
                </View>
            ),
        });
    }, [navigation]);

    const handleSendButtonTapped = async () => {
        log("send pressed");
        let selectableOptions: SelectableOption[] = [];
        let sections: Section[] = [];

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

    useEffect(() => {
        updateQuestions();
    }, [currentSectionIndex]);
    const handleFirstOptionTapped = () => {
        log("first option tapped");
    };

    const handleInitializeTapped = async () => {
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
        setCreatingQuestionModalVisible(false);

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

    // TODO: Unique Question 의 Index 정리하기.
    useEffect(() => {
        updateQuestions();
    }, [questions]);

    const updateQuestions = () => {
        if (questions.length !== 0) {
            const uniques = questions.filter(
                (question, index, arr) =>
                    arr.findIndex(t => t.id === question.id) === index
            );
            setUniqueQuestions(uniques);
            const toShow = uniques.filter(
                q => q.sectionId === sections[currentSectionIndex].id
            );
            setQuestionsToShow(toShow);
        }
    };

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

    return (
        <SafeAreaView style={styles.container} edges={[]}>
            <CreatingQuestionModal
                isCreatingQuestionModalVisible={creatingQuestionModalVisible}
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
                {uniqueQuestions.length === 0 ? (
                    <Text>Empty</Text>
                ) : (
                    <FlatList
                        // data={uniqueQuestions.filter(
                        //     q =>
                        //         q.sectionId === sections[currentSectionIndex].id
                        // )}
                        data={questionsToShow}
                        renderItem={postingQuestionBoxItem}
                        keyExtractor={item => `${item.id}`}
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
                )}
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
    },

    plusButtonBG: {
        backgroundColor: colors.deepMainColor,
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
    // modalContent: {
    //     backgroundColor: "white",
    //     padding: 20,
    //     borderRadius: 10,
    // },
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
        // marginRight: 20,
        marginRight: 12,
        justifyContent: "space-around",
        gap: 10,
    },
    sectionMenu: {
        // alignSelf: "flex-end",
        // margin: 20,
    },
});
