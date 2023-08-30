import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Alert } from "react-native";
import { colors } from "../utils/colors";
import { fontSizes, marginSizes, borderSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../RootStackParamList";
import { Question } from "../types/Question";
import { SelectableOption } from "../types/SelectableOption";
import SelectableOptionBox from "../components/SelectableOptionBox";
import ParticipatingQuestionBox from "../components/ParticipatingQuestionBox";
import TextButton from "../components/TextButton";
import { useNavigation } from "@react-navigation/native";
import SelectableOptionContainer from "../components/SelectableOptionContainer";
import { initialize } from "../features/selector/selectorSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";

interface Dictionary<T> {
    [key: number]: Set<T>;
}

function SurveyparticipateScreen({
    route,
}: {
    route: RouteProp<RootStackParamList, "Participate">;
}) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const [selectableOptions, setSelectableOptions] = useState<
        SelectableOption[]
    >([]);
    const [shouldGoBack, setShouldGoBack] = useState(false);
    const { sectionId } = route.params;
    const dispatch = useDispatch();
    const selectedIndexes = useSelector((state: RootState) => {
        return state.selector.selectedIndexes;
    });
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", e => {
            // 뒤로가기 버튼 누를 때 호출될 함수
            e.preventDefault(); // 뒤로가기 막기
            showAlertAndGoBack(e);
        });

        return unsubscribe;
    }, [navigation]);

    const showAlertAndGoBack = e => {
        Alert.alert(
            "경고",
            "정말로 뒤로가시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel",
                },
                {
                    text: "확인",
                    onPress: () => {
                        // 확인 버튼 누를 때 처리
                        navigation.dispatch(e.data.action);
                    },
                },
            ],
            { cancelable: false }
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const questionsResponse = await fetch(
                    `http://localhost:3000/section/${sectionId}/questions`
                );
                const questionsData = await questionsResponse.json();
                const questionsArray = questionsData.data.map(
                    (item: Question) => ({
                        id: item.id,
                        position: item.position,
                        text: item.text,
                        required: item.required,
                        expectedTimeInSec: item.expectedTimeInSec,
                        questionType: item.questionType,
                    })
                );

                const selectableOptionsResponse = await fetch(
                    `http://localhost:3000/section/${sectionId}/selectable-options`
                );
                const selectableOptionsData =
                    await selectableOptionsResponse.json();
                const selectableOptionsArray = selectableOptionsData.data.map(
                    (item: SelectableOption) => ({
                        id: item.id,
                        position: item.position,
                        value: item.value,
                        questionId: item.questionId,
                    })
                );

                const myDic: Dictionary<SelectableOption> = {};
                questionsArray.forEach(question => {
                    myDic[question.id] = new Set<SelectableOption>();
                });

                selectableOptionsArray.forEach(item => {
                    myDic[item.questionId].add(item);
                });

                const tempQuestions: Question[] = [];
                for (const key in myDic) {
                    const targetQuestion = questionsArray.find(
                        q => q.id === parseInt(key)
                    );

                    targetQuestion.selectableOptions = Array.from(
                        myDic[targetQuestion.id]
                    );

                    tempQuestions.push(targetQuestion);
                }

                dispatch(initialize(tempQuestions.length));
                console.log("initialize called");
                setIsLoading(false);

                return {
                    questions: tempQuestions,
                    selectableOptions: selectableOptionsArray,
                };
            } catch (error) {
                console.log(`Error fetching data: ${error.message}`);
                setIsLoading(false);
                return null;
            }
        };

        const fetchDataAndSetData = async () => {
            const fetchDataResult = await fetchData();

            if (fetchDataResult) {
                setQuestions(fetchDataResult.questions);
                setSelectableOptions(fetchDataResult.selectableOptions);
            }
        };

        fetchDataAndSetData();
    }, []);

    if (isLoading) {
        return (
            <View>
                <Text>Loading..</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: Question }) => (
        <View style={styles.questionContainerBox}>
            <ParticipatingQuestionBox {...item} />
            {item.selectableOptions !== undefined &&
            item.selectableOptions.length > 0 ? (
                <SelectableOptionContainer
                    selectableOptions={item.selectableOptions}
                    questionType={item.questionType}
                    questionIndex={item.position}
                />
            ) : (
                <Text>no selectable Options</Text>
            )}
        </View>
    );

    return (
        // <View style={{ alignItems: "center" }}>
        <View style={styles.container}>
            <FlatList
                style={styles.flatListStyle}
                data={questions}
                renderItem={renderItem}
                keyExtractor={item => `${item.selectableOptions[0].id} `}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            />

            <TextButton
                title="Finish"
                onPress={() => console.log("")}
                // textStyle={if (selectedIndexes) styles.finishButtonText}
                textStyle={
                    selectedIndexes.every(arr => arr.length !== 0)
                        ? styles.activatedButtonText
                        : styles.inactivatedButtonText
                }
                backgroundStyle={
                    selectedIndexes.every(arr => arr.length !== 0)
                        ? styles.activatedFinishButtonBackground
                        : styles.inactivatedFinishButtonBackground
                }
            />
        </View>
    );
}

export default SurveyparticipateScreen;
// export default SurveyParticipateScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        // marginHorizontal: 10,
        marginHorizontal: 20,
    },

    flatListStyle: {
        alignSelf: "stretch",
    },
    questionContainerBox: {
        backgroundColor: colors.lightMainColor,
        // marginHorizontal: marginSizes.l20,
        marginVertical: marginSizes.s12,
        paddingVertical: 16,
        borderRadius: 20,
        overflow: "hidden",
        paddingBottom: 16,
        alignSelf: "stretch",
    },
    activatedButtonText: {
        textAlign: "center",
        fontSize: fontSizes.m20,
        letterSpacing: 1,
        color: "#fff",
    },
    inactivatedButtonText: {
        textAlign: "center",
        fontSize: fontSizes.m20,
        letterSpacing: 1,
        color: "#DDD",
    },
    activatedFinishButtonBackground: {
        marginTop: 20,
        // backgroundColor: colors.gray3,
        backgroundColor: "#666",
        alignSelf: "stretch",
        padding: 10,
        borderRadius: borderSizes.m10,
    },

    inactivatedFinishButtonBackground: {
        marginTop: 20,
        backgroundColor: "#BBB",
        alignSelf: "stretch",
        padding: 10,
        borderRadius: borderSizes.m10,
    },
});
