import Toast, { ToastType } from "react-native-toast-message";

const showAdminToast = (
    messageType: ToastType,
    message: string,
    message2?: string
) => {
    Toast.show({
        type: messageType,
        text1: message,
        text2: message2,
    });
};

export default showAdminToast;
