import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { fontSizes, marginSizes, paddingSizes } from "../utils/sizes";
import accounting from "accounting";
import { colors } from "../utils/colors";
import { borderSizes } from "../utils/sizes";
interface CollectedMoneyProps {
    amount: number;
}

// 동전 모양 추가해야함
// , 추가해야함 완료
// 동그란 것에 가둬야함.
const CollectedMoney: React.FC<CollectedMoneyProps> = ({ amount }) => {
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
};

export default CollectedMoney;

const styles = StyleSheet.create({
    container: {
        borderRadius: borderSizes.m10,
        width: 120,
        marginHorizontal: 12,
        marginTop: 12,
        // alignSelf: "flex-end", // 오른쪽으로 밀착
        alignSelf: "flex-start",
        justifyContent: "center",
    },
    subContainer: {
        // contains image and text
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
        textAlign: "center", // 수평 중앙정렬
        borderRadius: borderSizes.m10,
        paddingRight: paddingSizes.xxs4,
    },
    centeredTextContainer: {
        justifyContent: "center", // 수직 중앙 정렬
        alignItems: "center", // 수평 중앙 정렬
        height: 30,
        flexDirection: "row",
        borderRadius: borderSizes.m10,
    },
    overflowHidden: {
        overflow: "hidden",
    },
});
