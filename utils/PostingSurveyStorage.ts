import Storage from "react-native-storage";
import { PostingSurveyState } from "../interfaces/PostingSurveyState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import showToast from "../components/common/toast/Toast";

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
            const postingSurvey: PostingSurveyState | null = await this.storage
                .load({
                    key: "postingSurvey",
                    autoSync: true,
                    syncInBackground: true,
                })
                .catch(() => {
                    return null;
                });
            console.log("postingSurvey load called");
            if (postingSurvey) {
                return postingSurvey;
            } else {
                return null;
            }
        } catch (error) {
            showToast("error", `${error.message}`);
            return null;
        }
    };
}

export const postingSurveyDataManager = new PostingSurveyDataManager();
