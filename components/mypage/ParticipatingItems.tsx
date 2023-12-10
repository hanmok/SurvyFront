import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { commonStyles } from "../../utils/CommonStyles";
import { fontSizes, marginSizes } from "../../utils/sizes";
import { GQLParticipating } from "../../interfaces/GQLInterface";
import { ParticipatingItem } from "../../screens/ParticipatedSurveysScreen";

const ParticipatingItems = ({
    participatings,
}: {
    participatings: ParticipatingItem[];
}) => {
    return (
        <FlatList
            data={participatings}
            renderItem={({ item }) => (
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
                            {item.id}
                        </Text>
                    </View>
                </View>
            )}
            keyExtractor={item => `${item.id}`}
        />
    );
};

export default ParticipatingItems;
