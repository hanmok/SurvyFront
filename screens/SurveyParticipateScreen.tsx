import React, { useEffect, useState } from "react";
import { FlatList, SectionList, StyleSheet, Text, View } from "react-native";
import { colors } from "../utils/colors";
import { fontSizes, marginSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../RootStackParamList";
import { Question } from "../types/Question";
import { SelectableOption } from "../types/SelectableOption";
import SelectableOptionBox from "../components/SelectableOptionBox";
import ParticipatingQuestionBox from "../components/ParticipatingQuestionBox";

interface Dictionary<T> {
    [key: number]: Set<T>;
}

function SurveyparticipateScreen({
    route,
}: {
    route: RouteProp<RootStackParamList, "Participate">;
}) {
    // let dictionary = new
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const [selectableOptions, setSelectableOptions] = useState<
        SelectableOption[]
    >([]); //
    const { sectionId } = route.params;

    // selectable Options 도 모두 가져와야함.
    const fetchQuestions = async () => {
        try {
            await fetch(`http://localhost:3000/section/${sectionId}/questions`)
                .then(response => response.json())
                .then(jsonData =>
                    jsonData.data.map((item: Question) => ({
                        id: item.id,
                        position: item.position,
                        text: item.text,
                        required: item.required,
                        expectedTimeInSec: item.expectedTimeInSec,
                        questionType: item.questionType,
                    }))
                )
                .then((questions: Question[]) => {
                    const string = JSON.stringify(questions);
                    console.log(`fetched questions: ${string}`);
                    setQuestions(questions);
                });
        } catch (error) {
            console.log(`Error fetching Questions: ${error.message}`);
        }
    };

    const fetchSelectableOptions = async () => {
        try {
            await fetch(
                `http://localhost:3000/section/${sectionId}/selectable-options`
            )
                .then(response => response.json())
                .then(jsonData =>
                    jsonData.data.map((item: SelectableOption) => ({
                        id: item.id,
                        position: item.position,
                        value: item.value,
                        questionId: item.questionId,
                    }))
                )
                .then((selectableOptions: SelectableOption[]) => {
                    const string = JSON.stringify(questions);
                    // setSelectableOptionIds
                    console.log(`fetched selectableOptions: ${string}`);
                    setSelectableOptions(selectableOptions);
                });
        } catch (error) {
            console.log(`Error fetching Questions: ${error.message}`);
        }
    };

    // // my codes
    //     useEffect(() => {
    //         // await fetchQuestions();
    //         // await fetchSelectableOptions();
    //         // setIsLoading(false);
    //         Promise.all([fetchQuestions(), fetchSelectableOptions()]).then(() => {
    //             // setIsLoading(false);
    //             // mapping
    //             // let myDic = Dictionary<SelectableOption>{};

    //             let myDic: Dictionary<SelectableOption> = {
    //                 344: new Set([]),
    //                 354: new Set([]),
    //             };

    //             for (let index = 0; index < questions.length; index++) {
    //                 myDic[questions[index].id] = new Set<SelectableOption>([]);
    //             }

    //             selectableOptions.forEach(item => {
    //                 myDic[item.questionId].add(item);
    //             });

    //             console.log("hi");

    //             let tempQuestions: Question[] = [];
    //             for (const key in myDic) {
    //                 for (const value of myDic[key].values()) {
    //                     console.log(`key: ${key}, values: ${value.value}`);
    //                 }
    //                 let targetQuestion = questions.find(
    //                     q => q.id === parseInt(key)
    //                 );

    //                 targetQuestion.selectableOptions = Array.from(
    //                     myDic[targetQuestion.id]
    //                 );

    //                 tempQuestions.push(targetQuestion);
    //             }
    //             setQuestions(tempQuestions);

    //             setIsLoading(false);
    //         });
    //     }, []);

    useEffect(() => {
        const fetchAndProcessData = async () => {
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
                setQuestions(questionsArray);

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
                setSelectableOptions(selectableOptionsArray);

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
                setQuestions(tempQuestions);

                setIsLoading(false);
            } catch (error) {
                console.log(`Error fetching data: ${error.message}`);
            }
        };

        fetchAndProcessData();
    }, []);

    if (isLoading) {
        return (
            <View>
                <Text>Loading..</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: Question }) => (
        <View>
            <Text>{item.text}</Text>
            {item.selectableOptions !== undefined &&
            item.selectableOptions.length > 0 ? (
                <Text>`{item.selectableOptions.length}`</Text>
            ) : (
                <Text>no selectable Options</Text>
            )}
        </View>
    );

    return (
        <>
            <Text
                style={{
                    backgroundColor: "blue",
                    color: colors.white,
                    textAlign: "center",
                }}
            >
                {sectionId}
            </Text>

            <FlatList
                data={questions}
                renderItem={renderItem}
                keyExtractor={item => `${item.id}`}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            />
        </>
    );
}

export default SurveyparticipateScreen;
// export default SurveyParticipateScreen;

const styles = StyleSheet.create({
    questionContainerBox: {
        backgroundColor: colors.magenta,
        marginHorizontal: marginSizes.l20,
        marginVertical: marginSizes.s12,
    },
});
