import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Foundation } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import MypageScreen from "./mypage/MypageScreen";
import HomeScreen from "./HomeScreen";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import ImageButton from "../components/ImageButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { colors } from "../utils/colors";
import LoginScreen from "./login/LoginScreen";
import { useCustomContext } from "../features/context/CustomContext";
import { RouteProp } from "@react-navigation/native";
const Tab = createBottomTabNavigator();
const isLoggedIn = false;

export default function MainTabs({
	navigation,
	route,
}: {
	navigation: StackNavigationProp<
		RootStackParamList,
		NavigationTitle.mainTabs
	>;
	route: RouteProp<RootStackParamList, NavigationTitle.mainTabs>;
}) {
	const { userId } = useCustomContext();
	// const { index } = route.params;
	const initialRouteName =
		route.params?.index === 0 ? "홈" : userId ? "마이페이지" : "로그인";

	return (
		<Tab.Navigator initialRouteName={initialRouteName}>
			<Tab.Screen
				name="홈"
				component={HomeScreen}
				options={({ route }) => ({
					headerTitle: "가능 설문 목록",
					tabBarIcon: ({ focused }) => {
						return (
							<Foundation
								name="home"
								size={24}
								color={focused ? colors.black : "gray"}
							/>
						);
					},
				})}
			/>
			<Tab.Screen
				// name="마이페이지"
				name={userId ? "마이페이지" : "로그인"}
				component={userId ? MypageScreen : LoginScreen}
				options={{
					// headerShown: false,
					tabBarIcon: ({ focused }) => {
						return (
							<Ionicons
								name="person"
								size={24}
								color={focused ? colors.black : "gray"}
							/>
						);
					},
					headerRight: userId
						? ({}) => (
								<ImageButton
									img={require("../assets/settingIcon.png")}
									size={24}
									onPress={() => {
										navigation.navigate(
											NavigationTitle.setting
										);
									}}
									backgroundStyle={{ paddingRight: 20 }}
								/>
						  )
						: undefined,
				}}
			/>
		</Tab.Navigator>
	);
}
