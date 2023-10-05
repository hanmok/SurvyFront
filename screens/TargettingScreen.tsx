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

function TargettingScreen({
    navigation,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.targetting
    >;
}) {
    const handleSendButtonTapped = () => {
        // console.log("send button tapped");
        toggleCostGuideModal();
    };

    const [isCostModalVisible, setCostModalVisible] = useState(false);
    const [isGenreModalVisible, setGenreModalVisible] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
    const [ageRange, setAgeRange] = useState<number[]>([20, 30]);
    const [selectedLocations, setSelectedLocations] = useState<
        CustomLocation[]
    >([]);

    const toggleCostGuideModal = () => {
        setCostModalVisible(!isCostModalVisible);
    };

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
    const blockContainer = ({ text }: { text: string }) => {
        return (
            <BlockView>
                <Text>{text}</Text>
            </BlockView>
        );
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
                onConfirm={toggleCostGuideModal}
                isCostGuideModalVisible={isCostModalVisible}
                expectedTimeInMin={5}
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
                            <GenderSelection />
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
}

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
