import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { fontSizes, paddingSizes } from "../utils/sizes";
import accounting from "accounting";
import { colors } from "../utils/colors";

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
                <View style={styles.centeredTextContainer}>
                    <Image
                        source={require("../assets/coin.jpg")}
                        style={styles.img}
                    />

                    <Text style={styles.collectedMoney} numberOfLines={1}>
                        {formattedNumber} 원
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default CollectedMoney;

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        // backgroundColor: "#0cc",
        width: 130,
        paddingRight: 12,
        alignSelf: "flex-end", // 오른쪽으로 밀착
        justifyContent: "center",
    },
    subContainer: {
        // contains image and text
        flexDirection: "row",
        justifyContent: "center",
    },
    img: {
        backgroundColor: "magenta",
    },
    collectedMoney: {
        width: 100,
        // backgroundColor: colors.gray2,

        fontSize: fontSizes.m,
        textAlign: "center", // 수평 중앙정렬
    },
    centeredTextContainer: {
        justifyContent: "center", // 수직 중앙 정렬
        alignItems: "center", // 수평 중앙 정렬
        height: 30,
        flexDirection: "row",
    },
});
