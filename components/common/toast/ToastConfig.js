import { StyleSheet } from "react-native";
import { BaseToast, ErrorToast } from "react-native-toast-message";

const toastConfig = {
    success: props => (
        <BaseToast
            {...props}
            text1Style={styles.title}
            text2Style={styles.description}
        />
    ),
    error: props => (
        <ErrorToast
            {...props}
            text1Style={[styles.title, { color: "#FF6B00" }]}
            text2Style={styles.description}
        />
    ),
};

export default toastConfig;

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: "700",
    },
    description: {
        fontSize: 14,
    },
});
