import { View, Text, TouchableNativeFeedback, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { commonStyles } from "../../utils/CommonStyles";
import { fontSizes, marginSizes } from "../../utils/sizes";
import TextButton from "../TextButton";
import showToast from "../common/toast/Toast";
import { colors } from "../../utils/colors";
// import Clipboard from "@react-native-community/clipboard";
// import { Clipboard } from "react-native";
// import Clipboard from ''
// import Clipboard from "@react-native-clipboard/clipboard";
// import Clipboard from "@react-native-clipboard/clipboard";

import * as Clipboard from "expo-clipboard";
import { convertTime } from "../../utils/DateFormatter";
import Spacer from "../common/Spacer";

export interface PostedSurveyItem {
    title: string;
    createdAt: string;
    code: string;
    currentParticipation: number;
    participationGoal: number;
    id: number;
}

const PostedSurveyItems = ({
    handleTapAction,
    postedSurveys,
}: {
    handleTapAction: (number) => void;
    postedSurveys: PostedSurveyItem[];
}) => {
    const copyCode = async (code: string) => {
        await Clipboard.setStringAsync(code)
            .then(() => {
                showToast("success", `${code} 가 복사되었습니다.`);
            })
            .catch(error => {
                showToast("error", `${error}`);
            });
    };

    return postedSurveys.length !== 0 ? (
        <View style={{ flex: 1 }}>
            <FlatList
                style={{ paddingVertical: 20 }}
                data={postedSurveys}
                renderItem={({ item }) => (
                    <TouchableNativeFeedback
                        onPress={() => {
                            handleTapAction(item.id);
                        }}
                    >
                        <View
                            style={[
                                commonStyles.border,
                                styles.container,
                                item.currentParticipation === 0 && {
                                    borderColor: colors.gray4,
                                },
                            ]}
                        >
                            {/* <View> */}
                            <View style={{ flex: 1 }}>
                                <Text style={styles.surveyTitle}>
                                    {item.title}
                                </Text>
                                <Spacer size={6} />
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text>
                                        {item.currentParticipation} /{" "}
                                        {item.participationGoal}
                                    </Text>
                                    <Text>{convertTime(item.createdAt)}</Text>
                                </View>
                                <Spacer size={6} />
                            </View>
                            {/* <View>
                            <TextButton
                                title={item.code}
                                onPress={() => {
                                    copyCode(item.code);
                                }}
                                hasShadow={false}
                                backgroundStyle={{
                                    borderRadius: 4,
                                    backgroundColor: colors.gray4,
                                    height: 30,
                                    width: 80,
                                }}
                            />
                        </View> */}
                        </View>
                    </TouchableNativeFeedback>
                )}
                keyExtractor={item => `${item.code}`}
            />
        </View>
    ) : (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text>요청한 설문이 없습니다</Text>
        </View>
    );
};

export default PostedSurveyItems;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: marginSizes.m16,
        borderRadius: 10,
        marginBottom: 12,
        padding: 8,
        gap: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    surveyTitle: {
        fontSize: fontSizes.m20,
        fontWeight: "bold",
    },
});
