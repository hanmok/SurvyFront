import AsyncStorage from "@react-native-async-storage/async-storage";
import Storage from "react-native-storage";
import { UserState } from "../interfaces/UserState";
import { PostingSurveyState } from "../interfaces/PostingSurveyState";

const storage = new Storage({
    storageBackend: AsyncStorage,
});

export const saveUserState = async (data: UserState) => {
    await storage.save({ key: "userInfo", data: data });
};

export const loadUserState = async (): Promise<UserState> => {
    return await storage
        .load({
            key: "userInfo",
            autoSync: true,
            syncInBackground: true,
        })
        .catch(undefined);

    return undefined;
};

export const savePostingSurvey = async (data: PostingSurveyState) => {
    await storage.save({ key: "postingSurvey", data: data });
};

export const loadPostingSurvey = async (): Promise<PostingSurveyState> => {
    return await storage
        .load({
            key: "postingSurvey",
            autoSync: true,
            syncInBackground: true,
        })
        .catch(undefined);
};
