import { ReactNode } from "react";
import { View } from "react-native";

interface TopProps {
    onPress?: () => void;
    children: ReactNode;
}

const TopView: React.FC<TopProps> = ({ children }) => {
    return <View>{children}</View>;
};

export default TopView;
