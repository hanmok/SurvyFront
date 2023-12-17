import React, { useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    ListRenderItem,
    TouchableNativeFeedback,
} from "react-native";
import { StyleSheet } from "react-native";
import { buttonColors, colors } from "../utils/colors";
import {
    fontSizes,
    marginSizes,
    borderSizes,
    paddingSizes,
} from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import TextButton from "../components/TextButton";
import { useState } from "react";
import { Question } from "../interfaces/Question";
import PostingQuestionBox from "../components/posting/PostingQuestionBox";
import CreatingQuestionModal from "../modals/CreatingQuestionModal";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/NavHelper";
// import { NavigationTitle } from "../utils/NavigationTitle";
import { NavigationTitle } from "../utils/NavHelper";
import { log, logObject } from "../utils/Log";
import ModifyingQuestionModal from "../modals/ModifyingQuestionModal";

import { Section, makeSection } from "../interfaces/Section";
import SurveyTitleModal from "../modals/SurveyTitleModal";
import {
    PostingSurveyState,
    makePostingSurveyState,
} from "../interfaces/PostingSurveyState";
import SectionModal from "../modals/SectionModal";
import { RouteProp } from "@react-navigation/native";
import PopupMenu from "../components/PopupMenu";
import { postingSurveyDataManager } from "../utils/PostingSurveyStorage";
import showAdminToast from "../components/common/toast/showAdminToast";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PostingMenuModal } from "../modals/PostingMenuModal";

