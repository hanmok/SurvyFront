import GeoMultipleSelectionModal from "../modals/GeoMultipleSelectionModal";
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
import { buttonColors, colors } from "../utils/colors";
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

import SelectableTextButton from "../components/SelectableTextButton";

import { useEffect, useState } from "react";
import AgeSlider from "../components/posting/AgeSlider";
import GenderSelection from "../components/posting/GenderSelection";
import { Entypo } from "@expo/vector-icons";
import Spacer from "../components/common/Spacer";

import { log, logObject } from "../utils/Log";
// import { CustomLocation } from "../utils/Geo";
// import { createSurvey } from "../API/SurveyAPI";
import { RouteProp } from "@react-navigation/native";
import GenreSelectionModal from "../modals/GenreSelectionModal";
import { screenWidth } from "../utils/ScreenSize";
import { GeoInfo } from "../interfaces/GeoInfo";
// import { useCustomContext } from "./MyContext";
import { useCustomContext } from "../features/context/CustomContext";
import { postingSurveyDataManager } from "../utils/PostingSurveyStorage";
import showToast from "../components/common/toast/Toast";
import { SurveyService } from "../API/Services/SurveyService";
import FreeCostGuideModal from "../modals/FreeCostGuideModal";
// import { initializePostingSurvey } from "../utils/PostingSurveyStorage";
// import { deletePostingSurvey } from "../utils/Storage";

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
    const surveyService = new SurveyService();
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
    const [selectedGenderIndex, setSelectedGender] = useState<number>(2);
    const [isSatisfied, setIsSatisfied] = useState(false);
    const [isNextButtonTapped, setIsNextButtonTapped] = useState(false);

    const {
        updateLoadingStatus,
        postingSurveyId,
        updatePostingSurveyId,
        userId,
        accessToken,
    } = useCustomContext();

    useEffect(() => {
        const isSatisfied =
            selectedGeos.length !== 0 && selectedGenres.length !== 0;
        setIsSatisfied(isSatisfied);
    }, [selectedGeos, selectedGenres]);

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

        await surveyService.createSurvey(
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
            cost,
            userId,
            accessToken
        );

        if (postingSurveyId) {
            postingSurveyDataManager.initialize();
        }
        // navigate to home
        showToast(
            "success",
            "설문이 요청되었습니다. ",
            "마이페이지-요청한 설문 에서 확인하실 수 있습니다."
        );
        navigation.pop(2);
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
            {/* <CostGuideModal
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
            /> */}
            <FreeCostGuideModal
                onClose={toggleCostGuideModal}
                onConfirm={finalConfirmAction}
                isCostGuideModalVisible={isCostModalVisible}
                participationGoal={participationGoal}
                setParticipationGoal={setParticipationGoal}
            />

            <GeoMultipleSelectionModal
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
                        <View style={styles.sectionUpperContainer}>
                            <AgeSlider setAgeRange={setAgeRange} />
                            <View style={styles.topDivider}></View>
                        </View>
                        {/* 성별 */}
                        <View>
                            <View style={styles.sectionUpperContainer}>
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
                        <View style={styles.middleDivider}></View>
                        {/*  */}
                        {/* 지역 */}
                        <View
                            style={{
                                flex: 1,
                                marginBottom: 30,
                                // backgroundColor: "cyan",
                            }}
                        >
                            <View style={styles.sectionUpperContainer}>
                                <Text style={styles.geoGuideText}>지역</Text>
                                {/* Search Box */}
                                <View>
                                    <View style={styles.geoSearchBarContainer}>
                                        <TouchableOpacity
                                            onPress={toggleGeoModal}
                                            style={styles.searchBar}
                                        />
                                        <Spacer size={10} />
                                        <Entypo
                                            name="magnifying-glass"
                                            size={32}
                                            color={colors.black}
                                        />
                                    </View>
                                </View>
                            </View>
                            {/* 선택된 지역들 */}
                            <View
                                style={{
                                    width: screenWidth - 80,
                                    alignItems: "flex-start",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    flexWrap: "wrap",
                                    marginTop: 10,
                                    alignSelf: "flex-start",
                                }}
                            >
                                {selectedGeos.map(geo => (
                                    <TextButton
                                        title={`${geo.state} ${geo.city}`}
                                        onPress={() => {}}
                                        backgroundStyle={styles.geoGenreItemBG}
                                        key={`${geo.id} ${geo.city}`}
                                        textStyle={{
                                            color: colors.white,
                                        }}
                                    />
                                ))}
                            </View>
                        </View>

                        {/* Separator */}
                        <View style={styles.middleDivider} />

                        {/*  */}
                        {/* 카테고리 */}

                        <View style={{ flex: 1 }}>
                            <View style={styles.sectionUpperContainer}>
                                <Text style={styles.geoGuideText}>
                                    카테고리
                                </Text>
                                {/* Search Box */}
                                <View>
                                    <View style={styles.geoSearchBarContainer}>
                                        <TouchableOpacity
                                            onPress={toggleGenreModal}
                                            style={styles.searchBar}
                                        />
                                        <Spacer size={10} />
                                        <Entypo
                                            name="magnifying-glass"
                                            size={32}
                                            color={colors.black}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    width: screenWidth - 80,
                                    alignItems: "flex-start",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    flexWrap: "wrap",
                                    marginTop: 10,
                                }}
                            >
                                {selectedGenres.map(genre => (
                                    <TextButton
                                        title={genre.name}
                                        onPress={() => {}}
                                        backgroundStyle={styles.geoGenreItemBG}
                                        textStyle={{ color: colors.white }}
                                        key={`${genre.id}`}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Next Button */}
                    <TextButton
                        backgroundStyle={[
                            styles.nextBtnBG,
                            {
                                backgroundColor: isSatisfied
                                    ? buttonColors.enabledButtonBG
                                    : buttonColors.disabledButtonBG,
                            },
                        ]}
                        hasShadow={false}
                        title="다음"
                        textStyle={[
                            styles.nextButtonText,
                            { color: colors.white },
                        ]}
                        onPress={() => {
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
    sectionUpperContainer: {
        width: screenWidth - 80,
        // backgroundColor: "magenta"
    },
    geoGuideText: {
        fontSize: fontSizes.m20,
        marginBottom: 10,
    },
    geoSearchBarContainer: {
        flexDirection: "row",
        justifyContent: "center",
        height: 36,
        marginTop: 10,
    },
    searchBar: {
        borderRadius: 10,
        backgroundColor: colors.white,
        overflow: "hidden",
        borderColor: colors.black,
        borderWidth: 1,
        flex: 1,
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
        borderColor: colors.black,
        overflow: "hidden",
        margin: 5,
        justifyContent: "center",
    },
    locationTitle: {
        fontSize: fontSizes.m20,
        // marginLeft: 50,
    },
    nextButtonText: {
        color: colors.black,
        textAlign: "center",
        fontSize: fontSizes.m20,
        fontWeight: "bold",
        letterSpacing: 1,
    },
    topDivider: {
        backgroundColor: colors.gray4,
        height: 1,
        width: screenWidth,
        marginBottom: 20,
    },
    middleDivider: {
        backgroundColor: colors.gray4,
        height: 1,
        width: screenWidth,
        marginVertical: 20,
    },
    geoGenreItemBG: {
        backgroundColor: colors.gray1,
        padding: 4,
        paddingHorizontal: 6,
        marginRight: 12,
        borderRadius: 6,
        height: 30,
        marginVertical: 4,
    },
    nextBtnBG: {
        height: 46,
        marginBottom: 30,
        marginHorizontal: 20,
        borderRadius: 10,
        marginTop: 30,
    },
});
