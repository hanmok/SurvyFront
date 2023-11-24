import AsyncStorage from "@react-native-async-storage/async-storage";
import Storage from "react-native-storage";
import { UserState } from "../interfaces/UserState";
import { GeoInfo } from "../interfaces/GeoInfo";
import { logObject } from "./Log";
import showAdminToast from "../components/common/toast/showAdminToast";
import showToast from "../components/common/toast/Toast";

class UserDataManager {
    private storage: Storage;

    constructor() {
        this.storage = new Storage({
            storageBackend: AsyncStorage,
        });
    }

    public async initialize() {
        await this.storage.save({ key: "userInfo", data: null, expires: null });
    }

    public async saveUserState(data: UserState): Promise<UserState> {
        // logObject("savedUserState", data);
        // return await this.storage
        //     .save({ key: "userInfo", data, expires: null })
        //     .then(() => {
        //         return data;
        //     })
        //     .catch(error => showToast("error", `${error}`));

        try {
            await this.storage.save({ key: "userInfo", data, expires: null });
            return data;
        } catch (error) {
            showAdminToast("error", `${error.message}`);
        }
    }

    public async loadUserState(): Promise<UserState> {
        try {
            const userState: UserState = await this.storage
                .load({
                    key: "userInfo",
                    autoSync: true,
                    syncInBackground: true,
                })
                .catch(error => {
                    // alert("no userState saved");
                    showAdminToast("error", "no userstate saved");
                });
            logObject("loadedUserState", userState);

            return userState;
        } catch (error) {
            showAdminToast("error", "userState fetching error");
            return null;
        }
    }
}

export const userDataManager = new UserDataManager();
