import { RouteProp } from "@react-navigation/native";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import { View, Text, StyleSheet } from "react-native";
import TextButton from "../components/TextButton";
import DescriptionTextButton from "../components/DescriptionTextButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { fontSizes } from "../utils/sizes";
import Spacer from "../components/common/Spacer";

function ParticipatingEndScreen({
    route,
    navigation,
}: {
    route: RouteProp<RootStackParamList, NavigationTitle.endParticipation>;
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.endParticipation
    >;
}) {
    return (
        <View style={styles.container}>
            <Text
                style={{
                    fontSize: fontSizes.l24,
                    textAlign: "center",
                    fontWeight: "bold",
                }}
            >
                설문에 참여해주셔서 감사합니다!
            </Text>

            <View>
                <DescriptionTextButton
                    title="불성실 응답을 했어요"
                    description="어떠한 패널티도 주어지지 않습니다. (포인트 지급X)"
                    onPress={() => {
                        navigation.pop(2);
                    }}
                    titleStyle={{ fontSize: fontSizes.m20 }}
                    descriptionStyle={{ fontSize: 12, marginTop: 10 }}
                    backgroundStyle={{
                        borderRadius: 12,
                        overflow: "hidden",
                        padding: 10,
                        backgroundColor: "white",
                    }}
                />
                <Spacer size={20} />

                <DescriptionTextButton
                    title="모든 문항에 성실하게 응답했어요"
                    description="불성실 응답으로 판독될 경우 포인트가 지급되지 않으며, 추후 설문 참여에 제한이 있을 수 있습니다."
                    onPress={() => {
                        navigation.pop(2);
                    }}
                    titleStyle={{ fontSize: fontSizes.m20 }}
                    descriptionStyle={{ fontSize: 12, marginTop: 10 }}
                    backgroundStyle={{
                        borderRadius: 12,
                        overflow: "hidden",
                        // borderWidth: 1,
                        // borderColor: "black",
                        padding: 10,
                        backgroundColor: "white",
                    }}
                />
            </View>
        </View>
    );
}
export default ParticipatingEndScreen;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        // marginVertical: 100,
        marginTop: 100,
        marginBottom: 70,
        justifyContent: "space-between",
        flex: 1,
    },
});
