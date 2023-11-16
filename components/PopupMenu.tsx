import { TouchableOpacity } from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";
import { Modal, StyleSheet, Animated, Easing } from "react-native";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";

interface PopupOption {
    title: string;
    action: () => void;
}

interface PopupProps {
    options: PopupOption[];
}

const PopupMenu: React.FC<PopupProps> = ({ options }) => {
    const [visible, setVisible] = useState(false);
    const scale = useRef(new Animated.Value(0)).current;

    function resizeBox(to) {
        to === 1 && setVisible(true);
        Animated.timing(scale, {
            toValue: to,
            useNativeDriver: true,
            duration: 200,
            easing: Easing.linear,
        }).start(() => to === 0 && setVisible(false));
    }

    return (
        <>
            <TouchableOpacity
                onPress={() => {
                    resizeBox(1);
                }}
            >
                <Entypo
                    name="dots-three-horizontal"
                    size={24}
                    color="black"
                    onPress={() => {
                        setVisible(true);
                        console.log("entypo called");
                    }}
                />
            </TouchableOpacity>
            <Modal transparent visible={visible}>
                <SafeAreaView
                    style={{
                        flex: 1,
                    }}
                    onTouchStart={() => {
                        resizeBox(0);
                    }}
                >
                    <Animated.View
                        style={[
                            styles.popup,
                            {
                                opacity: scale.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1],
                                }),
                            },
                            { transform: [{ scale }] },
                        ]}
                    >
                        {options.map((op, i) => (
                            <TouchableOpacity
                                style={[
                                    styles.option,
                                    {
                                        borderBottomWidth:
                                            i === options.length - 1 ? 0 : 1,
                                    },
                                ]}
                                key={i}
                                onPress={() => {
                                    // console.log(`op ${i} tapped`);
                                    op.action();
                                }}
                            >
                                <Text style={{ textAlign: "left" }}>
                                    {op.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </Animated.View>
                </SafeAreaView>
            </Modal>
        </>
    );
};

export default PopupMenu;

const styles = StyleSheet.create({
    popup: {
        borderRadius: 8,
        borderColor: "#333",
        borderWidth: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        position: "absolute",
        top: 80,
        right: 10,
    },
    option: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingVertical: 7,
        borderBottomColor: "#ccc",
    },
});
