import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../../utils/NavHelper";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Genre } from "../../interfaces/Genre";
import { getAllGenres } from "../../API/GenreAPI";
import { logObject } from "../../utils/Log";
import { useCustomContext } from "../../features/context/CustomContext";
import { getUserGenres } from "../../API/UserAPI";

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

    const { accessToken, userId } = useCustomContext();

    useEffect(() => {
        const getGenres = async () => {
            getAllGenres(accessToken).then(response => {
                logObject("fetched genres: ", response);
                setAllGenres(response);
            });
        };

        const getMyGenres = async () => {
            getUserGenres(accessToken, userId).then(response => {
                setSelectedGenres(response);
            });
        };
        getGenres();
        getMyGenres();
    }, []);

    return (
        <View>
            <Text>내 관심사</Text>
        </View>
    );
}

export default MyGenreScreen;
