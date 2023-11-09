import { TouchableOpacity } from "react-native-gesture-handler";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Alert, Modal, StyleSheet, Animated, Easing } from "react-native";
import { useRef, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import Spacer from "./common/Spacer";
// import Animated from "react-native-reanimated";

interface PopupOption {
    title: string;
    action: () => void;
}

interface PopupProps {
    options: PopupOption[];
}

// const PopupMenu = () => {
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

    // const options = [
    //     {
    //         title: "option 1",
    //         icon: "navigate",
    //         action: () => alert("option 1"),
    //     },
    //     {
    //         title: "option 2",
    //         icon: "push",
    //         action: () => console.log("option 2"),
    //     },
    //     {
    //         title: "option 3",
    //         icon: "navigate",
    //         action: () => console.log("option 3"),
    //     },
    //     {
    //         title: "option 4",
    //         icon: "navigate",
    //         action: () => console.log("option 4"),
    //     },
    // ];
    return (
        <>
            <TouchableOpacity
                onPress={() => {
                    // console.log("tapped");
                    // setVisible(true);
                    // setVisible(true);
                    resizeBox(1);
                }}
            >
                {/* <Entypo name="plus" size={26} /> */}
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
        // backgroundColor: "magenta",
        paddingHorizontal: 10,
        position: "absolute",
        top: 80,
        right: 10,
    },
    option: {
        flexDirection: "row",
        // justifyContent: "space-around",
        // alignItems: "center",
        alignItems: "flex-end",
        paddingVertical: 7,
        borderBottomColor: "#ccc",
    },
});
