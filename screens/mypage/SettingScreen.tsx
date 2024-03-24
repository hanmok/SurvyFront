import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../utils/NavHelper";
import { NavigationTitle } from "../../utils/NavHelper";
import { View, Text, StyleSheet } from "react-native";
import BlockView from "../../components/BlockView";
import { useEffect, useState } from "react";
import TextButton from "../../components/TextButton";
import { colors } from "../../utils/colors";
import { fontSizes } from "../../utils/sizes";
import { useCustomContext } from "../../features/context/CustomContext";
import { UserService } from "../../API/Services/UserService";
import { SafeAreaView } from "react-native-safe-area-context";

function SettingScreen({
	navigation,
}: {
	navigation: StackNavigationProp<
		RootStackParamList,
		NavigationTitle.setting
	>;
}) {
	const userService = new UserService();
	const [resignTapped, setResignTapped] = useState(false);
	const { username, userId, accessToken } = useCustomContext();
	const { resetContext } = useCustomContext();
	useEffect(() => {
		const resign = async (userId: number, accessToken: string) => {
			await userService.removeUser(userId, accessToken);
			navigation.popToTop();
		};

		if (resignTapped) {
			resign(userId, accessToken);
		}
	}, [resignTapped]);

	return (
		// <View>
		// <View style={styles.overall}>
		<SafeAreaView
			style={[
				styles.overall,
				{
					// backgroundColor: "magenta",

					marginTop: 28,
				},
			]}
			edges={["bottom"]}
			// edges={[]}
		>
			{/* <View style={styles.overall}> */}
			{/* <View style={styles.upperContainer}> */}
			<View
				style={{
					flex: 1,
					// backgroundColor: "yellow"
				}}
			>
				<View style={styles.upperContainer}>
					<BlockView
						onPress={() => {
							navigation.navigate(
								NavigationTitle.settingPassword,
								{
									username,
									shouldPopAll: false,
								}
							);
						}}
					>
						<Text
							style={[styles.eachBoxTextStyle, { padding: 20 }]}
						>
							비밀번호 변경
						</Text>
					</BlockView>

					{/* 로그아웃 */}
					{/* TODO: 회원 정보, Token 초기화 */}
					<BlockView
						onPress={() => {
							// navigation.navigate(NavigationTitle.login);
							resetContext();
							// navigation.pop();
							navigation.navigate(NavigationTitle.mainTabs, {
								index: 1,
							});
							// navigation.navigate("로그인");
						}}
					>
						<Text
							style={[styles.eachBoxTextStyle, { padding: 20 }]}
						>
							로그아웃
						</Text>
					</BlockView>

					<View
						style={{
							height: 2,
							backgroundColor: colors.gray4,
						}}
					></View>
					<BlockView
						onPress={() => {
							navigation.navigate(
								NavigationTitle.termsAndCondition
							);
						}}
					>
						<Text
							style={[styles.eachBoxTextStyle, { padding: 20 }]}
						>
							이용약관
						</Text>
					</BlockView>

					<BlockView
						onPress={() => {
							navigation.navigate(NavigationTitle.privacyPolicy);
						}}
					>
						<Text
							style={[styles.eachBoxTextStyle, { padding: 20 }]}
						>
							개인정보 처리 방침
						</Text>
					</BlockView>
				</View>
			</View>

			{/* <View style={{ height: 500 }}></View> */}
			<View style={{ alignItems: "center" }}>
				<TextButton
					title="회원 탈퇴"
					onPress={() => {
						setResignTapped(true);
					}}
					hasShadow={false}
					textStyle={{ color: colors.gray3 }}
				/>
				<View style={styles.bottomLine} />
			</View>
			{/* </View> */}
		</SafeAreaView>
		// </View>
	);
}

export default SettingScreen;

const styles = StyleSheet.create({
	eachBoxTextStyle: { fontSize: fontSizes.m20 },
	overall: {
		justifyContent: "space-around",
		gap: 0,
		padding: 0,
		// alignItems: "center",
		// justifyContent: "flex-start",
		// marginVertical: 30,
		// alignItems: "center",
		marginHorizontal: 20,
		alignContent: "stretch",
		// backgroundColor: "magenta",
		flex: 1,
		marginTop: 0,
		// marginBottom: 30,
		// flexDirection: "column",
	},
	upperContainer: {
		alignSelf: "stretch",
		// marginHorizontal: 20,
		// backgroundColor: "cyan",
		alignContent: "stretch",
		gap: 15,
	},
	bottomLine: {
		backgroundColor: colors.gray3,
		height: 1,
		width: 80,
	},
});
