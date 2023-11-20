import Storage from "react-native-storage";
import { PostingSurveyState } from "../interfaces/PostingSurveyState";
import AsyncStorage from "@react-native-async-storage/async-storage";

class PostingSurveyDataManager {
    private storage: Storage;

    constructor() {
        this.storage = new Storage({
            storageBackend: AsyncStorage,
        });
    }

    initialize = async () => {
        await this.storage.save({
            key: "postingSurvey",
            data: null,
            expires: null,
        });
    };

    save = async (data: PostingSurveyState) => {
        await this.storage.save({
            key: "postingSurvey",
            data: data,
            expires: null,
        });
    };

    load = async (): Promise<PostingSurveyState | null> => {
        try {
            const postingSurvey: PostingSurveyState = await this.storage.load({
                key: "postingSurvey",
                autoSync: true,
                syncInBackground: true,
            });
            if (postingSurvey) {
                return postingSurvey;
            } else {
                return null;
            }
        } catch (error) {
            // console.error("PostingSurvey Not Found");
            return null;
        }
    };
}

export const postingSurveyDataManager = new PostingSurveyDataManager();
