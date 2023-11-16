import { UserState } from "./../interfaces/UserState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Storage from "react-native-storage";
import { PostingSurveyState } from "../interfaces/PostingSurveyState";
import { log, logObject } from "./Log";
import { GeoInfo } from "../interfaces/GeoInfo";

// 이것들 Class 로 모두 묶어주기.

const storage = new Storage({
    storageBackend: AsyncStorage,
});

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

// PostingSurvey

export const initializePostingSurvey = async () => {
    await storage.save({
        key: "postingSurveys",
        data: [],
        expires: null,
    });
};

export const deletePostingSurvey = async (postingSurveyId: number) => {
    console.log(
        `delePostingSurvey called, postingSurveyId: ${postingSurveyId}`
    );
    const prevData = await loadSavedPostingSurveys();

    // const deletingIndex = prevData.findIndex(
    //     postingSurvey => postingSurvey.id === postingSurveyId
    // );

    // if (deletingIndex !== -1) {
    // const updatedData = prevData.splice(deletingIndex, 1);
    //     console.log("postingSurvey deleted");
    //     await storage.save({
    //         key: "postingSurveys",
    //         data: updatedData,
    //         expires: null,
    //     });
    // }

    const updatedData = prevData.filter(
        postingSurvey => postingSurvey.id !== postingSurveyId
    );

    if (updatedData.length < prevData.length) {
        console.log("postingSurvey deleted!");
        await storage.save({
            key: "postingSurveys",
            data: updatedData,
            expires: null,
        });
    } else {
        console.log("postingSurvey not found");
    }
};

// 지금까지 .. 저장했던 것들과 함께 다같이 저장
export const savePostingSurvey = async (data: PostingSurveyState) => {
    logObject("savePostingSurvey called, data: ", data);

    const prevData = await loadSavedPostingSurveys();

    let duplicate = prevData.findIndex(prev => prev.id === data.id);

    if (duplicate === -1) {
        // 새로 저장
        await storage.save({
            key: "postingSurveys",
            data: [...prevData, data],
            // expires
            expires: null,
        });
    } else {
        //  수정 후 저장, updated: 중복 제거 후 data
        const updated = prevData.splice(duplicate, 1);
        await storage.save({
            key: "postingSurveys",
            data: [...updated, data],
            expires: null,
        });
    }
};

export const loadSavedPostingSurveys = async (): Promise<
    PostingSurveyState[]
> => {
    try {
        const postingSurveys: PostingSurveyState[] = await storage.load({
            key: "postingSurveys",
            autoSync: true,
            syncInBackground: true,
        });

        return postingSurveys;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Geo

export const saveWholeGeos = async (data: GeoInfo[]) => {
    logObject("saving geo data", data);
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
