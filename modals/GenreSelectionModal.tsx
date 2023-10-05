import {
    FlatList,
    Keyboard,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { fontSizes } from "../utils/sizes";
import SelectableTextButton from "../components/SelectableTextButton";
import TextButton from "../components/TextButton";
import { colors } from "../utils/colors";
import { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { getAllGenres } from "../API/GenreAPI";
import { log, logObject } from "../utils/Log";
import { screenWidth } from "../utils/ScreenSize";

interface GenreSelectionModalProps {
    onClose: () => void;
    onGenreSelection: (selectedGenres: Genre[]) => void;
    isGenreSelectionModalVisible: boolean;
}

const GenreSelectionModal: React.FC<GenreSelectionModalProps> = ({
    onClose,
    onGenreSelection,
    isGenreSelectionModalVisible,
}) => {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    const [satisfied, setSatisfied] = useState(false);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);

    const getGenres = async () => {
        getAllGenres().then(response => {
            logObject("fetched genres: ", response.data);
            setGenres(response.data);
        });
    };

    useEffect(() => {
        getGenres();
    }, []);

    const toggleGenreSelection = (genre: Genre) => {
        const index = selectedGenres.indexOf(genre);

        if (index === -1) {
            setSelectedGenres(prev => [...prev, genre]);
        } else {
            let currentSelectedGenres = selectedGenres;
            currentSelectedGenres.splice(index, 1);
            setSelectedGenres(currentSelectedGenres);
        }
    };

    useEffect(() => {
        setSatisfied(selectedGenres.length !== 0);
        logObject("selectedGenres: ", selectedGenres);
        log("num of selectedGenres: " + selectedGenres.length);
    }, [selectedGenres]);

    const genreItem = ({ item }: { item: Genre }) => {
        return (
            <SelectableTextButton
                title={item.name}
                textStyle={{ alignSelf: "center" }}
                selectedTextColor={colors.white}
                unselectedTextColor="black"
                selectedBackgroundColor={colors.magenta}
                unselectedBackgroundColor={colors.transparent}
                backgroundStyle={styles.locationContainer}
                onPress={() => {
                    toggleGenreSelection(item);
                    console.log("selected genre: " + item.name);
                }}
            />
        );
    };

    return (
        <Modal transparent={true} visible={isGenreSelectionModalVisible}>
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text
                            style={{
                                fontSize: fontSizes.m20,
                                backgroundColor: colors.gray4,
                                width: screenWidth - 40 * 2,
                                textAlign: "center",
                            }}
                        >
                            Genre Modal
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                height: 35,
                                // marginVertical: 30,
                                marginTop: 30,
                                marginBottom: 20,
                                justifyContent: "center",
                            }}
                        >
                            <TextInput
                                style={{
                                    borderColor: "black",
                                    borderRadius: 5,
                                    overflow: "hidden",
                                    borderWidth: 1,
                                    width: 200,
                                }}
                            />
                            <Entypo
                                name="magnifying-glass"
                                size={24}
                                color="black"
                                style={{ alignSelf: "center", marginLeft: 10 }}
                            />
                        </View>
                        <FlatList
                            data={genres}
                            renderItem={genreItem}
                            keyExtractor={item => `${item.id}`}
                            numColumns={2}
                        />
                        <View style={styles.bottomContainer}>
                            <TextButton
                                title="취소"
                                textStyle={styles.bottomTextStyle}
                                onPress={onClose}
                                backgroundStyle={
                                    styles.bottomLeftButtonTextContainer
                                }
                            />
                            <TextButton
                                onPress={() => {
                                    onGenreSelection(selectedGenres);
                                }}
                                title="확인"
                                backgroundStyle={
                                    satisfied
                                        ? [
                                              styles.bottomRightButtonTextContainer,
                                              styles.activatedStyle,
                                          ]
                                        : [
                                              styles.bottomRightButtonTextContainer,
                                              styles.inactivatedStyle,
                                          ]
                                }
                                textStyle={styles.bottomTextStyle}
                            />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
export default GenreSelectionModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 20,
        overflow: "hidden",
    },
    modalContent: {
        flexGrow: 1,
        // marginVertical: 60, // 전체 화면 관리
        marginVertical: 80, // 전체 화면 관리
        // marginHorizontal: 20,
        marginHorizontal: 40,
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "space-between",
        alignItems: "center",
        // paddingTop: 20,
        // gap: 10,
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    bottomTextStyle: {
        textAlign: "center",
        fontSize: fontSizes.s16,
    },

    bottomLeftButtonTextContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        borderTopWidth: 1,
        borderRightWidth: 1,
        height: 40,
        alignItems: "center",
        margin: 0,
    },
    bottomRightButtonTextContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        borderTopWidth: 1,
        height: 40,
        alignItems: "center",
        margin: 0,
        // borderRadius: 30,
    },
    inactivatedStyle: {
        backgroundColor: colors.gray2,
    },
    activatedStyle: {
        backgroundColor: colors.white,
    },
    locationContainer: {
        width: 100,
        height: 30,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "black",
        overflow: "hidden",
        margin: 5,
        justifyContent: "center",
        // marginVertical: 10,
    },
    locationTitle: {
        fontSize: fontSizes.m20,
        marginLeft: 50,
    },
});
