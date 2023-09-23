import { Alert } from "react-native";

const showMessageAlert = (title: string, description: string) => {
    Alert.alert(title, description, [
        {
            text: "확인",
        },
    ]);
};

export default showMessageAlert;
