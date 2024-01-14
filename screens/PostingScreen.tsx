import React, { useEffect } from "react";
import { View, FlatList, ListRenderItem, Text } from "react-native";
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
import { NavigationTitle } from "../utils/NavHelper";
import { log, logObject } from "../utils/Log";
import ModifyingQuestionModal from "../modals/ModifyingQuestionModal";
import { Section, SectionBuilder } from "../interfaces/Section";
import SurveyTitleModal from "../modals/SurveyTitleModal";
import {
    PostingSurveyState,
    makePostingSurveyState,
} from "../interfaces/PostingSurveyState";
import SectionModal from "../modals/SectionModal";
import { RouteProp } from "@react-navigation/native";
import { postingSurveyDataManager } from "../utils/PostingSurveyStorage";
import showAdminToast from "../components/common/toast/showAdminToast";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PostingMenuModal } from "../modals/PostingMenuModal";
import showToast from "../components/common/toast/Toast";
import { translateQuestionTypeIdToTime } from "../QuestionType";

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

    const [expectedTimeInMin, setExpectedTimeInMin] = useState(0);
    const [expectedTimeInSec, setExpectedTimeInSec] = useState(0);

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
            logObject("set surveyTitle to", prevSurveyTitle);
            setSections(prevSections);
            setQuestions(prevQuestions);
            setSurveyTitle(prevSurveyTitle);
        }
    }, []);
    const [sectionAdded, setSectionAdded] = useState(false);
    const [isSatisfied, setIsSatisfied] = useState(false);

    const addSection = () => {
        const newSection = new SectionBuilder(sections.length).build();
        // const newSection = makeSection(sections.length);
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
        const expectedTimeInSec = questions
            .map(q => q.questionTypeId)
            .reduce((acc, current) => {
                // console.log(`current id: ${current}`);
                logObject("current : ", current);
                return acc + translateQuestionTypeIdToTime(current);
            }, 0);
        setExpectedTimeInMin(Math.ceil(expectedTimeInSec / 60));
        setExpectedTimeInSec(expectedTimeInSec);
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
            const newSection = new SectionBuilder(0).build();
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
                            color={colors.black}
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
                        showToast("success", "저장되었습니다");
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
                        showToast("success", "저장되었습니다");
                    }
                } catch (error) {
                    // alert(error);
                    showAdminToast("error", error);
                    console.error(error);
                }
            };

            if (surveyTitle !== "") {
                saveSurvey();
            }

            setShouldSave(false);
        }
    }, [shouldSave]);

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
                expectedTimeInSec,
            });
        }
    }, [isNextButtonTapped, surveyTitle, sections, questions]);

    useEffect(() => {
        setCurrentSectionIndex(currentSectionIndex);
    }, [currentSectionIndex]);

    // 1. 전체 초기화
    const initializeAll = async () => {
        log("first option tapped");
        setQuestions([]);
        const firstSection = sections[0];
        setSections([firstSection]);
        setSurveyTitle("");
        await postingSurveyDataManager.initialize();
    };

    // 2. 현재 Section 만 초기화
    useEffect(() => {
        if (shouldInitializeCurrentSection) {
            console.log("initializeCurrentSection called");
            const currentSectionId = sections[currentSectionIndex].id;
            // Random Id 가 주어짐.
            logObject("currentSectionId", currentSectionId);
            logObject("currentQuestions", questions);
            const prevQuestions = [...questions];

            const filteredQuestions = prevQuestions.filter(
                q => q.sectionId !== currentSectionId
            );
            logObject("filteredQuestions", questions);

            setQuestions(filteredQuestions);
            setShouldInitializeCurrentSection(false);
        }
    }, [shouldInitializeCurrentSection]);

    const addQuestion = async (newQuestion: Question) => {
        logObject("add Question!", newQuestion);

        const newQuestions = [...questions];
        newQuestion.sectionId = sections[currentSectionIndex].id;
        newQuestions.push(newQuestion);
        setQuestions(newQuestions);
        setCreatingQuestionModalVisible(false);
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
        console.log("useEffect flag 1");
        logObject("questions updated!", questions);
        logObject("currentSectionIndex", currentSectionIndex);

        if (questions.length !== 0) {
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
                        color:
                            surveyTitle !== "" ? colors.black : colors.gray35,
                    }}
                    backgroundStyle={styles.surveyTitleBG}
                    // backgroundStyle={[styles.shadow, styles.sectionBG]}
                />
                <TextButton
                    title={`Section ${currentSectionIndex + 1}`}
                    onPress={() => {
                        toggleSectionVisible();
                    }}
                    textStyle={styles.sectionText}
                    backgroundStyle={[styles.shadow, styles.sectionBG]}
                />
            </View>
        );
    };

    const listFooter = () => {
        return (
            <View style={styles.listFooterStyle}>
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
                    toggleSave();
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
                <View>
                    <View
                        style={{
                            marginLeft: 20,
                            marginBottom: 12,
                            flexDirection: "row",
                            gap: 10,
                        }}
                    >
                        <Text>총 예상 소요시간:</Text>
                        <Text>{expectedTimeInMin} 분</Text>
                    </View>
                    <TextButton
                        backgroundStyle={[
                            styles.nextBtnBG,
                            {
                                backgroundColor: isSatisfied
                                    ? buttonColors.enabledButtonBG
                                    : buttonColors.disabledButtonBG,
                            },
                        ]}
                        title="다음"
                        textStyle={[
                            styles.nextButtonText,
                            {
                                color: colors.white,
                            },
                        ]}
                        onPress={() => {
                            setIsNextButtonTapped(true);
                        }}
                    />
                </View>
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
        backgroundColor: colors.black,
        color: colors.white,
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
        // backgroundColor: colors.white,
        backgroundColor: colors.gray3,
        borderRadius: 10,
        justifyContent: "center",
        height: 46,
    },
    addQuestionText: {
        // color: colors.black,
        color: colors.gray5,
        textAlign: "center",
        fontSize: fontSizes.m20,
        letterSpacing: 1,
    },
    nextButtonText: {
        color: colors.black,
        textAlign: "center",
        fontSize: 18,
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
    surveyTitleBG: {
        height: 44,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        // backgroundColor: colors.gray4,
        backgroundColor: "white",
        marginBottom: 8,
    },
    sectionText: {
        textAlignVertical: "center",
        fontWeight: "600",
        color: colors.gray3,
    },
    sectionBG: {
        justifyContent: "center",
        backgroundColor: colors.white,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        height: 34,
    },
    nextBtnBG: {
        height: 46,
        marginBottom: 30,
        marginHorizontal: 20,
        borderRadius: 10,
    },
});
