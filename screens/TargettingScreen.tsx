import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/NavHelper";
// import { NavigationTitle } from "../utils/NavigationTitle";
import { NavigationTitle } from "../utils/NavHelper";
import CostGuideModal from "../modals/CostGuideModal";
import { View, Text, StyleSheet } from "react-native";
import BlockView from "../components/BlockView";

import { ReactNode } from "react";
import TextButton from "../components/TextButton";
import { colors } from "../utils/colors";
import { fontSizes } from "../utils/sizes";
import React from "react";
import { SimpleLineIcons } from "@expo/vector-icons";
import {
    Button,
    FlatList,
    Keyboard,
    Modal,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";
import Geo from "../utils/Geo";

import SelectableTextButton from "../components/SelectableTextButton";

import { useEffect, useState } from "react";
import AgeSlider from "../components/posting/AgeSlider";
import GenderSelection from "../components/posting/GenderSelection";
import { Entypo } from "@expo/vector-icons";
import Spacer from "../components/Spacer";

import { log, logObject } from "../utils/Log";
import { CustomLocation } from "../utils/Geo";
import { createSurvey } from "../API/SurveyAPI";
import { RouteProp } from "@react-navigation/native";
import GenreSelectionModal from "../modals/GenreSelectionModal";

type TargettingScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    NavigationTitle.targetting
>;
type TargettingScreenRouteProp = RouteProp<
    RootStackParamList,
    NavigationTitle.targetting
>;

interface TargettingScreenProps {
    navigation: TargettingScreenNavigationProp;
    route: TargettingScreenRouteProp;
}

const TargettingScreen: React.FC<TargettingScreenProps> = ({
    navigation,
    route,
}) => {
    const handleSendButtonTapped = () => {
        // console.log("send button tapped");
        toggleCostGuideModal();
    };

    // 여기에서 모두 처리해버리기.
    const [participationGoal, setParticipationGoal] = useState(10);
    const { surveyTitle, sections, questions } = route.params;

    const [isCostModalVisible, setCostModalVisible] = useState(false);
    const [isGenreModalVisible, setGenreModalVisible] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
    const [isSendPressed, setIsSendPressed] = useState(false);
    const [ageRange, setAgeRange] = useState<number[]>([20, 30]);
    const [price, setPrice] = useState<string>("0");
    const [selectedLocations, setSelectedLocations] = useState<
        CustomLocation[]
    >([]);

    const [isFree, setIsFree] = useState(true);
    const [selectedGenderIndex, setSelectedGender] = useState(2);

    useEffect(() => {
        console.log(`gender selection: ${selectedGenderIndex}`);
    }, [selectedGenderIndex]);

    useEffect(() => {
        logObject("ageRange:", ageRange);
    }, [ageRange]);

    useEffect(() => {
        logObject("selectedGenres:", selectedGenres);
    }, [selectedGenres]);

    useEffect(() => {
        if (isSendPressed) {
            finalConfirmAction();
        }
    }, [
        isSendPressed,
        ageRange,
        participationGoal,
        selectedGenderIndex,
        selectedGenres,
        price,
    ]);

    const expectedTimeInMin = Math.ceil(
        questions
            .map(q => {
                switch (q.questionTypeId) {
                    case 100:
                        return 5;
                    case 200:
                        return 10;
                    case 300:
                        return 20;
                    default:
                        return 0;
                }
            })
            .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
            ) / 60
    );

    const toggleCostGuideModal = () => {
        setCostModalVisible(!isCostModalVisible);
    };

    const finalConfirmAction = async (): Promise<ApiResponse> => {
        setIsSendPressed(false);
        setCostModalVisible(!isCostModalVisible);
        const genreIds = selectedGenres.map(genre => genre.id);
        const isTargetMale = false;
        const targetMinAge = ageRange[0];
        const targetMaxAge = ageRange[1];
        const costWithComma = price;
        const cost = parseInt(costWithComma.replace(/,/g, ""), 10);
        const reward = Math.floor(cost / 3);

        return createSurvey(
            surveyTitle,
            participationGoal,
            targetMinAge,
            targetMaxAge,
            genreIds,
            sections,
            questions,
            isTargetMale,
            reward,
            cost
        );
    };

    useEffect(() => {}, []);

    const genreItem = ({ item }: { item: Genre }) => {
        return (
            <View
                style={{
                    borderColor: "black",
                    borderRadius: 5,
                    overflow: "hidden",
                    borderWidth: 1,
                    height: 30,
                    marginHorizontal: 5,
                    width: 50,
                }}
            >
                <Text>{item.name}</Text>
            </View>
        );
    };
    const toggleGenreModal = () => {
        setGenreModalVisible(!isGenreModalVisible);
    };

    const handleResign = () => {
        console.log("resign tapped");
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const locationItem = ({ item }: { item: string }) => {
        return (
            <SelectableTextButton
                title={item}
                textStyle={{ alignSelf: "center" }}
                backgroundStyle={styles.locationContainer}
                selectedTextColor="white"
                unselectedTextColor="black"
                selectedBackgroundColor="magenta"
                unselectedBackgroundColor={colors.transparent}
                onPress={() => {
                    let idx = selectedLocations.indexOf({ item });
                    if (idx === -1) {
                        setSelectedLocations(prev => [...prev, { item }]);
                    } else {
                        let prev = selectedLocations;
                        prev.splice(idx, 1);
                        setSelectedLocations(prev);
                    }
                    console.log("selected location: " + item);
                }}
            />
        );
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ marginRight: 10 }}>
                    <SimpleLineIcons
                        name="paper-plane"
                        size={24}
                        color="black"
                        onPress={handleSendButtonTapped}
                    />
                </View>
            ),
        });
    });

    return (
        <>
            <CostGuideModal
                onClose={toggleCostGuideModal}
                onConfirm={finalConfirmAction}
                isFree={isFree}
                setIsFree={setIsFree}
                isCostGuideModalVisible={isCostModalVisible}
                expectedTimeInMin={expectedTimeInMin} // 이거.. 구해야 할 것 같은데?
                setParticipationGoal={setParticipationGoal}
                price={price}
                setPrice={setPrice}
            />
            <GenreSelectionModal
                onClose={toggleGenreModal}
                onGenreSelection={setSelectedGenres}
                isGenreSelectionModalVisible={isGenreModalVisible}
            />
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Age */}
                        <AgeSlider setAgeRange={setAgeRange} />
                        {/* 성별 */}
                        <View>
                            <Text
                                style={{
                                    marginBottom: 20,
                                    fontSize: fontSizes.m20,
                                }}
                            >
                                성별
                            </Text>
                            <GenderSelection
                                onGenderIndexSelection={setSelectedGender}
                            />
                        </View>
                        {/* 지역 */}

                        <View
                            style={{ margin: 10, marginTop: 30, height: 320 }}
                            // style={{ margin: 10, marginTop: 30, flex: 1 }}
                        >
                            <Text
                                style={[
                                    styles.locationTitle,
                                    { marginBottom: 10 },
                                ]}
                            >
                                지역
                            </Text>

                            <FlatList
                                data={Geo[1]}
                                renderItem={locationItem}
                                keyExtractor={item => `${item[0]}`}
                                numColumns={5}
                                style={{
                                    // backgroundColor: "magenta",
                                    backgroundColor: colors.gray4,
                                    // height: 150,
                                    width: "100%",
                                }}
                            />
                        </View>
                        {/* Genre */}
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: fontSizes.m20,
                                    // alignSelf: "center",
                                    marginBottom: 10,
                                }}
                            >
                                Genre
                            </Text>
                            {/* Horizontal Search*/}
                            <View style={{ flexDirection: "row" }}>
                                <TouchableOpacity
                                    onPress={toggleGenreModal}
                                    style={{
                                        borderRadius: 10,
                                        backgroundColor: "white",
                                        overflow: "hidden",
                                        borderColor: "black",
                                        borderWidth: 1,
                                        width: 200,
                                    }}
                                />
                                <Spacer size={10} />
                                <Entypo
                                    name="magnifying-glass"
                                    size={24}
                                    color="black"
                                />
                            </View>
                            {selectedGenres.length !== 0 && (
                                <FlatList
                                    data={selectedGenres}
                                    renderItem={genreItem}
                                    keyExtractor={item => `${item.id}`}
                                    numColumns={5}
                                    style={{
                                        height: 40,
                                        marginTop: 10,
                                        width: "100%",
                                        backgroundColor: "magenta",
                                    }}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </>
    );
};

export default TargettingScreen;

const styles = StyleSheet.create({
    eachBoxTextStyle: { fontSize: fontSizes.m20 },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
        flexGrow: 1,
        // marginVertical: 60, // 전체 화면 관리
        // marginHorizontal: 20,
        backgroundColor: "white",
        // borderRadius: 10,
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 20,
        // gap: 10,
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    bottomTextStyle: {
        textAlign: "center",
        fontSize: fontSizes.s16,
    },

    bottomLeftButtonTextContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        // borderWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        height: 40,
        alignItems: "center",
        margin: 0,
    },
    bottomRightButtonTextContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        borderTopWidth: 1,
        height: 40,
        alignItems: "center",
        margin: 0,
    },
    inactivatedStyle: {
        backgroundColor: colors.gray2,
    },
    activatedStyle: {
        backgroundColor: colors.white,
    },
    locationContainer: {
        width: 60,
        height: 30,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "black",
        overflow: "hidden",
        margin: 5,
        justifyContent: "center",
    },
    locationTitle: {
        fontSize: fontSizes.m20,
        marginLeft: 50,
    },
});
