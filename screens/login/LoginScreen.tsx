import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../utils/NavHelper";
import { NavigationTitle } from "../../utils/NavHelper";
import {
	View,
	StyleSheet,
	TextInput,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import { colors } from "../../utils/colors";
import TextButton from "../../components/TextButton";
import { screenWidth } from "../../utils/ScreenSize";
import Spacer from "../../components/common/Spacer";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontSizes } from "../../utils/sizes";
import { autoSignin, getUserDetail, signin } from "../../API/UserAPI";
import { UserState } from "../../interfaces/UserState";
// import { loadUserState, saveUserState } from "../../utils/Storage";
import { useEffect, useRef, useState } from "react";
import showMessageAlert from "../../components/CustomAlert";
import { log, logObject } from "../../utils/Log";
import { API_BASE_URL } from "../../API/API";
import { useCustomContext } from "../../features/context/CustomContext";
import { userDataManager } from "../../utils/Storage";

export default function LoginScreen({
	navigation,
}: {
	navigation: StackNavigationProp<RootStackParamList, NavigationTitle.login>;
}) {
	const { updateLoadingStatus } = useCustomContext();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const passwordRef = useRef(null);

	const handleKeyPress = (ref) => {
		ref.current.focus();
	};

	const { updateUserDetail, updateAccessToken, updateUserId } =
		useCustomContext();

	useEffect(() => {
		const fetchPrevInfo = async () => {
			// const prevUserState = await loadUserState();
			const prevUserState = await userDataManager.loadUserState();
			if (prevUserState.refreshToken) {
				// 만약, 만료되었으면?
				try {
					const userResponse = await autoSignin(
						prevUserState.refreshToken
					);
					const userState: UserState = { ...userResponse };
					logObject("userState", userState);

					// await saveUserState({ ...userState });
					userDataManager.saveUserState({ ...userState });
					updateAccessToken(userState.accessToken);
					updateUserId(userState.userId);

					console.log("getUserDetail called");
					const userDetail = await getUserDetail(
						userState.accessToken
					);
					logObject("userDetail", userDetail);
					updateUserDetail(userDetail);

					navigation.navigate(NavigationTitle.mainTabs);
				} catch (error) {
					alert(error.message);
				}
			}
		};
		fetchPrevInfo();
	}, []);

	useEffect(() => {
		const unsubscribeFocus = navigation.addListener("focus", () => {
			setPassword("");
		});
		return unsubscribeFocus;
	}, [navigation]);

	const handleDismissKeyboard = () => {
		console.log("dismiss keyboard called");
		Keyboard.dismiss();
	};

	const loginAction = async (username: string, password: string) => {
		console.log(
			`[LoginScreen] username: ${username}, password: ${password}`
		);

		if (username === "") {
			showMessageAlert("아이디 미입력", "아이디를 입력해주세요.");
			return;
		}
		if (password === "") {
			showMessageAlert("비밀번호 미입력", "비밀번호를 입력해주세요");
			return;
		}

		try {
			updateLoadingStatus(true);
			const userResponse = await signin(username, password);
			const { userId, accessToken, refreshToken } = userResponse;
			const userState: UserState = { userId, accessToken, refreshToken };

			logObject("userState", userState);

			const userDetail = await getUserDetail(userState.accessToken);
			logObject("userDetail", userDetail);
			// await saveUserState(userState);
			await userDataManager.saveUserState(userState);
			updateAccessToken(userState.accessToken);
			updateUserId(userState.userId);

			navigation.navigate(NavigationTitle.mainTabs, undefined);
		} catch (error) {
			showMessageAlert(
				"잘못된 로그인 정보입니다",
				"아이디 또는 비밀번호를 다시 확인해주세요."
			);
			console.error("[LoginScreen], login error:", error);
		} finally {
			updateLoadingStatus(false);
		}
	};

	return (
		<SafeAreaView style={styles.mainContainer}>
			<TouchableWithoutFeedback onPress={handleDismissKeyboard}>
				<View style={[styles.mainContainer]}>
					<Spacer size={40} />

					<View>
						<View style={styles.loginInfoContainer}>
							<TextInput
								placeholder="아이디 입력"
								style={styles.textInputStyle}
								value={username}
								onChangeText={setUsername}
								keyboardType="email-address"
								autoCapitalize="none"
								onSubmitEditing={() => {
									console.log("[LoginScreen] return tapped");
									handleKeyPress(passwordRef);
								}}
							/>
						</View>
						<View style={{ height: 4 }} />
						<View style={styles.loginInfoContainer}>
							<TextInput
								ref={passwordRef}
								placeholder="비밀번호 입력"
								style={styles.textInputStyle}
								value={password}
								onChangeText={setPassword}
								secureTextEntry={true}
								autoCapitalize="none"
								onSubmitEditing={() => {
									console.log(
										"[LoginScreen] return tapped from password textinput"
									);
									loginAction(username, password);
								}}
							/>
						</View>

						<View style={{ height: 30 }} />

						<TextButton
							title="로그인"
							onPress={() => {
								console.log("login tapped");
								// 성공시 여기 화면으로 넘어가기!
								loginAction(username, password);
							}}
							textStyle={styles.loginTextStyle}
							backgroundStyle={[
								styles.loginInfoContainer,
								styles.bottomButtonContainer,
								styles.loginBackgroundStyle,
								{ marginBottom: 10, marginTop: 30 },
							]}
						/>
						<Spacer size={10} />
						<TextButton
							title="회원가입"
							onPress={() => {
								console.log("login tapped");
								// 성공시 여기 화면으로 넘어가기!

								navigation.navigate(NavigationTitle.signup);
							}}
							textStyle={styles.loginTextStyle}
							backgroundStyle={[
								styles.loginInfoContainer,
								styles.bottomButtonContainer,
								styles.loginBackgroundStyle,
							]}
						/>

						<Spacer size={20} />
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-around",
							}}
						>
							<TextButton
								title="아이디 찾기"
								onPress={() => {
									log("forgot ID tapped");
									navigation.navigate(NavigationTitle.findID);
								}}
								textStyle={{
									color: colors.deepMainColor,
									fontWeight: "bold",
								}}
								backgroundStyle={{ alignItems: "center" }}
								hasShadow={false}
							/>

							<TextButton
								title="비밀번호 찾기"
								onPress={() => {
									log("forgot Password tapped");
									navigation.navigate(
										NavigationTitle.findPassword
									);
								}}
								textStyle={{
									color: colors.deepMainColor,
									fontWeight: "bold",
								}}
								hasShadow={false}
								backgroundStyle={{ alignItems: "center" }}
							/>
						</View>
					</View>
					<View></View>
				</View>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		justifyContent: "space-between",
		flexGrow: 1,
		alignItems: "center",
	},
	loginInfoContainer: {
		borderRadius: 10,
		borderColor: colors.gray3,
		borderWidth: 2,
		height: 45,
		flexDirection: "row",
		marginHorizontal: 20,
	},
	bottomButtonContainer: {
		flexDirection: "row",
		justifyContent: "center",
		width: screenWidth - 40,
		marginLeft: 20,
		alignSelf: "center",
		backgroundColor: colors.deepMainColor,
		borderWidth: 0,
	},
	loginTextStyle: { fontSize: 20, justifyContent: "center", color: "white" },
	loginBackgroundStyle: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	textInputStyle: {
		flexGrow: 1,
		paddingHorizontal: 20,
		fontSize: fontSizes.s16,
	},
});
