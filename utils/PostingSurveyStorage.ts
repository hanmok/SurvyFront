import Storage from "react-native-storage";
import { PostingSurveyState } from "../interfaces/PostingSurveyState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import showToast from "../components/common/toast/Toast";
import showAdminToast from "../components/common/toast/showAdminToast";

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

    save = async (data: PostingSurveyState): Promise<PostingSurveyState> => {
        try {
            await this.storage.save({
                key: "postingSurvey",
                data: data,
                expires: null,
            });
            return data;
        } catch (error) {
            showAdminToast("error", "failed to save postingSurvey");
        }
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
