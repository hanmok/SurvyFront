import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { fontSizes, marginSizes, paddingSizes } from "../utils/sizes";
import accounting from "accounting";
import { colors } from "../utils/colors";
import { borderSizes } from "../utils/sizes";
interface CollectedMoneyProps {
    amount: number;
}

const CollectedMoney: React.FC<CollectedMoneyProps> = React.memo(
    ({ amount }) => {
        const formattedNumber = accounting.formatNumber(amount);
        return (
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <View
                        style={[
                            styles.centeredTextContainer,
                            styles.overflowHidden,
                        ]}
                    >
                        <Image
                            source={require("../assets/coin.jpg")}
                            style={styles.img}
                        />

                        <Text style={styles.collectedMoney} numberOfLines={1}>
                            {formattedNumber} P
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
);

export default CollectedMoney;

const styles = StyleSheet.create({
    container: {
        borderRadius: borderSizes.m10,
        width: 120,
        marginHorizontal: 12,
        marginTop: 12,
        alignSelf: "flex-start",
        justifyContent: "center",
    },
    subContainer: {
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: borderSizes.m10,
        backgroundColor: colors.lightMainColor,
    },
    img: {
        borderRadius: borderSizes.m10,
        marginLeft: marginSizes.s12,
    },
    collectedMoney: {
        width: 80,
        color: "#3255ED",
        fontSize: fontSizes.s16,
        fontWeight: "bold",
        textAlign: "center",
        borderRadius: borderSizes.m10,
        paddingRight: paddingSizes.xxs4,
    },
    centeredTextContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: 30,
        flexDirection: "row",
        borderRadius: borderSizes.m10,
    },
    overflowHidden: {
        overflow: "hidden",
    },
});
