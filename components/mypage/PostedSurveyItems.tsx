import { View, Text, TouchableNativeFeedback } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { commonStyles } from "../../utils/CommonStyles";
import { fontSizes, marginSizes } from "../../utils/sizes";

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
    return (
        <FlatList
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
                            {
                                marginHorizontal: marginSizes.m16,
                                borderRadius: 10,
                                marginBottom: 12,
                                padding: 8,
                                gap: 6,
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontSize: fontSizes.m20,
                                fontWeight: "bold",
                            }}
                        >
                            {item.title}
                        </Text>
                        {/* <Text>{convertTime(parseInt(item.createdAt))}</Text> */}
                        <Text>
                            {item.currentParticipation} /{" "}
                            {item.participationGoal}
                        </Text>
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
