import { ReactNode } from "react";
import { View } from "react-native";

interface BottomProps {
    onPress?: () => void;
    children: ReactNode;
}

const BottomView: React.FC<BottomProps> = ({ children }) => {
    return <View>{children}</View>;
};

export default BottomView;
