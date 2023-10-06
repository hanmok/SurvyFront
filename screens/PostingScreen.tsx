import React, { useEffect } from "react";
import { View, Text, FlatList, ListRenderItem } from "react-native";
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
import * as Location from "expo-location";
import {
    Entypo,
    Feather,
    Foundation,
    SimpleLineIcons,
} from "@expo/vector-icons";
import { SelectableOption } from "../interfaces/SelectableOption";
import { Section, makeSection } from "../interfaces/Section";
import { Survey, SurveyProps, makeSurvey } from "../interfaces/Survey";
import { createSurvey, postWholeSurvey } from "../API/SurveyAPI";
import {
    loadPostingSurvey,
    loadUserState,
    savePostingSurvey,
} from "../utils/Storage";
import SurveyTitleModal from "../modals/SurveyTitleModal";
import { PostingSurveyState } from "../interfaces/PostingSurveyState";
import { getAddress } from "../API/GeoAPI";

export default function PostingScreen({
    navigation,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.posting
    >;
}) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [questionsToShow, setQuestionsToShow] = useState<Question[]>([]);
    const [sections, setSections] = useState<Section[]>([]);

    const [selectedQuestionIndex, setSelectedQuestionIndex] =
        useState<number>(undefined);
    const [surveyTitle, setSurveyTitle] = useState<string>("");
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [titleModalVisible, setTitleModalVisible] = useState(false);
    const [creatingQuestionModalVisible, setCreatingQuestionModalVisible] =
        useState(false);
    const [isConfirmTapped, setConfirmTapped] = useState(false);
    const [isSendButtonTapped, setIsSendButtonTapped] = useState(false);

    const addSection = () => {
        const newSection = makeSection(sections.length);
        setSections(prev => [...prev, newSection]);

        console.log("addSection tapped, numberOfSections: " + sections.length);
    };

    useEffect(() => {
        setIsSendButtonTapped(false);
    });
    useEffect(() => {
        console.log(`section changed, current length: ${sections.length}`);
    }, [sections]);

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

    const handleMenuOptionSelect = (sectionIndex: number) => {
        console.log(
            "[PostingScreen] section menu tapped, idx:  " + sectionIndex
        );
        setCurrentSectionIndex(sectionIndex);
    };

    const handleAddSection = () => {
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
        if (sections.length === 0) {
            const newSection = makeSection(0);
            setSections([newSection]);
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
                    <SimpleLineIcons
                        name="paper-plane"
                        size={24}
                        color="black"
                        onPress={() => {
                            setIsSendButtonTapped(true);
                        }}
                    />
                </View>
            ),
        });
    }, [navigation]);

    // Survey Object 하나를 Pass 시키면 안돼?
    // 아직 설정되지 않은 값들은 undefined 로 하고...
    useEffect(() => {
        logObject("[PostingScreen] navigating value:", {
            surveyTitle,
            sections,
            questions,
        });

        if (isSendButtonTapped) {
            navigation.navigate(NavigationTitle.targetting, {
                surveyTitle,
                sections,
                questions,
            });
        }
        // Sections 에 SelectableOption 까지 모두 들어가는데 ? 굳이 Questions 도 따로 넣어야해?
    }, [isSendButtonTapped, surveyTitle, sections, questions]);

    useEffect(() => {
        updateQuestions();
    }, [currentSectionIndex]);

    const handleFirstOptionTapped = () => {
        log("first option tapped");
    };

    const handleInitializeTapped = async () => {
        log("first option tapped");
        setQuestions([]);
        const firstSection = sections[0];
        setSections([firstSection]);
        setSurveyTitle("");
    };

    const addQuestion = async (newQuestion: Question) => {
        let prevQuestions = questions;
        newQuestion.sectionId = sections[currentSectionIndex].id;

        // logObject("[PostingScreen] questions:", questions);
        // logObject("sections: ", sections);
        // logObject("currentSection: ", sections[currentSectionIndex]);
        // logObject("questions: ", sections[currentSectionIndex].questions);

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
        setCreatingQuestionModalVisible(false);

        const postingSurvey: PostingSurveyState = {
            surveyTitle,
            sections,
        };
        updateQuestions();
        // await savePosting(postingSurvey);
        console.log("[PostingScreen] savePosting ended");
        logObject("questions: ", questions);
    };

    const savePostingToLocal = async (postingSurvey: PostingSurveyState) => {
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
        console.log("questions updated! updateQuestions called");
        updateQuestions();
    }, [questions]);

    const updateQuestions = () => {
        if (questions.length !== 0) {
            // const uniques = questions.filter(
            //     (question, index, arr) =>
            //         arr.findIndex(t => t.id === question.id) === index // 중복 제거
            // );

            // setUniqueQuestions(uniques);

            const toShow = questions.filter(
                q => q.sectionId === sections[currentSectionIndex].id
            );

            setQuestionsToShow(toShow);
        } else {
            setQuestionsToShow([]);
        }
    };

    useEffect(() => {
        console.log(`[PostingScreen] surveyTitle changed to ${surveyTitle}`);
    }, [surveyTitle]);

    const listHeader = () => {
        return (
            <View style={styles.listHeaderStyle}>
                <SurveyTitleModal
                    setSurveyTitle={setSurveyTitle}
                    surveyTitle={surveyTitle}
                    titleModalVisible={titleModalVisible}
                    setTitleModalVisible={setTitleModalVisible}
                    setConfirmTapped={setConfirmTapped}
                />
            </View>
        );
    };

    const listFooter = () => {
        return (
            <View
                // style={[styles.listFooterStyle, { justifyContent: "center" }]}
                style={styles.listFooterStyle}
            >
                <TextButton
                    title="질문 추가"
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

            {/* <TargettingModal
                onClose={toggleTargettingModal}
                onConfirm={toggleTargettingModal}
                isTargettingModalVisible={targettingModalVisible}
            /> */}

            <View style={styles.subContainer}>
                {questionsToShow.length === 0 ? (
                    <View style={{ marginVertical: 30 }}>
                        {listHeader()}
                        <View style={{ height: 50 }} />
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
    listHeaderStyle: {
        marginTop: 20,
        marginBottom: 20,
    },
    listFooterStyle: {
        marginTop: 30,
        marginBottom: 20,
        marginHorizontal: marginSizes.l20,
        justifyContent: "center",
    },
});
