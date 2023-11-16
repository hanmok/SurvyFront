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
import TextButton from "../components/TextButton";
import { colors } from "../utils/colors";
import { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { getAllGenres } from "../API/GenreAPI";
import { log, logObject } from "../utils/Log";
import { screenHeight, screenWidth } from "../utils/ScreenSize";
import { Genre } from "../interfaces/Genre";
import Spacer from "../components/common/Spacer";

interface GenreSelectionModalProps {
    onClose: () => void;
    onGenreSelection: (selectedGenres: Genre[]) => void;
    isGenreSelectionModalVisible: boolean;
    preSelectedGenres: Genre[];
}

const GenreSelectionModal: React.FC<GenreSelectionModalProps> = ({
    onClose,
    onGenreSelection,
    isGenreSelectionModalVisible,
    preSelectedGenres,
}) => {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    const [satisfied, setSatisfied] = useState(false);
    const [allGenres, setAllGenres] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
    const [showingGenres, setShowingGenres] = useState<Genre[]>([]);
    const [userInput, setUserInput] = useState<string>("");

    useEffect(() => {
        setSelectedGenres(preSelectedGenres);
    }, [preSelectedGenres]);

    const getGenres = async () => {
        getAllGenres().then(response => {
            logObject("fetched genres: ", response.data);
            setAllGenres(response.data);
        });
    };

    useEffect(() => {
        getGenres();
    }, []);

    const toggleGenreSelection = (genre: Genre) => {
        const index = selectedGenres.indexOf(genre);

        if (index === -1) {
            // 새로운 입력
            setSelectedGenres(prev => [...prev, genre]);
        } else {
            // 기존에 있는 입력.
            let currentSelectedGenres = [...selectedGenres];
            currentSelectedGenres.splice(index, 1);
            setSelectedGenres(currentSelectedGenres);
        }
    };

    useEffect(() => {
        setSatisfied(selectedGenres.length !== 0);
        logObject("selectedGenres: ", selectedGenres);
        log("num of selectedGenres: " + selectedGenres.length);
    }, [selectedGenres]);

    useEffect(() => {
        console.log(`userInput: ${userInput}`);

        if (!userInput || userInput !== "") {
            const genresToShow = allGenres.filter(genre =>
                genre.name.includes(userInput)
            );
            setShowingGenres(genresToShow);
        } else {
            setShowingGenres(allGenres);
        }
    }, [userInput, allGenres]);

    return (
        <Modal transparent={true} visible={isGenreSelectionModalVisible}>
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text
                            style={{
                                fontSize: fontSizes.m20,
                                backgroundColor: colors.gray4,
                                // width: screenWidth - 40 * 2,
                                alignSelf: "stretch",
                                textAlign: "center",
                            }}
                        >
                            카테고리 선택
                        </Text>

                        <Spacer size={15} />

                        <View
                            style={{
                                flexDirection: "column",
                                flex: 1,
                                marginHorizontal: 20,
                                marginBottom: 15,
                            }}
                        >
                            <View
                                style={{
                                    marginTop: 10,
                                }}
                            >
                                {/* Search */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <View
                                        style={{
                                            borderRadius: 10,
                                            backgroundColor: "white",
                                            overflow: "hidden",
                                            borderColor: "black",
                                            borderWidth: 1,
                                            width: 240,
                                            height: 35,
                                            justifyContent: "center",
                                            paddingLeft: 10,
                                        }}
                                    >
                                        <TextInput
                                            value={userInput}
                                            onChangeText={setUserInput}
                                            placeholder="관련 카테고리는?"
                                            style={{
                                                fontSize: 16,
                                            }}
                                        />
                                    </View>

                                    <View
                                        style={{
                                            height: 30,
                                            flexDirection: "row",
                                        }}
                                    ></View>
                                    <Spacer size={10} />
                                    <Entypo
                                        name="magnifying-glass"
                                        size={24}
                                        color="black"
                                    />
                                </View>
                                {/* selected Genres */}
                                <View
                                    style={{
                                        borderBottomColor: colors.gray4,
                                        borderBottomWidth: 1,
                                        borderTopColor: colors.gray4,
                                        borderTopWidth: 1,
                                        flex: 0,
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        marginTop: 20,
                                        minHeight: 40,
                                    }}
                                >
                                    {selectedGenres.map(genre => (
                                        <TextButton
                                            title={genre.name}
                                            onPress={() => {
                                                toggleGenreSelection(genre);
                                            }}
                                            key={genre.id}
                                            backgroundStyle={{
                                                backgroundColor: colors.gray1,
                                                padding: 4,
                                                paddingHorizontal: 6,
                                                marginHorizontal: 6,
                                                borderRadius: 6,
                                                height: 30,
                                                marginVertical: 4,
                                            }}
                                            textStyle={{
                                                color: colors.white,
                                            }}
                                        />
                                    ))}
                                </View>
                            </View>

                            <View
                                style={{
                                    flex: 0.9,
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    marginTop: 20,
                                }}
                            >
                                {showingGenres.map(genre => (
                                    <TextButton
                                        title={genre.name}
                                        onPress={() => {
                                            toggleGenreSelection(genre);
                                        }}
                                        backgroundStyle={{
                                            backgroundColor:
                                                selectedGenres.includes(genre)
                                                    ? colors.gray1
                                                    : colors.white,
                                            padding: 4,
                                            paddingHorizontal: 6,
                                            marginHorizontal: 6,
                                            borderRadius: 6,
                                            height: 30,
                                            marginVertical: 4,
                                        }}
                                        textStyle={{
                                            color: selectedGenres.includes(
                                                genre
                                            )
                                                ? colors.white
                                                : colors.black,
                                        }}
                                    />
                                ))}
                            </View>
                        </View>
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
                                    onClose();
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
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 20,
        overflow: "hidden",
    },
    modalContent: {
        height: screenHeight - 100,
        marginVertical: 40,
        marginHorizontal: 20,
        backgroundColor: colors.background,
        borderRadius: 10,
        overflow: "hidden",
        justifyContent: "space-between",
        alignItems: "center",
    },

    rowContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    genreContainer: {
        margin: 8,
        padding: 8,
        backgroundColor: colors.gray3,
        borderRadius: 6,
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
        backgroundColor: "white",
        borderBottomLeftRadius: 10,
    },
    bottomRightButtonTextContainer: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "center",
        borderTopWidth: 1,
        height: 40,
        alignItems: "center",
        margin: 0,
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
    },
    locationTitle: {
        fontSize: fontSizes.m20,
        marginLeft: 50,
    },
});
