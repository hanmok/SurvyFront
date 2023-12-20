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
import TextButton from "./TextButton";

interface PointBlockProps {
    onPressHistory: () => void;
    onPressWithdrawal: () => void;
    textStyle?: StyleProp<TextStyle>;
    backgroundStyle?: StyleProp<ViewStyle>;
    collectedReward: number;
}

const PointBlockView: React.FC<PointBlockProps> = ({
    onPressHistory,
    onPressWithdrawal,
    backgroundStyle,
    collectedReward = 0,
}) => {
    return (
        <View
            style={[styles.container, styles.basicContainer, backgroundStyle]}
        >
            <View style={{ paddingLeft: 20 }}>
                <View style={styles.topContainer}>
                    <Text style={[styles.eachBoxTextStyle, { padding: 20 }]}>
                        포인트
                    </Text>
                    <Text
                        style={[styles.eachBoxTextStyle, { paddingRight: 20 }]}
                    >
                        {collectedReward} P
                    </Text>
                </View>

                <View
                    style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        marginHorizontal: 20,
                        paddingHorizontal: 20,
                    }}
                >
                    <TextButton
                        title="내역"
                        onPress={onPressHistory}
                        backgroundStyle={styles.buttonBackground}
                        textStyle={styles.buttonText}
                    />
                    <TextButton
                        title="출금"
                        onPress={onPressWithdrawal}
                        backgroundStyle={styles.buttonBackground}
                        textStyle={styles.buttonText}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 120,
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

export default PointBlockView;
