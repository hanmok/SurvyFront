import { View, Text } from "react-native";
import Toast, {
    BaseToast,
    BaseToastProps,
    ErrorToast,
} from "react-native-toast-message";

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
                color: "orange",
            }}
            text2Style={{
                fontSize: 15,
                // color: "",
            }}
        />
    ),
};

export default toastConfig;
