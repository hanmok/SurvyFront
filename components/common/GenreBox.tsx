import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../utils/colors";

export const GenreBox: React.FC<{ name: string }> = ({ name }) => {
    return (
        <View style={styles.genreBox}>
            <Text style={{ color: colors.white, fontWeight: "500" }}>
                {name}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    genreBox: {
        marginRight: 10,
        borderRadius: 6,
        backgroundColor: colors.gray35,
        padding: 6,
    },
});
