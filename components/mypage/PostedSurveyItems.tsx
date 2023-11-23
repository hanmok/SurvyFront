import { View, Text, TouchableNativeFeedback, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { commonStyles } from "../../utils/CommonStyles";
import { fontSizes, marginSizes } from "../../utils/sizes";
import TextButton from "../TextButton";
import showToast from "../common/toast/Toast";
import { colors } from "../../utils/colors";

interface PostedSurveyItem {
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
    const copyCode = (code: string) => {
        showToast("success", `${code} 가 복사되었습니다.`);
    };

    return (
        <FlatList
            data={postedSurveys}
            renderItem={({ item }) => (
                <TouchableNativeFeedback
                    onPress={() => {
                        handleTapAction(item.id);
                    }}
                >
                    <View style={[commonStyles.border, styles.container]}>
                        <View>
                            <Text style={styles.surveyTitle}>{item.title}</Text>
                            {/* <Text>{convertTime(parseInt(item.createdAt))}</Text> */}
                            <Text>
                                {item.currentParticipation} /{" "}
                                {item.participationGoal}
                            </Text>
                        </View>
                        <View>
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
                        </View>
                    </View>
                </TouchableNativeFeedback>
            )}
            // keyExtractor={item => `${item.code}${item.createdAt}`}
            keyExtractor={item => `${item.code}`}
        />
    );
};

const convertTime = (number: number) => {
    const date = new Date(number);
    return date.toLocaleDateString().split("/").reverse().join(".");
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
