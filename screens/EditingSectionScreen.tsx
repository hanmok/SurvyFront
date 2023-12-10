import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import { RouteProp } from "@react-navigation/native";
import {
    SectionList,
    SectionListRenderItem,
    StyleSheet,
    Text,
    View,
    SectionListData,
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { useCustomContext } from "../features/context/CustomContext";
// import { Section, SectionBuilder, makeSection } from "../interfaces/Section";
import { Section, SectionBuilder } from "../interfaces/Section";
import { Question, makeQuestion } from "../interfaces/Question";
import { colors } from "../utils/colors";
import TextButton from "../components/TextButton";
import { screenWidth } from "../utils/ScreenSize";

export default function EditingSectionScreen({
    navigation,
    route,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.editSection
    >;
    route: RouteProp<RootStackParamList, NavigationTitle.editSection>;
}) {
    const { sections } = route.params;

    const sectionData = [
        new SectionBuilder(1)
            .setQuestions([
                makeQuestion(0, "s1q1", 100, []),
                makeQuestion(1, "s1q2", 100, []),
            ])
            .build(),
        new SectionBuilder(2)
            .setQuestions([
                makeQuestion(0, "s2q1", 100, []),
                makeQuestion(1, "s2q2", 100, []),
            ])
            .build(),
    ];

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.rightNavContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            console.log("touchableOpacity tapped");
                        }}
                    >
                        {/* <FontAwesome5 name="check" size={24} color="black" /> */}
                        <Feather name="check" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const renderItem: SectionListRenderItem<Question> = ({ item }) => (
        <View
            style={{
                backgroundColor: colors.gray4,
                height: 40,
                // alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.gray3,
                paddingLeft: 10,
            }}
        >
            <Text>{item.text}</Text>
        </View>
    );

    const renderSectionHeader = ({
        section,
    }: {
        section: SectionListData<Question, Section>;
    }) => {
        // const sequence = section.sequence ?? 0;

        return (
            <TextButton
                title={`Section ${section.sequence + 1}`}
                onPress={() => {}}
                textStyle={{ textAlign: "left" }}
                backgroundStyle={{
                    backgroundColor: "gray",
                    height: 45,
                    marginTop: 10,
                    paddingLeft: 10,
                }}
            />
        );
    };

    return (
        <View>
            <View
                style={{
                    justifyContent: "flex-end",
                    width: screenWidth,
                    alignSelf: "flex-end",
                    alignItems: "flex-end",
                    paddingRight: 20,
                    // marginTop: 20,
                    // marginVertical: 20,
                    marginTop: 20,
                    marginBottom: 10,
                    // backgroundColor: "magenta",
                }}
            >
                <TextButton
                    title="초기화"
                    onPress={() => {
                        console.log("초기화 tapped");
                    }}
                    textStyle={{ color: colors.myRed }}
                />
            </View>
            <SectionList
                // sections={sections.map(section => ({
                sections={sectionData.map(section => ({
                    title: `Section ${section.sequence + 1}`,
                    data: section.questions || [],
                }))}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.id}`}
                renderSectionHeader={renderSectionHeader}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    rightNavContainer: {
        flexDirection: "row",
        marginRight: 12,
        justifyContent: "space-around",
        gap: 10,
    },
});
