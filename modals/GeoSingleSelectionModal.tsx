import React, { useEffect, useState } from "react";
import { GeoInfo } from "../interfaces/GeoInfo";
import { Modal, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { colors } from "../utils/colors";
import { fontSizes } from "../utils/sizes";
import TextButton from "../components/TextButton";
import { screenHeight } from "../utils/ScreenSize";
import { logObject } from "../utils/Log";
import { BottomButtonContainer } from "../components/common/BottomButtonContainer";
import { GeoService } from "../API/Services/GeoService";

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
	const geoService = new GeoService();
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
			const geoResponse = await geoService.fetchAllGeoInfos();
			const allGeos = geoResponse.data;
			setGeos(allGeos);

			const uniqueStates = allGeos.filter((geo) => {
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
				.filter((geo) => {
					const diff = geo.code - selectedState.code;
					return diff > 0 && diff < 100000000;
				}) //  1,100,000,000 // 100,000,000
				.sort((a, b) => (a.city < b.city ? -1 : 1));

			// 전체 (각 state 내 전체 도시 선택 버튼)

			if (selectableCities.length === 0) {
				const firstCity = geos.find((geo) => geo.state === "세종");
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
				backgroundStyle={[
					styles.stateBtnBG,
					{
						backgroundColor:
							selectedState === item
								? colors.white
								: colors.unselectedGeoBG,
					},
				]}
				textStyle={{
					color: selectedState === item ? colors.black : colors.gray2,
					textAlign: "left",
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
						selectedCity === item
							? colors.white
							: colors.unselectedGeoBG,
					paddingLeft: 10,
				}}
				textStyle={{
					color: selectedState === item ? colors.black : colors.gray2,
					textAlign: "left",
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
						<View style={styles.headerContainer}>
							<Text
								style={{
									fontSize: fontSizes.m20,
									textAlign: "center",
								}}
							>
								{isHome ? "거주지 선택" : "근무지 선택"}
							</Text>
						</View>
						<View style={{ height: 14 }} />
						<View style={styles.mainContainer}>
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
									keyExtractor={(item) => `${item.id}`}
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
									keyExtractor={(item) => `${item.id}`}
								/>
							</View>
						</View>
					</View>

					<TextButton
						title="선택 안함"
						onPress={initialize}
						backgroundStyle={[
							styles.initializeBtnBG,
							{
								backgroundColor: isNullTapped
									? colors.gray1
									: colors.gray25,
							},
						]}
						textStyle={{ color: colors.white }}
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
		backgroundColor: colors.modalBackground,
		borderWidth: 1,
		borderColor: colors.black,
		borderRadius: 20,
		overflow: "hidden",
	},
	modalContent: {
		flex: 1,
		marginVertical: 60,
		marginHorizontal: 20,
		backgroundColor: colors.brightBackground,
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
	stateBtnBG: {
		height: 50,
		paddingLeft: 10,
		borderColor: colors.unselectedGeoBG,
		borderRightWidth: 2,
	},
	headerContainer: {
		alignSelf: "stretch",
		height: 40,
		justifyContent: "center",
	},
	mainContainer: {
		height: screenHeight - 300,
		flexDirection: "row",
		borderColor: colors.gray4,
		borderTopWidth: 1,
		borderBottomWidth: 1,
	},
	initializeBtnBG: {
		flexDirection: "column",
		alignSelf: "stretch",
		padding: 10,
		marginHorizontal: 10,
		borderRadius: 6,
	},
});
