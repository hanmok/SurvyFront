import React from "react";
import {
    Text,
    ViewStyle,
    StyleProp,
    StyleSheet,
    TextStyle,
    View,
} from "react-native";
import { colors } from "../utils/colors";
import { fontSizes } from "../utils/sizes";
import { screenWidth } from "../utils/ScreenSize";

interface ReputationBlockProps {
    textStyle?: StyleProp<TextStyle>;
    backgroundStyle?: StyleProp<ViewStyle>;
    reputation: number;
}

const ReputationBlockView: React.FC<ReputationBlockProps> = ({
    backgroundStyle,
    reputation = 0,
}) => {
    return (
        <View
            style={[styles.container, styles.basicContainer, backgroundStyle]}
        >
            <View style={{ paddingLeft: 20 }}>
                <View style={styles.topContainer}>
                    <Text style={[styles.eachBoxTextStyle, { padding: 20 }]}>
                        신뢰도
                    </Text>
                    <Text
                        style={[styles.eachBoxTextStyle, { paddingRight: 20 }]}
                    >
                        Lv. {Math.max(reputation / 100, 1)}
                    </Text>
                </View>
                {/* Bottom Bar */}
                <View style={{ alignItems: "center" }}>
                    <View
                        style={[
                            styles.progressBar,
                            { width: screenWidth - 100 },
                        ]}
                    >
                        <View
                            style={[
                                styles.progressBar,
                                {
                                    width:
                                        (screenWidth - 100) * (reputation / 50),
                                    backgroundColor: colors.black,
                                },
                            ]}
                        ></View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 100,
    },
    progressBar: {
        backgroundColor: colors.gray4,
        height: 6,
        borderRadius: 3,
    },
    basicContainer: {
        borderRadius: 10,
        backgroundColor: colors.white,
    },
    topContainer: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
    text: { fontSize: fontSizes.l24 },
    eachBoxTextStyle: { fontSize: fontSizes.m20 },
    buttonBackground: {
        backgroundColor: colors.gray3,
        height: 40,
        width: 100,
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        letterSpacing: 2,
    },
});

export default ReputationBlockView;
