import { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import { loadUserState } from "../utils/Storage";
import { Survey } from "../interfaces/Survey";
import { login } from "../API/UserAPI";
import axios, { Axios } from "axios";
import { logObject } from "../utils/Log";
import { API_BASE_URL } from "../API/API";
import BlockView from "../components/BlockView";
function ParticipatedSurveysScreen() {
    const [userId, setUserId] = useState<number>(0);
    const [participatedSurveys, setParticipatedSurveys] =
        useState<number>(undefined);

    const getParticipatedSurveys = async () => {
        const myUserId = (await loadUserState()).userId;

        axios({
            method: "GET",
            url: `${API_BASE_URL}/user/${myUserId}/participated-surveys`,
        })
            .then(res => {
                console.log(res.data);
                logObject(`participated surveys`, res.data);
                return res.data;
                // setNumOfParticipatedSurveys(res.data.data.length);
            })
            .then(res => {
                setParticipatedSurveys(res.data.length);
            })
            .catch(err => {});
    };

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

    useEffect(() => {
        console.log(`hi!`);
        getParticipatedSurveys();
    }, []);

    return (
        <View>
            <Text>ParticipatedSurveys {participatedSurveys}</Text>
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
                // style={{ marginTop: 20 }}
                style={{ marginTop: 20, marginHorizontal: 20 }}
            />
        </View>
    );
}

export default ParticipatedSurveysScreen;
