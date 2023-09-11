import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Survey } from "../interfaces/Survey";
import { loadUserState } from "../utils/Storage";
import axios from "axios";
import { API_BASE_URL } from "../API/API";
import BlockView from "../components/BlockView";

function PostedSurveysScreen() {
    const [postedSurveys, setPostedSurveys] = useState<number>(undefined);

    const getPostedSurveys = async () => {
        const myUserId = (await loadUserState()).userId;
        axios({
            method: "GET",
            url: `${API_BASE_URL}/user/${myUserId}/posted-surveys`,
        })
            .then(res => res.data)
            .then(res => setPostedSurveys(res.data.length))
            .catch(err => {});
    };

    useEffect(() => {
        console.log(`hi! posted Surveys`);
        getPostedSurveys();
    }, []);

    const renderItem = ({ item }: { item: { id: number; sth: number } }) => (
        <BlockView
            onPress={() => {
                console.log("hi!");
            }}
            backgroundStyle={{}}
        >
            <Text style={{ height: 40 }}>asd</Text>
        </BlockView>
    );

    return (
        <View>
            <Text>PostedSurveys {postedSurveys}</Text>
            <FlatList
                // data={[{id:1},{id:2},{id:3}]}
                data={[
                    { id: 1, sth: 1 },
                    { id: 2, sth: 3 },
                    { id: 3, sth: 4 },
                ]}
                renderItem={renderItem}
                keyExtractor={item => `${item.id}`}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                // style={{ height: 30 }}
                style={{ marginTop: 20, marginHorizontal: 20 }}
            />
        </View>
    );
}

export default PostedSurveysScreen;
