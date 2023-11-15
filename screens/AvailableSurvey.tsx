import React, { ReactNode } from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import { colors } from "../utils/colors";
import TextButton from "../components/TextButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { fontSizes, marginSizes } from "../utils/sizes";
import { Genre } from "../interfaces/Genre";
import Spacer from "../components/common/Spacer";

interface MyCustomComponentProps {
    title: string;
    currentParticipation: number;
    participationGoal: number;
    genres: Genre[];
    onPress: () => void;
}

const AvailableSurvey: React.FC<MyCustomComponentProps> = ({
    title,
    currentParticipation,
    participationGoal,
    genres,
    onPress,
}) => {
    const GenreBox: React.FC<{ name: string }> = ({ name }) => {
        return (
            <View
                style={{
                    marginRight: 10,
                    borderRadius: 6,
                    backgroundColor: colors.gray3,
                    padding: 6,
                }}
            >
                <Text style={{ color: "white", fontWeight: "500" }}>
                    {name}
                </Text>
            </View>
        );
    };

    return (
        <TouchableNativeFeedback onPress={onPress}>
            <View style={styles.container}>
                <Text style={styles.titleText}>{title}</Text>
                <Spacer size={10} />
                {genres && genres.length !== 0 && (
                    <View style={{ marginLeft: 8, flexDirection: "row" }}>
                        {/* Horizontal List 로 만들어야함..  */}
                        {genres.map(genre => (
                            <GenreBox name={genre.name} />
                        ))}
                    </View>
                )}

                {/* <Text style={styles.participationText}>
                    {currentParticipation}/{participationGoal}
                </Text> */}
                <View
                    style={{
                        flexDirection: "row-reverse",
                        alignItems: "flex-end",
                    }}
                ></View>
            </View>
        </TouchableNativeFeedback>
    );
};

export default AvailableSurvey;

const styles = StyleSheet.create({
    container: {
        // height: 120,
        // paddingBottom: 16,
        paddingTop: 6,
        paddingBottom: 30,
        paddingLeft: 20,
        // borderRadius: 20,
        backgroundColor: colors.surveyBoxBackground,

        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 4,
        //     height: 4,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 2,

        // marginHorizontal: 20,
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
});
