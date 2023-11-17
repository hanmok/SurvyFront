import { logObject } from "./Log";
// PostingSurvey
import Storage from "react-native-storage";
import { storage } from "./Storage";
import { PostingSurveyState } from "../interfaces/PostingSurveyState";

// export const initializePostingSurvey = async () => {
//     await storage.save({
//         key: "postingSurveys",
//         data: [],
//         expires: null,
//     });
// };

// export const deletePostingSurvey = async (postingSurveyId: number) => {
//     console.log(
//         `delePostingSurvey called, postingSurveyId: ${postingSurveyId}`
//     );
//     const prevData = await loadSavedPostingSurveys();

//     const updatedData = prevData.filter(
//         postingSurvey => postingSurvey.id !== postingSurveyId
//     );

//     if (updatedData.length < prevData.length) {
//         console.log("postingSurvey deleted!");
//         await storage.save({
//             key: "postingSurveys",
//             data: updatedData,
//             expires: null,
//         });
//     } else {
//         console.log("postingSurvey not found");
//     }
// };

// // 지금까지 .. 저장했던 것들과 함께 다같이 저장
// export const savePostingSurvey = async (data: PostingSurveyState) => {
//     logObject("savePostingSurvey called, data: ", data);

//     const prevData = await loadSavedPostingSurveys();

//     let duplicate = prevData.findIndex(prev => prev.id === data.id);

//     if (duplicate === -1) {
//         // 새로 저장
//         await storage.save({
//             key: "postingSurveys",
//             data: [...prevData, data],
//             // expires
//             expires: null,
//         });
//     } else {
//         //  수정 후 저장, updated: 중복 제거 후 data
//         const updated = prevData.splice(duplicate, 1);
//         await storage.save({
//             key: "postingSurveys",
//             data: [...updated, data],
//             expires: null,
//         });
//     }
// };

// export const loadSavedPostingSurveys = async (): Promise<
//     PostingSurveyState[]
// > => {
//     try {
//         const postingSurveys: PostingSurveyState[] = await storage.load({
//             key: "postingSurveys",
//             autoSync: true,
//             syncInBackground: true,
//         });

//         return postingSurveys;
//     } catch (error) {
//         console.error(error);
//         return [];
//     }
// };

export const initializePostingSurvey = async () => {
    await storage.save({
        key: "postingSurvey",
        data: null,
        expires: null,
    });
};

export const savePostingSurvey = async (data: PostingSurveyState) => {
    logObject("savePostingSurvey called, data: ", data);

    await storage.save({
        key: "postingSurvey",
        data: data,
        expires: null,
    });
};

export const loadPostingSurvey =
    async (): Promise<PostingSurveyState | null> => {
        try {
            const postingSurvey: PostingSurveyState = await storage.load({
                key: "postingSurvey",
                autoSync: true,
                syncInBackground: true,
            });

            return postingSurvey;
        } catch (error) {
            // console.error(error);
            return null;
        }
    };
