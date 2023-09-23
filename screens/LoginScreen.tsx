import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackParamList";
import { NavigationTitle } from "../utils/NavigationTitle";
import { View, Text, StyleSheet, TextInput, Image } from "react-native";
import { colors } from "../utils/colors";
import TextButton from "../components/TextButton";
import { screenWidth } from "../utils/ScreenSize";
import Spacer from "../components/Spacer";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontSizes } from "../utils/sizes";

export default function LoginScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.login>;
}) {
    return (
        // <View style={styles.mainContainer}>
        <SafeAreaView style={styles.mainContainer}>
            <Spacer size={40} />
            <View>
                <Image source={require("../assets/coin.jpg")} />
            </View>

            {/* <View style={{ height: 20 }} /> */}
            <View>
                <View style={styles.loginInfoContainer}>
                    <TextInput
                        placeholder="Username"
                        style={styles.textInputStyle}
                    />
                </View>
                <View style={{ height: 20 }} />
                <View style={styles.loginInfoContainer}>
                    <TextInput
                        placeholder="Password"
                        style={styles.textInputStyle}
                    />
                </View>
                <View style={{ height: 30 }} />
                <View
                    style={[
                        styles.loginInfoContainer,
                        styles.bottomButtonContainer,
                    ]}
                >
                    <TextButton
                        title="Login"
                        onPress={() => {}}
                        textStyle={styles.loginTextStyle}
                        // backgroundStyle={[
                        //     styles.loginBackgroundStyle,
                        //     styles.loginInfoContainer,
                        // ]}
                    />
                </View>

                <Spacer size={15} />
                <TextButton
                    title="Forgot Password?"
                    onPress={() => {}}
                    textStyle={{
                        color: colors.deepMainColor,
                        fontWeight: "bold",
                    }}
                    backgroundStyle={{ alignItems: "center" }}
                />
            </View>
            <View>
                <TextButton
                    title="Sign Up"
                    onPress={() => {}}
                    textStyle={{
                        fontSize: fontSizes.s16,
                        color: colors.deepMainColor,
                        fontWeight: "bold",
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        // justifyContent: "center",
        justifyContent: "space-between",
        flexGrow: 1,
        alignItems: "center",
    },
    loginInfoContainer: {
        borderRadius: 10,
        borderColor: colors.gray3,
        borderWidth: 2,
        height: 50,
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
    loginBackgroundStyle: { flexDirection: "row" },
    textInputStyle: { flexGrow: 1, paddingHorizontal: 20 },
});
