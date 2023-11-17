import { UserState } from "./../interfaces/UserState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Storage from "react-native-storage";
import { PostingSurveyState } from "../interfaces/PostingSurveyState";
import { log, logObject } from "./Log";
import { GeoInfo } from "../interfaces/GeoInfo";

// 이것들 Class 로 모두 묶어주기.

export const storage = new Storage({
    storageBackend: AsyncStorage,
});

class MyStorage extends Storage {}

export const getItem = async () => {
    let data = await AsyncStorage.getItem("");
    data = JSON.parse(data);
    // data.
};

export const saveUserState = async (data: UserState) => {
    // never expires
    logObject("savedUserState", data);
    await storage.save({ key: "userInfo", data, expires: null });
};

export const loadUserState = async (): Promise<UserState> => {
    try {
        const userState: UserState = await storage.load({
            key: "userInfo",
            autoSync: true,
            syncInBackground: true,
        });
        logObject("loadedUserState", userState);

        return userState;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Geo

export const saveWholeGeos = async (data: GeoInfo[]) => {
    // logObject("saving geo data", data);
    await storage.save({ key: "wholeGeoInfo", data, expires: null });
};

export const loadWholeGeo = async (): Promise<GeoInfo[]> => {
    console.log("loadWholeGeo called");
    try {
        const geoInfo: GeoInfo[] = await storage.load({
            key: "wholeGeoInfo",
            autoSync: true,
            syncInBackground: true,
        });

        return geoInfo;
    } catch (error) {
        console.error("Error loading geo info:", error);
        return null;
    }
};
