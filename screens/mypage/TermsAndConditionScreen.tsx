import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../../utils/NavHelper";
import { SafeAreaView, View } from "react-native";
import { Text } from "react-native";
import { WebView } from "react-native-webview";
// 개인정보 처리방침: https://iris-drill-fa9.notion.site/1b633598d57149839968488710bda165?pvs=4
function TermsAndConditionScreen({
    navigation,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.termsAndCondition
    >;
}) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <WebView
                // source={{ uri: "https://www.google.com" }}
                source={{
                    uri: "https://iris-drill-fa9.notion.site/10339f22d7fc43049413f56d5453a1d5?pvs=4",
                }}
                style={{ flex: 1 }}
            />
        </SafeAreaView>
    );
}

export default TermsAndConditionScreen;
