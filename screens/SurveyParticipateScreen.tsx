import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../utils/colors";
import { fontSizes, marginSizes } from "../utils/sizes";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
    Home: undefined;
    Participate: { sectionId: number };
    Posting: undefined;
};

function SurveyparticipateScreen({
    route,
}: {
    route: RouteProp<RootStackParamList, "Participate">;
}) {
    const { sectionId } = route.params;

    return (
        <Text
            style={{
                backgroundColor: "blue",
                color: colors.white,
                textAlign: "center",
            }}
        >
            {sectionId}
        </Text>
    );
}

export default SurveyparticipateScreen;
// export default SurveyParticipateScreen;
