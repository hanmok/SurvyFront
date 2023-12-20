import { BaseToast, ErrorToast } from "react-native-toast-message";

const toastConfig = {
    success: props => (
        <BaseToast
            {...props}
            text1Style={{
                fontSize: 18,
                fontWeight: "700",
            }}
            text2Style={{
                fontSize: 14,
            }}
        />
    ),
    error: props => (
        <ErrorToast
            {...props}
            text1Style={{
                fontSize: 18,
                color: "#FF6B00",
            }}
            text2Style={{
                fontSize: 15,
            }}
        />
    ),
};

export default toastConfig;
