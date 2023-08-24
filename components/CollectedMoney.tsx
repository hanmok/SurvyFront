import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { fontSizes, marginSizes } from "../utils/sizes";
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
        borderRadius: 10,
        width: 140,
        marginRight: 12,
        alignSelf: "flex-end", // 오른쪽으로 밀착
        justifyContent: "center",
    },
    subContainer: {
        // contains image and text
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: colors.lightMainColor,
    },
    img: {
        // backgroundColor: "magenta",
        borderRadius: 14,
        paddingLeft: 10,
    },
    collectedMoney: {
        width: 100,
        color: "#3255ED",
        fontSize: fontSizes.m,
        fontWeight: "bold",
        textAlign: "center", // 수평 중앙정렬
        borderRadius: 10,
        paddingRight: 5,
    },
    centeredTextContainer: {
        justifyContent: "center", // 수직 중앙 정렬
        alignItems: "center", // 수평 중앙 정렬
        height: 30,
        flexDirection: "row",
        borderRadius: 10,
    },
    overflowHidden: {
        overflow: "hidden",
    },
});
