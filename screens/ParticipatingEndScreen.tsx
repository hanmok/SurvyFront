import { RouteProp } from "@react-navigation/native";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import { View, Text, StyleSheet } from "react-native";
import DescriptionTextButton from "../components/DescriptionTextButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { fontSizes } from "../utils/sizes";
import Spacer from "../components/common/Spacer";
import TextButton from "../components/TextButton";
import { patchParticipating } from "../API/ParticipatingAPI";
import { useCustomContext } from "../features/context/CustomContext";
import { useEffect, useState } from "react";
import showToast from "../components/common/toast/Toast";

// Update participating-honest

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
    // type HonestType = true | false
    const [selectedReponse, setSelectedResponse] = useState<boolean | null>(
        null
    );

    useEffect(() => {
        const patch = async (selectedResponse: boolean) => {
            await patchParticipating(
                accessToken,
                userId,
                participatingSurveyId,
                selectedReponse
            ).finally(() => {
                updateLoadingStatus(false);
            });
            if (selectedResponse === true) {
                showToast(
                    "success",
                    "설문에 참여해주셔서 감사합니다",
                    "포인트는 검수 후 지급됩니다"
                );
            } else {
                showToast("success", "응답해주셔서 감사합니다");
            }
            navigation.pop(2);
        };

        if (selectedReponse !== null) {
            updateLoadingStatus(true);
            patch(selectedReponse);
        }
    }, [selectedReponse]);

    const {
        accessToken,
        userId,
        participatingSurveyId,
        updateParticipatingSurveyId,
        updateLoadingStatus,
    } = useCustomContext();

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
                    // title="불성실 응답을 했어요"
                    title="대충 응답한 문항이 있어요"
                    description="어떠한 패널티도 주어지지 않습니다. (포인트 지급X)"
                    onPress={() => {
                        setSelectedResponse(false);
                    }}
                    titleStyle={{ fontSize: fontSizes.m20 }}
                    descriptionStyle={{ fontSize: 12, marginTop: 10 }}
                    backgroundStyle={{
                        borderRadius: 12,
                        padding: 10,
                        backgroundColor: "white",
                    }}
                />
                <Spacer size={20} />

                <DescriptionTextButton
                    title="모든 문항에 성실하게 응답했어요"
                    description="불성실 응답으로 판독될 경우 포인트가 지급되지 않으며, 설문 참여에 제한이 있을 수 있습니다."
                    onPress={() => {
                        setSelectedResponse(true);
                    }}
                    titleStyle={{ fontSize: fontSizes.m20 }}
                    descriptionStyle={{ fontSize: 12, marginTop: 10 }}
                    backgroundStyle={{
                        borderRadius: 12,
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
        marginTop: 100,
        marginBottom: 70,
        justifyContent: "space-between",
        flex: 1,
    },
});
