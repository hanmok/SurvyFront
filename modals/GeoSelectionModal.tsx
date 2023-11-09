// import { GeoInfo } from "../interfaces/Survey";
import React, { useEffect, useState } from "react";
import { GeoInfo } from "../interfaces/GeoInfo";
import { Modal, StyleSheet, Text, View } from "react-native";
import {
    FlatList,
    TextInput,
    TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { colors } from "../utils/colors";
import { fontSizes } from "../utils/sizes";
import TextButton from "../components/TextButton";
import { loadWholeGeo } from "../utils/Storage";
import { Entypo } from "@expo/vector-icons";
import { screenHeight, screenWidth } from "../utils/ScreenSize";
import { log, logObject } from "../utils/Log";
import Spacer from "../components/common/Spacer";
import { makeRandomNumber } from "../utils/GetRandomNumber";

interface GeoSelectionModalProps {
    onClose: () => void;
    // onConfirm: () => void;
    confirmGeoSelection: (selectedGeos: GeoInfo[]) => void;
    isGeoModalVisible: boolean;
    selectedGeos: GeoInfo[];
}

// FC: Function Component
// TODO: '전국' 을 안했음..
const GeoSelectionModal: React.FC<GeoSelectionModalProps> = ({
    onClose,
    confirmGeoSelection,
    isGeoModalVisible,
    selectedGeos,
}) => {
    // 1,100,000,000 // 십억.. 그럼.. 어떻게 해야하지 ?? 보이는 Survey 는 뭐로 해야뎌? 음.. code 를 null 로 설정하는건?
    // 아니면 100 이런 애매한 숫자. null 은 약간 위험할 수 있겠다.

    const [selectedState, setSelectedState] = useState<GeoInfo>(null);
    const [selectedCity, setSelectedCity] = useState<GeoInfo>(null);
    const [selectedCities, setSelectedCities] = useState<GeoInfo[]>([]);
    const [selectedStates, setSelectedStates] = useState<GeoInfo[]>([]);
    const [satisfied, setSatisfied] = useState(false);

    const [geos, setGeos] = useState<GeoInfo[]>([]);
    const [allStates, setAllStates] = useState<GeoInfo[]>([]);
    const [citiesToShow, setCitiesToShow] = useState<GeoInfo[]>([]);

    const initialize = () => {
        // setCities([]);
        // setStates([]);
        setSelectedCities([]);
        setSelectedStates([]);
    };

    useEffect(() => {
        setSatisfied(selectedCities.length !== 0);
    }, [selectedCities, selectedStates]);

    useEffect(() => {
        setSelectedCities(selectedGeos); // 이거.. 나눠야 하는거 아니야 ? State, 도시로 나뉘잖아.
        // selectedGeos 에는.. small 만 있을거야. 그런데,

        const statesOnly = selectedGeos.map(geo => geo.state);
        // statesOnly
        const uniqueStates = new Set(statesOnly);

        const preselectedStates = allStates.filter(state => {
            return uniqueStates.has(state.state);
        });
        setSelectedStates(preselectedStates);
        // setSelectedStates
    }, [selectedGeos]);

    // 초기화 버튼을 잠시 둘까?

    // useEffect(() => {
    //     const preSelectedStates = selectedGeos;
    // }, []);

    useEffect(() => {
        // 전체를 포함하는게 있으면, 나머지 것들은 없애야함.

        if (selectedCity) {
            let preSelectedCities = [...selectedCities];

            logObject("selectedCity: ", selectedCity);
            logObject("preselevedCities:", preSelectedCities);
            // 전체가 눌려있는 상태에서 뭔가 다른것을 누른 경우, 전체는 해제시켜줘야함. ㅅㅂ.

            // 어떤 경우든지, 이미 선택되어있는 것이 다시 눌린 경우에는 바로 없애줘야한다.
            if (preSelectedCities.includes(selectedCity)) {
                log("flag 1");
                // logObject('sele')
                const thatIndex = preSelectedCities.findIndex(
                    city => city.code === selectedCity.code
                );
                preSelectedCities.splice(thatIndex, 1);
                setSelectedCities([...preSelectedCities]);
            }
            // 다른 것들은 지우기.
            else if (selectedCity.state === "전국") {
                setSelectedCities([selectedCity]);
                setSelectedStates([selectedCity]);
            }
            // 전체를 선택한 경우 -> 같은 state, 다른 city 제외.
            else if (selectedCity.city === "전체") {
                log("flag 2");
                preSelectedCities = preSelectedCities.filter(
                    city => city.state !== selectedCity.state
                );
                preSelectedCities = preSelectedCities.filter(
                    city => city.state !== "전국"
                );
                // 전국은 있는경우 빼기..
                const updatedSelectedStates = selectedStates.filter(
                    state => state.state !== "전국"
                );
                setSelectedStates([...updatedSelectedStates]);

                setSelectedCities([...preSelectedCities, selectedCity]);
            }
            // 전체가 아닌 city 중 이미 있는 것이 눌렀을 때 -> 제거
            else if (preSelectedCities.includes(selectedCity)) {
                log("flag 3");
                const idx = preSelectedCities.findIndex(
                    ct => ct.id === selectedCity.id
                );
                preSelectedCities.splice(idx, 1);
                preSelectedCities = preSelectedCities.filter(
                    city => city.state !== "전국"
                );

                const updatedSelectedStates = selectedStates.filter(
                    state => state.state !== "전국"
                );
                setSelectedStates([...updatedSelectedStates]);

                setSelectedCities(preSelectedCities);
                // 추가
            } else if (
                preSelectedCities.some(
                    city =>
                        city.state === selectedCity.state &&
                        city.city === "전체"
                )
            ) {
                // preSelectedSmallCities 중에서, selectedSmallCity 와 같은 State 를 가진 것들 중  '전체'를 지워야한다.
                log("flag 4");
                const thatIndex = preSelectedCities.findIndex(
                    city =>
                        city.state === selectedCity.state &&
                        city.city === "전체"
                );

                // const updated = preSelectedCities.splice(thatIndex, 1);
                preSelectedCities.splice(thatIndex, 1); // 새로 추가해야지.
                preSelectedCities = preSelectedCities.filter(
                    city => city.state !== "전국"
                );
                setSelectedCities([...preSelectedCities, selectedCity]);

                const updatedSelectedStates = selectedStates.filter(
                    state => state.state !== "전국"
                );
                setSelectedStates([...updatedSelectedStates]);
            } else {
                log("flag 5");
                preSelectedCities = preSelectedCities.filter(
                    city => city.state !== "전국"
                );
                setSelectedCities([...preSelectedCities, selectedCity]);

                const updatedSelectedStates = selectedStates.filter(
                    state => state.state !== "전국"
                );
                setSelectedStates([...updatedSelectedStates]);
            }
        }
        // selectedCity(null);
        setSelectedCity(null);
    }, [selectedCity]);

    useEffect(() => {
        logObject("selectedSmallCities: ", selectedCities);
    }, [selectedCities]);

    useEffect(() => {
        const getAllGeos = async () => {
            const allGeos = await loadWholeGeo();
            setGeos(allGeos);

            // 대도시
            // 여기서부터 뭔가 문제인데? 어.. ㅋㅋㅋㅋ state 는 모두 "전체" 가 선택된 상황. ㅇㅋ
            const sortedStates = allGeos.filter(
                geo => geo.city === "전체" && geo.state !== "전국"
            );

            const 전국 = allGeos.find(geo => geo.state === "전국");
            sortedStates.unshift(전국);

            setAllStates(sortedStates);
            // logObject("sortedStates", sortedStates);
        };
        getAllGeos();
    }, []);

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
            const first = geos.find(geo => geo.code === selectedState.code);
            selectableCities.unshift(first);

            setCitiesToShow(selectableCities);

            // 새로 눌린 경우. 이전 데이터 중에서, city 를 포함하지 않는 것들은 제거해야함. selectedCities 와 비교 필요.

            const filteredStates = selectedStates.filter(state => {
                return selectedCities.some(smallCity => {
                    const diff = smallCity.code - state.code;
                    return diff >= 0 && diff <= 100_000_000;
                });
            });

            // 눌려있지 않은 state 를 선택
            if (!selectedStates.includes(selectedState)) {
                setSelectedStates([...filteredStates, selectedState]);
                // 이미 눌려있는 state 선택
            } else {
                setSelectedStates([...filteredStates]);
            }
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
                    backgroundColor: selectedStates.includes(item)
                        ? colors.gray1
                        : colors.white,
                    borderColor:
                        selectedState === item
                            ? colors.gray
                            : colors.transparent,
                    borderWidth: selectedState === item ? 2 : 0,
                }}
                textStyle={{
                    color: selectedStates.includes(item)
                        ? colors.white
                        : colors.black,
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
                    backgroundColor: selectedCities.includes(item)
                        ? colors.gray2
                        : colors.gray4,
                }}
                textStyle={{
                    color: selectedCities.includes(item)
                        ? colors.white
                        : colors.black,
                }}
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
                                지역 선택
                            </Text>
                        </View>
                        <Spacer size={14} />
                        {/* Horizontal  */}
                        <View
                            style={{
                                // backgroundColor: "magenta",
                                alignSelf: "stretch",
                                // flexGrow: 0.8,
                                // height: 500,
                                // flexGrow: 0.8,
                                // flexGrow: 0.7,
                                height: 550,
                                flexDirection: "row",
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
                            {/* <View
                            style={{ backgroundColor: colors.gray4, width: 14 }}
                        ></View> */}
                            {/* Right */}
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
                        title="초기화"
                        onPress={initialize}
                        backgroundStyle={{
                            // backgroundColor: "magenta",
                            // backgroundColor: colors.gray3,
                            backgroundColor: colors.gray1,
                            // flex: 1,
                            flexDirection: "column",
                            alignSelf: "stretch",
                            padding: 10,
                            marginHorizontal: 10,
                            borderRadius: 10,
                            // marginVertical: 20,
                        }}
                        textStyle={{ color: "white" }}
                    />
                    {/* Bottom Confirm / Cancel */}
                    <View style={styles.bottomContainer}>
                        <TextButton
                            title="취소"
                            textStyle={styles.bottomTextStyle}
                            onPress={onClose}
                            backgroundStyle={
                                styles.bottomLeftButtonTextContainer
                            }
                        />
                        <TextButton
                            onPress={() => {
                                confirmGeoSelection(selectedCities);
                                onClose();
                            }}
                            title="확인"
                            backgroundStyle={
                                satisfied
                                    ? [
                                          styles.bottomRightButtonTextContainer,
                                          styles.activatedStyle,
                                      ]
                                    : [
                                          styles.bottomRightButtonTextContainer,
                                          styles.inactivatedStyle,
                                      ]
                            }
                            textStyle={styles.bottomTextStyle}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default GeoSelectionModal;

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
        // flexGrow: 0.9,
        height: screenHeight - 100,
        marginVertical: 40,
        marginHorizontal: 20,
        backgroundColor: colors.background,
        borderRadius: 10,
        overflow: "hidden",
        justifyContent: "space-between",
        // justifyContent: ''
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
        // borderRadius: 30,
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
        // gap: 30,
        // marginHorizontal: 20,
    },
});
