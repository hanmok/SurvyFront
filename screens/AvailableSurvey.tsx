import React from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import { colors } from "../utils/colors";
import { fontSizes, marginSizes } from "../utils/sizes";
import { Genre } from "../interfaces/Genre";
import Spacer from "../components/common/Spacer";

interface MyCustomComponentProps {
    title: string;
    currentParticipation: number;
    participationGoal: number;
    genres: Genre[];
    onPress: () => void;
    createdAt: string;
    expectedTimeInSec: number;
}

const AvailableSurvey: React.FC<MyCustomComponentProps> = ({
    title,
    currentParticipation,
    participationGoal,
    genres,
    onPress,
    createdAt,
    expectedTimeInSec,
}) => {
    const GenreBox: React.FC<{ name: string }> = ({ name }) => {
        return (
            <View style={styles.genreBox}>
                <Text style={{ color: colors.white, fontWeight: "500" }}>
                    {name}
                </Text>
            </View>
        );
    };

    const convertToMin = (expectedTimeInSec: number) => {
        return Math.ceil(expectedTimeInSec / 60.0);
    };

    return (
        <TouchableNativeFeedback onPress={onPress}>
            <View style={styles.container}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingRight: 10,
                    }}
                >
                    <Text style={styles.titleText}>{title}</Text>
                    {/* <Text>{convertToMin(expectedTimeInSec)} 분</Text> */}
                </View>
                <Spacer size={10} />
                {genres && genres.length !== 0 ? (
                    <View style={{ marginLeft: 8, flexDirection: "row" }}>
                        {genres.map(genre => (
                            <GenreBox name={genre.name} key={genre.name} />
                        ))}
                    </View>
                ) : (
                    <View style={{ marginLeft: 8, flexDirection: "row" }}>
                        <GenreBox name="일반" />
                    </View>
                )}

                {/* <Text style={styles.participationText}>
                    {currentParticipation}/{participationGoal}
                </Text> */}

                <View style={styles.createdDateContainer}>
                    <View
                        style={{
                            borderRadius: 8,
                            backgroundColor: colors.gray4,
                            overflow: "hidden",
                            paddingHorizontal: 10,
                            paddingVertical: 3,
                        }}
                    >
                        <Text style={{ fontSize: 18 }}>
                            {convertToMin(expectedTimeInSec)}분
                        </Text>
                    </View>
                    <Text>{createdAt}</Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};

export default AvailableSurvey;

const styles = StyleSheet.create({
    container: {
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 20,
        backgroundColor: colors.surveyBoxBackground,
    },
    titleText: {
        color: colors.black,
        fontSize: fontSizes.m20,
        marginTop: marginSizes.s12,
        marginHorizontal: marginSizes.s12,
        fontWeight: "bold",
    },
    participationText: {
        marginTop: 8,
        color: colors.gray1,
        fontSize: fontSizes.s16,
        marginHorizontal: marginSizes.s12,
    },
    participateButtonText: {
        fontSize: fontSizes.s16,
        marginRight: marginSizes.m16,
        marginTop: marginSizes.l20,
    },
    genreBox: {
        marginRight: 10,
        borderRadius: 6,
        backgroundColor: colors.gray35,
        padding: 6,
    },
    createdDateContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        paddingLeft: 8,
        paddingRight: 12,
        paddingVertical: 8,
    },
});
