import { ReactNode } from "react";
import { View } from "react-native";

interface MiddleProps {
    onPress?: () => void;
    children: ReactNode;
}

const MiddleView: React.FC<MiddleProps> = ({ children }) => {
    return <View>{children}</View>;
};

export default MiddleView;
