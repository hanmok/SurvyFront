import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useCustomContext } from "./context/CustomContext";
import { colors } from "../utils/colors";

export const LoadingIndicator: React.FC = () => {
    const { isLoadingStatus } = useCustomContext();

    return (
        <View style={isLoadingStatus ? styles.loadingContainer : {}}>
            {isLoadingStatus && (
                <ActivityIndicator size="large" color={colors.deepMainColor} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.7)", // 배경 색상 및 투명도 조절
    },
});
