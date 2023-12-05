// import { GeoInfo } from "../interfaces/Survey";
import React, { useEffect, useState } from "react";
import { GeoInfo } from "../interfaces/GeoInfo";
import { Modal, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { colors } from "../utils/colors";
import { fontSizes } from "../utils/sizes";
import TextButton from "../components/TextButton";
// import { loadWholeGeo } from "../utils/Storage";
import { screenHeight } from "../utils/ScreenSize";
import { log, logObject } from "../utils/Log";
import Spacer from "../components/common/Spacer";
// import { geoDataManager } from "../utils/Storage";
import { fetchAllGeoInfos } from "../API/GeoAPI";
import { BottomButtonContainer } from "../components/common/BottomButtonContainer";
import { updateOfficeAddress } from "../API/UserAPI";
import { useCustomContext } from "../features/context/CustomContext";

interface GeoSingleSelectionModalProps {
    onClose: () => void;
    confirmGeoSelection: (selectedGeo: GeoInfo | null) => void;
    isGeoModalVisible: boolean;
    initialGeo: GeoInfo | null;
    isHome: boolean;
}

const GeoSingleSelectionModal: React.FC<GeoSingleSelectionModalProps> = ({
    onClose,
    confirmGeoSelection,
    isGeoModalVisible,
    initialGeo,
    isHome,
}) => {
    const [isNullTapped, setNullTapped] = useState(false);
    const [selectedState, setSelectedState] = useState<GeoInfo>(null);
    const [selectedCity, setSelectedCity] = useState<GeoInfo>(null);
    const [satisfied, setSatisfied] = useState(false);

    const [geos, setGeos] = useState<GeoInfo[]>([]);
    const [allStates, setAllStates] = useState<GeoInfo[]>([]);
    const [citiesToShow, setCitiesToShow] = useState<GeoInfo[]>([]);

    useEffect(() => {
        setSelectedState(null);
        setSelectedCity(null);
    }, [isGeoModalVisible, isHome]);

    useEffect(() => {
        setNullTapped(!initialGeo);
    }, []);

    useEffect(() => {
        if (selectedCity) {
            setNullTapped(false);
        }
    }, [selectedCity]);

    useEffect(() => {
        setSatisfied(selectedCity !== null || isNullTapped);
    }, [selectedCity, selectedState, isNullTapped]);

    useEffect(() => {
        const getAllGeos = async () => {
            const allGeos = await fetchAllGeoInfos();
            setGeos(allGeos);

            const uniqueStates = allGeos.filter(geo => {
                return geo.city === "전체" && geo.state !== "전국";
            });
            logObject("uniqueStates", uniqueStates);

            setAllStates(uniqueStates);
        };
        getAllGeos();
    }, []);

    const initialize = () => {
        setSelectedCity(null);
        setSelectedState(null);
        setNullTapped(true);
    };

    useEffect(() => {
        logObject("useEffect selectedState", selectedState);

        if (selectedState) {
            // set cities to show
            const selectableCities = geos
                .filter(geo => {
                    const diff = geo.code - selectedState.code;
                    return diff > 0 && diff < 100000000;
                }) //  1,100,000,000 // 100,000,000
                .sort((a, b) => (a.city < b.city ? -1 : 1));

            // 전체 (각 state 내 전체 도시 선택 버튼)
            // const firstCity = geos.find(geo => geo.code === selectedState.code);
            // selectableCities.unshift(firstCity);
            // if (selectableCities)

            if (selectableCities.length === 0) {
                const firstCity = geos.find(geo => geo.state === "세종");
                selectableCities.unshift(firstCity);
            }
            setCitiesToShow(selectableCities);

            // 새로 눌린 경우. 이전 데이터 중에서, city 를 포함하지 않는 것들은 제거해야함. selectedCities 와 비교 필요.
        }
    }, [selectedState]);

    const stateItem = ({ item }: { item: GeoInfo }) => {
        return (
            <TextButton
                onPress={() => {
                    setSelectedState(item);
                }}
                title={item.state}
                backgroundStyle={{
                    height: 50,
                    backgroundColor:
                        selectedState === item ? colors.gray1 : colors.white,
                    borderColor:
                        selectedState === item
                            ? colors.gray
                            : colors.transparent,
                    borderWidth: selectedState === item ? 2 : 0,
                }}
                textStyle={{
                    color: selectedState === item ? colors.white : colors.black,
                }}
            />
        );
    };

    const cityItem = ({ item }: { item: GeoInfo }) => {
        return (
            <TextButton
                title={item.city}
                onPress={() => {
                    setSelectedCity(item);
                }}
                backgroundStyle={{
                    height: 50,
                    backgroundColor:
                        selectedCity === item ? colors.gray2 : colors.gray4,
                }}
                textStyle={{
                    color: selectedCity === item ? colors.white : colors.black,
                }}
                hasShadow={false}
            />
        );
    };

    return (
        <Modal transparent={true} visible={isGeoModalVisible}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={{ alignSelf: "stretch" }}>
                        {/* Header */}
                        <View
                            style={{
                                alignSelf: "stretch",
                                height: 40,
                                justifyContent: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: fontSizes.m20,
                                    textAlign: "center",
                                }}
                            >
                                {isHome ? "거주지 선택" : "근무지 선택"}
                            </Text>
                        </View>
                        {/* <Spacer size={14} /> */}
                        <View style={{ height: 14 }} />
                        {/* Horizontal  */}
                        <View
                            style={{
                                // alignSelf: "stretch",
                                height: screenHeight - 300,
                                flexDirection: "row",
                                borderColor: colors.gray4,
                                borderTopWidth: 1,
                                borderBottomWidth: 1,
                            }}
                        >
                            {/* Left */}
                            <View
                                style={{
                                    flex: 0.3,
                                    backgroundColor: colors.gray3,
                                }}
                            >
                                <FlatList
                                    data={allStates}
                                    renderItem={stateItem}
                                    keyExtractor={item => `${item.id}`}
                                />
                            </View>
                            <View
                                style={{
                                    flex: 0.7,
                                }}
                            >
                                <FlatList
                                    data={citiesToShow}
                                    renderItem={cityItem}
                                    keyExtractor={item => `${item.id}`}
                                />
                            </View>
                        </View>
                    </View>

                    <TextButton
                        title="선택 안함"
                        onPress={initialize}
                        backgroundStyle={{
                            backgroundColor: isNullTapped
                                ? colors.gray1
                                : colors.gray4,
                            flexDirection: "column",
                            alignSelf: "stretch",
                            padding: 10,
                            marginHorizontal: 10,
                            borderRadius: 6,
                        }}
                        textStyle={{ color: "white" }}
                    />

                    <BottomButtonContainer
                        leftAction={onClose}
                        rightAction={() => {
                            if (selectedCity !== initialGeo) {
                                confirmGeoSelection(selectedCity);
                            } else if (isNullTapped) {
                                confirmGeoSelection(null);
                            }
                            onClose();
                        }}
                        satisfied={satisfied}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default GeoSingleSelectionModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 20,
        overflow: "hidden",
    },
    modalContent: {
        flex: 1,
        marginVertical: 60,
        marginHorizontal: 20,
        backgroundColor: colors.background,
        borderRadius: 10,
        overflow: "hidden",
        justifyContent: "space-between",
        alignItems: "center",
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexBasis: 40,
    },
    bottomTextStyle: {
        textAlign: "center",
        fontSize: fontSizes.s16,
    },

    bottomLeftButtonTextContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        borderTopWidth: 1,
        borderRightWidth: 1,
        height: 40,
        alignItems: "center",
    },
    bottomRightButtonTextContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        borderTopWidth: 1,
        height: 40,
        alignItems: "center",
    },
    inactivatedStyle: {
        backgroundColor: colors.gray2,
    },
    activatedStyle: {
        backgroundColor: colors.white,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    mainContent: {
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
    },
});
