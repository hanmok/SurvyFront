import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../../utils/NavHelper";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { Genre } from "../../interfaces/Genre";
import { getAllGenres } from "../../API/GenreAPI";
import { logObject } from "../../utils/Log";
import { useCustomContext } from "../../features/context/CustomContext";
import { getUserGenres, updateUserGenres } from "../../API/UserAPI";
import { colors } from "../../utils/colors";
import { fontSizes } from "../../utils/sizes";
import { screenHeight } from "../../utils/ScreenSize";
import Spacer from "../../components/common/Spacer";
import { Entypo } from "@expo/vector-icons";
import TextButton from "../../components/TextButton";
import { areSetsEqual, setDifference } from "../../utils/Set";
import { DefaultModal } from "../../modals/DefaultModal";
import { commonStyles } from "../../utils/CommonStyles";

// 내 관심사
function MyGenreScreen({
    navigation,
}: {
    navigation: StackNavigationProp<
        RootStackParamList,
        NavigationTitle.myGenre
    >;
}) {
    const [allGenres, setAllGenres] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
    const [initialGenres, setInitialGenres] = useState<Genre[]>([]);
    const { accessToken, userId, updateLoadingStatus } = useCustomContext();
    const [userInput, setUserInput] = useState<string>("");
    const [showingGenres, setShowingGenres] = useState<Genre[]>([]);

    const maxGenreSelection = 5;

    const [confirmTapped, setConfirmTapped] = useState(false);

    useEffect(() => {
        const updateGenres = async () => {
            const updatedGenres = new Set(selectedGenres);
            const prevGenres = new Set(initialGenres);

            if (areSetsEqual(updatedGenres, prevGenres) === false) {
                // deleteAll -> add All
                const updatedGenresArr = selectedGenres.map(genre => genre.id);
                updateLoadingStatus(true);
                await updateUserGenres(
                    userId,
                    accessToken,
                    updatedGenresArr
                ).finally(() => {
                    updateLoadingStatus(false);
                });
                navigation.pop();
            }
        };

        if (confirmTapped) {
            updateGenres();
        }
    }, [confirmTapped]);

    useEffect(() => {
        logObject("selectedGenres", selectedGenres);
        logObject("shoiwngGenres", showingGenres);
    }, [selectedGenres, showingGenres]);

    const toggleGenreSelection = (genre: Genre) => {
        const index = selectedGenres.map(genre => genre.id).indexOf(genre.id);
        logObject("toggle tapped, current selectedGenres", selectedGenres);
        logObject("index: ", index);
        if (index === -1) {
            // 새로운 입력
            if (selectedGenres.length >= maxGenreSelection) {
                alert("관심사는 5개까지만 설정할 수 있습니다.");
            } else {
                setSelectedGenres(prev => [...prev, genre]);
            }
        } else {
            // 기존에 있는 입력.
            let currentSelectedGenres = [...selectedGenres];
            currentSelectedGenres.splice(index, 1);
            setSelectedGenres(currentSelectedGenres);
        }
    };

    useEffect(() => {
        const getGenres = async () => {
            getAllGenres(accessToken).then(response => {
                logObject("fetched genres: ", response);
                setAllGenres(response);
                setShowingGenres(response);
            });
        };

        const getMyGenres = async () => {
            getUserGenres(accessToken, userId).then(response => {
                setInitialGenres(response);
                setSelectedGenres(response);
            });
        };
        getMyGenres();
        getGenres();
    }, []);

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
        <View style={styles.coreContentsContainer}>
            <View
                style={{
                    marginTop: 10,
                }}
            >
                {/* Search */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchTextBox}>
                        <TextInput
                            value={userInput}
                            onChangeText={setUserInput}
                            placeholder="관심 카테고리는?"
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
                    <Entypo name="magnifying-glass" size={24} color="black" />
                </View>

                {/* selected Genres */}
                <View style={styles.selectedGenreListWrapper}>
                    {selectedGenres.map(genre => (
                        <TextButton
                            title={genre.name}
                            onPress={() => {
                                toggleGenreSelection(genre);
                            }}
                            key={`selected${genre.id}`}
                            backgroundStyle={styles.genreButtonBG}
                            textStyle={{
                                color: colors.white,
                            }}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.selectableGenreListWrapper}>
                {showingGenres.map(genre => (
                    <TextButton
                        title={genre.name}
                        onPress={() => {
                            toggleGenreSelection(genre);
                        }}
                        backgroundStyle={
                            selectedGenres
                                .map(genre => genre.id)
                                .includes(genre.id)
                                ? commonStyles.selectedGenreButtonBG
                                : commonStyles.unselectedGenreButtonBG
                        }
                        textStyle={
                            selectedGenres
                                .map(genre => genre.id)
                                .includes(genre.id)
                                ? commonStyles.selectedGenreText
                                : commonStyles.unselectedGenreText
                        }
                        key={`showing${genre.name}`}
                    />
                ))}
            </View>
            <View>
                <TextButton
                    title="확인"
                    onPress={() => {
                        setConfirmTapped(true);
                    }}
                    textStyle={{ color: "white" }}
                    backgroundStyle={{
                        // activated, inactivated
                        backgroundColor: colors.deeperMainColor,
                        borderRadius: 8,
                        height: 45,
                    }}
                />
            </View>
        </View>
    );
}

export default MyGenreScreen;

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
    modalNameText: {
        fontSize: fontSizes.m20,
        backgroundColor: colors.gray4,
        alignSelf: "stretch",
        textAlign: "center",
    },
    coreContentsContainer: {
        flexDirection: "column",
        flex: 1,
        marginHorizontal: 20,
        marginBottom: 15,
        marginTop: 30,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    searchTextBox: {
        borderRadius: 10,
        backgroundColor: "white",
        overflow: "hidden",
        borderColor: "black",
        borderWidth: 1,
        width: 240,
        height: 35,
        justifyContent: "center",
        paddingLeft: 10,
    },

    selectedGenreListWrapper: {
        borderBottomColor: colors.gray4,
        borderBottomWidth: 1,
        borderTopColor: colors.gray4,
        borderTopWidth: 1,
        flex: 0,
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 20,
        minHeight: 40,
    },

    selectableGenreListWrapper: {
        flex: 0.9,
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 20,
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

    genreButtonBG: {
        backgroundColor: colors.gray14,
        padding: 4,
        paddingHorizontal: 10,
        marginHorizontal: 6,
        borderRadius: 14,
        height: 32,
        marginVertical: 4,
    },

    // genreButtonBG: {
    //     backgroundColor: colors.gray1,
    //     padding: 6,
    //     paddingHorizontal: 10,
    //     marginHorizontal: 8,
    //     borderRadius: 8,
    //     height: 36,
    //     marginVertical: 6,
    // },

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
