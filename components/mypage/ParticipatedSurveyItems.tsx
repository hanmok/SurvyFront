import { View, Text, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { commonStyles } from "../../utils/CommonStyles";
import { fontSizes, marginSizes } from "../../utils/sizes";
import { ParticipatedSurveyItem } from "../../screens/ParticipatedSurveysScreen";
import accounting from "accounting";
const ParticipatedSurveyItems = ({
    participatedSurveys,
}: {
    participatedSurveys: ParticipatedSurveyItem[];
}) => {
    return (
        <FlatList
            data={participatedSurveys}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => {
                        console.log(`title: ${item.title}, id: ${item.id}`);
                    }}
                    style={[
                        commonStyles.border,
                        {
                            marginHorizontal: marginSizes.m16,
                            borderRadius: 10,
                            marginBottom: 12,
                            padding: 8,
                            gap: 6,
                        },
                    ]}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: fontSizes.m20,
                                fontWeight: "bold",
                            }}
                        >
                            {item.title}
                        </Text>
                        <Text>+{accounting.formatNumber(item.reward)} P</Text>
                    </View>
                    {/* <Text>{convertTime(item.createdAt)}</Text> */}
                </TouchableOpacity>
            )}
            // 참여한 날짜가 아니야.
            // keyExtractor={item => `${item.code}${item.created_at}`}

            keyExtractor={item => `${item.id}${item.title}`}
        />
    );
};

const convertTime = (number: number) => {
    const date = new Date(number * 1000);
    return date.toLocaleDateString().split("/").reverse().join(".");
};

export default ParticipatedSurveyItems;
