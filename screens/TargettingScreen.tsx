import GeoSelectionModal from "../modals/GeoSelectionModal";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../utils/NavHelper";
// import { NavigationTitle } from "../utils/NavigationTitle";
import { NavigationTitle } from "../utils/NavHelper";
import CostGuideModal from "../modals/CostGuideModal";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import BlockView from "../components/BlockView";
import { Genre } from "../interfaces/Genre";
import { ReactNode } from "react";
import TextButton from "../components/TextButton";
import { colors } from "../utils/colors";
import { fontSizes, marginSizes } from "../utils/sizes";
import React from "react";
import { SimpleLineIcons } from "@expo/vector-icons";
import {
    Button,
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
import Spacer from "../components/common/Spacer";

import { log, logObject } from "../utils/Log";
// import { CustomLocation } from "../utils/Geo";
import { createSurvey } from "../API/SurveyAPI";
import { RouteProp } from "@react-navigation/native";
import GenreSelectionModal from "../modals/GenreSelectionModal";
import { screenWidth } from "../utils/ScreenSize";
import { GeoInfo } from "../interfaces/GeoInfo";
// import { useCustomContext } from "./MyContext";
import { useCustomContext } from "../features/context/CustomContext";
import { deletePostingSurvey } from "../utils/Storage";

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
    const [participationGoal, setParticipationGoal] = useState("10");
    const { surveyTitle, sections, questions } = route.params;

    const [isCostModalVisible, setCostModalVisible] = useState(false);
    const [isGenreModalVisible, setGenreModalVisible] = useState(false);
    const [isGeoModalVisible, setIsGeoModalVisible] = useState(false);

    const [selectedGeos, setSelectedGeos] = useState<GeoInfo[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
    const [isSendPressed, setIsSendPressed] = useState(false);
    const [ageRange, setAgeRange] = useState<number[]>([20, 30]);
    const [price, setPrice] = useState<string>("0");
    const [selectedLocations, setSelectedLocations] = useState<GeoInfo[]>([]);

    const [isFree, setIsFree] = useState(true);
    const [selectedGenderIndex, setSelectedGender] = useState<null>(null);
    const [isSatisfied, setIsSatisfied] = useState(false);
    const [isNextButtonTapped, setIsNextButtonTapped] = useState(false);

    const { updateLoadingStatus, postingSurveyId, updatePostingSurveyId } =
        useCustomContext();

    useEffect(() => {
        if (selectedGeos.length !== 0 && selectedGenres.length !== 0) {
            setIsSatisfied(true);
        } else {
            setIsSatisfied(false);
        }
    }, [ageRange, selectedGenderIndex, selectedGeos, selectedGenres]);

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

    useEffect(() => {
        logObject("participationGoal changed to ", participationGoal);
    }, [participationGoal]);

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

    const toggleGeoModal = () => {
        setIsGeoModalVisible(!isGeoModalVisible);
    };

    const finalConfirmAction = async () => {
        setIsSendPressed(false);
        setCostModalVisible(!isCostModalVisible);

        const genreIds = selectedGenres.map(genre => genre.id);
        const geoIds = selectedGeos.map(geo => geo.id);

        let isTargetMale: number | null = null;

        if (selectedGenderIndex && selectedGenderIndex < 2) {
            isTargetMale = selectedGenderIndex % 2;
        }

        const targetMinAge = ageRange[0];
        const targetMaxAge = ageRange[1];
        const costWithComma = price;

        logObject("[TargettingScreen] sections:", sections);
        logObject("[TargettingScreen] questions", questions);

        const cost = parseInt(costWithComma.replace(/,/g, ""), 10);
        const reward = Math.floor(cost / 3 / parseInt(participationGoal));

        await createSurvey(
            surveyTitle,
            parseInt(participationGoal),
            targetMinAge,
            targetMaxAge,
            genreIds,
            geoIds,
            sections,
            questions,
            isTargetMale,
            reward,
            cost
        );

        // if (ctxData) {
        //     await deletePostingSurvey(ctxData);
        // }

        if (postingSurveyId) {
            await deletePostingSurvey(postingSurveyId);
        }

        // 여기.. 그게 정말 없어야 하나.. ??
        navigation.popToTop();

        // navigation.navigate(NavigationTitle.postedSurveys);
    };

    const toggleGenreModal = () => {
        setGenreModalVisible(!isGenreModalVisible);
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const confirmGeoSelection = (selectedGeos: GeoInfo[]) => {
        setSelectedGeos(selectedGeos);
        toggleGeoModal();
    };

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
                participationGoal={participationGoal}
            />

            <GeoSelectionModal
                onClose={toggleGeoModal}
                confirmGeoSelection={confirmGeoSelection}
                selectedGeos={selectedGeos}
                isGeoModalVisible={isGeoModalVisible}
            />

            <GenreSelectionModal
                onClose={toggleGenreModal}
                onGenreSelection={setSelectedGenres}
                isGenreSelectionModalVisible={isGenreModalVisible}
                preSelectedGenres={selectedGenres}
            />

            {/* <ScrollView> */}
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Age */}
                        <View style={{ width: 300 }}>
                            <AgeSlider setAgeRange={setAgeRange} />
                            <View
                                style={{
                                    backgroundColor: colors.gray4,
                                    height: 1,
                                    width: screenWidth,
                                    marginBottom: 20,
                                }}
                            ></View>
                        </View>
                        {/* 성별 */}
                        <View>
                            <View style={{ width: 300 }}>
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
                                    selectionOptions={["여성", "남성", "무관"]}
                                    selectedIndex={selectedGenderIndex}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                backgroundColor: colors.gray4,
                                height: 1,
                                width: screenWidth,
                                marginVertical: 20,
                            }}
                        ></View>
                        {/* 지역 */}
                        <View
                            style={{
                                flex: 1,
                                marginBottom: 30,
                            }}
                        >
                            <View style={{ width: 300, alignSelf: "center" }}>
                                <Text
                                    style={{
                                        fontSize: fontSizes.m20,
                                        marginBottom: 10,
                                    }}
                                >
                                    지역
                                </Text>
                                {/* Search Box */}
                                <View>
                                    <View style={{ flexDirection: "row" }}>
                                        <TouchableOpacity
                                            onPress={toggleGeoModal}
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
                                </View>
                            </View>
                            {/* 선택된 지역들 */}
                            <View
                                style={{
                                    // flex: 0.9,
                                    flex: 1,
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    flexWrap: "wrap",
                                    marginTop: 10,
                                    marginHorizontal: 30,
                                    // backgroundColor: "cyan",
                                }}
                            >
                                {selectedGeos.map(geo => (
                                    <TextButton
                                        title={`${geo.state} ${geo.city}`}
                                        onPress={() => {}}
                                        backgroundStyle={{
                                            backgroundColor: colors.gray1,
                                            padding: 4,
                                            paddingHorizontal: 6,
                                            marginHorizontal: 6,
                                            borderRadius: 6,
                                            height: 30,
                                            marginVertical: 4,
                                        }}
                                        key={`${geo.id} ${geo.city}`}
                                        textStyle={{
                                            color: colors.white,
                                        }}
                                    />
                                ))}
                            </View>
                        </View>
                        {/* Separator */}
                        <View
                            style={{
                                backgroundColor: colors.gray4,
                                height: 1,
                                width: screenWidth,
                                marginBottom: 20,
                            }}
                        ></View>

                        {/* Genre */}
                        <View
                            style={{
                                flex: 1,
                                marginBottom: 60,
                            }}
                        >
                            <View style={{ width: 300, alignSelf: "center" }}>
                                <Text
                                    style={{
                                        fontSize: fontSizes.m20,
                                        marginBottom: 10,
                                    }}
                                >
                                    카테고리
                                </Text>
                                {/* Search Modal */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        // justifyContent: "center",
                                    }}
                                >
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
                            </View>

                            <View
                                style={{
                                    // flex: 0.9,
                                    flex: 1,
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    flexWrap: "wrap",
                                    marginTop: 10,
                                    marginHorizontal: 30,
                                    // backgroundColor: "magenta",
                                }}
                            >
                                {selectedGenres.map(genre => (
                                    <TextButton
                                        title={genre.name}
                                        onPress={() => {}}
                                        backgroundStyle={{
                                            backgroundColor: colors.gray1,
                                            padding: 4,
                                            paddingHorizontal: 6,
                                            marginHorizontal: 6,
                                            borderRadius: 6,
                                            height: 30,
                                            marginVertical: 4,
                                        }}
                                        textStyle={{
                                            color: colors.white,
                                        }}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Next Button */}
                    <TextButton
                        backgroundStyle={{
                            backgroundColor: isSatisfied
                                ? "#ffffff"
                                : "#b3b3b3", // inactive
                            height: 46,
                            marginBottom: 30,
                            marginHorizontal: 20,
                            borderRadius: 10,
                            marginTop: 30,
                        }}
                        title="다음"
                        textStyle={{
                            color: isSatisfied ? colors.black : "#cbcbcb",
                            fontSize: 18,
                            letterSpacing: 2,
                        }}
                        onPress={() => {
                            // setIsNextButtonTapped(true);
                            handleSendButtonTapped();
                        }}
                    />
                </View>
            </TouchableWithoutFeedback>
            {/* </ScrollView> */}
        </>
    );
};

export default TargettingScreen;

const styles = StyleSheet.create({
    eachBoxTextStyle: { fontSize: fontSizes.m20 },
    modalContainer: {
        flex: 1,
        // backgroundColor: "rgba(0, 0, 0, 0.7)",
        backgroundColor: colors.background,
    },
    modalContent: {
        flexGrow: 1,
        backgroundColor: colors.background,
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
        // margin: 0,
    },
    bottomRightButtonTextContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        borderTopWidth: 1,
        height: 40,
        alignItems: "center",
        // margin: 0,
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
        // marginLeft: 50,
    },
});