export default function PostingScreen({
    navigation,
    route,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.posting
    >;
    route: RouteProp<RootStackParamList, NavigationTitle.posting>;
}) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [questionsToShow, setQuestionsToShow] = useState<Question[]>([]);
    const [shouldSave, setShouldSave] = useState<boolean>(false);
    const [selectedQuestionIndex, setSelectedQuestionIndex] =
        useState<number>(undefined);
    const [surveyTitle, setSurveyTitle] = useState<string>("");
    // 0 부터 시작
    const [sections, setSections] = useState<Section[]>([]);

    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

    const [isTitleModalVisible, setIsTitleModalVisible] = useState(false);
    const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
    const [creatingQuestionModalVisible, setCreatingQuestionModalVisible] =
        useState(false);
    const [isSectionModalVisible, setSectionModalVisible] = useState(false);
    const [isConfirmTapped, setConfirmTapped] = useState(false);
    const [isNextButtonTapped, setIsNextButtonTapped] = useState(false);
    const [shouldInitializeCurrentSection, setShouldInitializeCurrentSection] =
        useState(false);

    const [postingSurvey, setPostingSurvey] = useState<
        PostingSurveyState | undefined
    >(undefined);

    const toggleMenuModal = () => {
        setIsMenuModalVisible(!isMenuModalVisible);
    };

    useEffect(() => {
        const prevSurvey = route.params.postingSurveyState;
        logObject("prevSurvey", prevSurvey);
        setPostingSurvey(prevSurvey);

        if (prevSurvey) {
            const prevSections = prevSurvey.sections;
            const prevQuestions = prevSurvey.questions;
            const prevSurveyTitle = prevSurvey.title;
            logObject("set sections to", prevSections);
            logObject("set questions to", prevQuestions);
            // 어.. 이거.. Questions 설정한 다음에, QuestionsToShow 설정해줘야 하는거 아니야?
            logObject("set surveyTitle to", prevSurveyTitle); // 이건 정상이야.
            setSections(prevSections);
            setQuestions(prevQuestions);
            setSurveyTitle(prevSurveyTitle);
        }
    }, []);
    const [sectionAdded, setSectionAdded] = useState(false);
    const [isSatisfied, setIsSatisfied] = useState(false);

    const addSection = () => {
        const newSection = makeSection(sections.length);
        setSectionAdded(true);
        setSections(prev => [...prev, newSection]);
    };

    useEffect(() => {
        if (sectionAdded) {
            setSectionAdded(false);
            const lastSectionIndex = sections.length - 1;
            setCurrentSectionIndex(lastSectionIndex);
        }
    }, [sections]);

    useEffect(() => {
        setIsSatisfied(questions.length !== 0 && surveyTitle !== ""); // 0 이 아니면 satisfied 는 true
    }, [questions, surveyTitle]);

    useEffect(() => {
        setIsNextButtonTapped(false);
    });

    const toggleCreateModal = () => {
        setCreatingQuestionModalVisible(!creatingQuestionModalVisible);
    };

    const [
        isModifyingQuestionModalVisible,
        setIsModifyingQuestionModalVisible,
    ] = useState(false);

    // Section 존재하지 않을 시, sequence 0 으로 추가 후 sections 등록.

    useEffect(() => {
        if (sections.length === 0 && !route.params.postingSurveyState) {
            const newSection = makeSection(0);
            setSections([newSection]);
        }
    }, []);

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
                <View style={{ marginRight: 20, flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={() => {
                            toggleMenuModal();
                        }}
                    >
                        <Ionicons
                            name="reorder-three-sharp"
                            size={36}
                            color="black"
                            onPress={() => {
                                toggleMenuModal();
                            }}
                        />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const toggleSave = () => {
        setShouldSave(!shouldSave);
    };

    useEffect(() => {
        if (shouldSave) {
            if (shouldSave && surveyTitle === "") {
                alert("설문 제목을 입력해주세요.");
            }
            setShouldSave(false);
        }
    }, [shouldSave]);

    useEffect(() => {
        console.log("save tapped");
        if (shouldSave) {
            const saveSurvey = async () => {
                try {
                    if (!postingSurvey) {
                        const newSurvey: PostingSurveyState =
                            makePostingSurveyState({
                                id: undefined,
                                surveyTitle,
                                sections,
                                questions,
                            });
                        await postingSurveyDataManager.save(newSurvey);
                    } else {
                        // 기존에 있었음. id 는 그대로 사용. 나머지는 지금까지 데이터.
                        const updatedSurvey: PostingSurveyState =
                            makePostingSurveyState({
                                id: postingSurvey.id,
                                surveyTitle,
                                sections,
                                questions,
                            });
                        await postingSurveyDataManager.save(updatedSurvey);
                    }
                } catch (error) {
                    // alert(error);
                    showAdminToast("error", error);
                    console.error(error);
                }
            };

            saveSurvey();
            setShouldSave(false);
        }
    }, [shouldSave]);

    // Survey Object 하나를 Pass 시키면 안돼?
    // 아직 설정되지 않은 값들은 undefined 로 하고...

    useEffect(() => {
        logObject("[PostingScreen] navigating value:", {
            surveyTitle,
            sections,
            questions,
        });

        if (isNextButtonTapped) {
            navigation.navigate(NavigationTitle.targetting, {
                surveyTitle,
                sections,
                questions,
            });
        }
        // Sections 에 SelectableOption 까지 모두 들어가는데 ? 굳이 Questions 도 따로 넣어야해?
    }, [isNextButtonTapped, surveyTitle, sections, questions]);

    useEffect(() => {
        setCurrentSectionIndex(currentSectionIndex);
    }, [currentSectionIndex]);

    // Options
    // 1. 순서바꾸기
    const handleFirstOptionTapped = () => {
        log("first option tapped");
    };

    // 2. 초기화
    const initializeAll = async () => {
        log("first option tapped");
        setQuestions([]);
        const firstSection = sections[0];
        setSections([firstSection]);
        setSurveyTitle("");
        await postingSurveyDataManager.initialize();
    };

    // 3. 현재 Section 만 초기화
    useEffect(() => {
        if (shouldInitializeCurrentSection) {
            console.log("initializeCurrentSection called");
            const currentSectionId = sections[currentSectionIndex].id;
            // questions 에서 questionsToShow 지우기.
            // Random Id 가 주어짐.
            logObject("currentSectionId", currentSectionId);
            logObject("currentQuestions", questions);
            const prevQuestions = [...questions];

            // const filteredQuestions = questions.filter(
            const filteredQuestions = prevQuestions.filter(
                q => q.sectionId !== currentSectionId
            );
            logObject("filteredQuestions", questions);

            setQuestions(filteredQuestions);
            setShouldInitializeCurrentSection(false);
        }
    }, [shouldInitializeCurrentSection]);

    const toggleInitializeCurrentSection = () => {
        const shouldInitialize = shouldInitializeCurrentSection;
        setShouldInitializeCurrentSection(!shouldInitialize);
    };

    const addQuestion = async (newQuestion: Question) => {
        logObject("add Question!", newQuestion);

        const newQuestions = [...questions];
        newQuestion.sectionId = sections[currentSectionIndex].id;
        newQuestions.push(newQuestion);
        setQuestions(newQuestions);
        setCreatingQuestionModalVisible(false);

        // Section 수정하기.
        // Side Effect 는 ? questions 를 따로 하는게?
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

    // TODO: 나중에 처리하기.
    // useEffect(() => {
    //     if (surveyTitle === "") {
    //         setTitleModalVisible(true);
    //     }
    //     console.log("PostingSurvey loaded");

    //     loadPostingSurvey().then(result => {
    //         setSections(result.sections);
    //         setSurveyTitle(result.surveyTitle);

    //         const sections = result.sections;
    //         const firstSectionQuestions = sections[0].questions;
    //         setQuestions(firstSectionQuestions);
    //     });
    // }, []);

    // TODO: Unique Question 의 Index 정리하기.

    useEffect(() => {
        console.log("useEffect flag 1");
        logObject("questions updated!", questions);
        logObject("currentSectionIndex", currentSectionIndex);

        if (questions.length !== 0) {
            // const toShow = questions.filter(
            //     q => q.sectionId === sections[currentSectionIndex].id
            // );

            const toShow = questions.filter(q => {
                const ret = q.sectionId === sections[currentSectionIndex].id;
                log(
                    `q.sectionId: ${q.sectionId}, current section's id: ${sections[currentSectionIndex].id}, ret: ${ret}`
                );
                return ret;
            });

            setQuestionsToShow(toShow);
            logObject("questions updated! questionsToShow:", toShow);
        } else {
            logObject("questions updated! questionsToShow:", []);
            setQuestionsToShow([]);
        }
    }, [questions, currentSectionIndex]);

    // const updateQuestions = () => {

    //     if (questions.length !== 0) {
    //         const toShow = questions.filter(
    //             q => q.sectionId === sections[currentSectionIndex].id
    //         );

    //         setQuestionsToShow(toShow);
    //     } else {
    //         setQuestionsToShow([]);
    //     }
    // };

    useEffect(() => {
        console.log(`[PostingScreen] surveyTitle changed to ${surveyTitle}`);
    }, [surveyTitle]);

    const listHeader = () => {
        return (
            <View style={styles.listHeaderStyle}>
                <TextButton
                    title={surveyTitle !== "" ? surveyTitle : "설문 제목"}
                    onPress={() => {
                        toggleTitleModalVisible();
                    }}
                    textStyle={{
                        fontSize: 22,
                        fontWeight: "bold",
                        color: surveyTitle !== "" ? "black" : "gray",
                    }}
                    backgroundStyle={{
                        height: 44,
                        // marginRight: 12,

                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        borderBottomLeftRadius: 6,
                        borderBottomRightRadius: 6,
                        backgroundColor: colors.gray4,
                        marginBottom: 8,
                    }}
                />
                <TextButton
                    title={`Section ${currentSectionIndex + 1}`}
                    onPress={() => {
                        toggleSectionVisible();
                    }}
                    textStyle={{
                        textAlignVertical: "center",
                        fontWeight: "600",
                        // color: "blue",
                        color: colors.gray3,
                    }}
                    backgroundStyle={[
                        styles.shadow,
                        {
                            justifyContent: "center",
                            backgroundColor: "white",
                            borderBottomLeftRadius: 16,
                            borderBottomRightRadius: 16,
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            height: 34,
                        },
                    ]}
                />
            </View>
            // </View>
        );
    };

    const listFooter = () => {
        return (
            <View style={styles.listFooterStyle}>
                {/* <PopupMenu /> */}
                <TextButton
                    title="질문 추가"
                    onPress={toggleCreateModal}
                    textStyle={[
                        styles.addQuestionText,
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
            <View style={{ marginHorizontal: marginSizes.s12 }}>
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

    const toggleSectionVisible = () => {
        const isVisible = isSectionModalVisible;
        setSectionModalVisible(!isVisible);
    };

    const toggleTitleModalVisible = () => {
        const isVisible = isTitleModalVisible;
        setIsTitleModalVisible(!isVisible);
    };

    const selectSection = (selectedSectionIndex: number) => {
        // 1 을 선택하면 0 이 나와야해.
        console.log(
            "[PostingScreen] selected Section index: " + selectedSectionIndex
        );
        setCurrentSectionIndex(selectedSectionIndex);
    };

    useEffect(() => {
        console.log(
            `[PostingScreen] currentSectionIndex changed to ${currentSectionIndex}`
        );
    }, [currentSectionIndex]);

    return (
        <SafeAreaView style={styles.container} edges={[]}>
            <CreatingQuestionModal
                isCreatingQuestionModalVisible={creatingQuestionModalVisible}
                onClose={toggleCreateModal}
                onAdd={addQuestion}
                position={questionsToShow.length}
            />

            <ModifyingQuestionModal
                isModifyingQuestionModalVisible={
                    isModifyingQuestionModalVisible
                }
                onClose={toggleModifyingModal}
                onModify={modifyQuestion}
                selectedQuestion={questions[selectedQuestionIndex]}
            />

            <SurveyTitleModal
                setSurveyTitle={setSurveyTitle}
                surveyTitle={surveyTitle}
                titleModalVisible={isTitleModalVisible}
                setTitleModalVisible={setIsTitleModalVisible}
                setConfirmTapped={setConfirmTapped}
            />

            <SectionModal
                onClose={toggleSectionVisible}
                isSectionModalVisible={isSectionModalVisible}
                numOfSections={sections.length}
                onAdd={addSection}
                onSelection={selectSection}
            />

            <PostingMenuModal
                onClose={toggleMenuModal}
                onInitialize={initializeAll}
                onInitializeCurrent={() => {
                    setShouldInitializeCurrentSection(true);
                }}
                onSave={() => {
                    toggleSave;
                }}
                isMenuModalVisible={isMenuModalVisible}
            />

            <View style={styles.subContainer}>
                <>
                    {questionsToShow.length === 0 ? (
                        <View>
                            {listHeader()}
                            {listFooter()}
                        </View>
                    ) : (
                        <FlatList
                            data={questionsToShow}
                            renderItem={postingQuestionBoxItem}
                            keyExtractor={item => `${item.id}`}
                            ItemSeparatorComponent={() => (
                                <View style={{ height: 12 }} />
                            )}
                            ListFooterComponent={listFooter}
                            ListHeaderComponent={listHeader}
                            ListFooterComponentStyle={{ marginTop: 20 }}
                        />
                    )}
                </>

                <TextButton
                    backgroundStyle={{
                        backgroundColor: isSatisfied
                            ? buttonColors.enabledButtonBG
                            : buttonColors.disabledButtonBG,
                        height: 46,
                        marginBottom: 30,
                        marginHorizontal: 20,
                        borderRadius: 10,
                    }}
                    title="다음"
                    textStyle={[
                        styles.nextButtonText,
                        {
                            color: "white",
                        },
                    ]}
                    // hasShadow={false}
                    onPress={() => {
                        setIsNextButtonTapped(true);
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: colors.background,
    },
    subContainer: {
        flex: 1,
        justifyContent: "space-between",
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
    sectionHeader: {
        marginLeft: marginSizes.xs8,
        fontWeight: "500",
        marginBottom: marginSizes.xs8,
        backgroundColor: "#5094FD",
        borderRadius: 5,
        overflow: "hidden",
        paddingHorizontal: 10,
        width: 90,
        textAlign: "center",
    },

    plusButtonBG: {
        backgroundColor: colors.white,
        borderRadius: 10,
        justifyContent: "center",
        height: 46,
    },
    addQuestionText: {
        color: colors.black,
        textAlign: "center",
        fontSize: fontSizes.m20,
        letterSpacing: 1,
    },
    nextButtonText: {
        color: colors.black,
        textAlign: "center",
        // fontSize: fontSizes.m20,
        fontSize: 18,
        // fontWeight: "bold",
        fontWeight: "900",
        letterSpacing: 2,
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
        paddingHorizontal: paddingSizes.m16,
        justifyContent: "space-between",
        marginHorizontal: 15,
    },
    requestText: {
        color: colors.white,
        textAlign: "center",
        fontSize: 20,
    },

    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    flatListStyle: {
        flexGrow: 0.9,
    },
    sectionBoxItemStyle: {
        marginHorizontal: 5,
        borderRadius: 6,
        overflow: "hidden",
    },
    itemContainer: {
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
        marginRight: 12,
        justifyContent: "space-around",
        gap: 10,
    },
    listHeaderStyle: {
        marginTop: 30,
        marginBottom: 20,
        marginHorizontal: marginSizes.s12,
    },
    listFooterStyle: {
        marginBottom: 20,
        marginHorizontal: marginSizes.s12,
        justifyContent: "center",
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2,
    },
});
