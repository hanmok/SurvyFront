import AsyncStorage from "@react-native-async-storage/async-storage";
import Storage from "react-native-storage";
import { UserState } from "../interfaces/UserState";
import { PostingSurveyState } from "../interfaces/PostingSurveyState";
import { log, logObject } from "./Log";

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

// 지금까지 .. 저장했던 것들과 함께 다같이 저장
export const savePostingSurvey = async (data: PostingSurveyState) => {
    logObject("savePostingSurvey called, data: ", data);

    // await storage.save({ key: "postingSurveys", data: [data] });

    const prevData = await loadSavedPostingSurveys();

    let duplicate = prevData.findIndex(prev => prev.id === data.id);

    if (duplicate === -1) {
        // 새로 저장
        await storage.save({
            key: "postingSurveys",
            data: [...prevData, data],
        });
    } else {
        //  수정 후 저장, updated: 중복 제거 후 data
        const updated = prevData.splice(duplicate, 1);
        await storage.save({ key: "postingSurveys", data: [...updated, data] });
    }
};

export const loadSavedPostingSurveys = async (): Promise<
    PostingSurveyState[]
> => {
    const ret = await storage
        .load({
            key: "postingSurveys",
            autoSync: true,
            syncInBackground: true,
        })
        .catch(undefined);
    logObject("ret", ret);
    return ret;

    // if (ret) {
    //     return ret as PostingSurveyState[];
    // } else {
    //     return [] as PostingSurveyState[];
    // }

    // return ret;
    // return await storage
    //     .load({
    //         key: "postingSurveys",
    //         autoSync: true,
    //         syncInBackground: true,
    //     })
    //     .catch(undefined);
};
