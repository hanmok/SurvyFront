import { ReactNode, createContext, useContext, useState } from "react";
import { UserState } from "../../interfaces/UserState";
import { AccessToken, UserId } from "../../types/types";

interface UserDetail {
    collectedReward: number;
    birthDate: string | null;
    age: number | null;
    isMale: number | null;
    reputation: number;
    fatigue: number;
}

interface CustomContextProps {
    postingSurveyId: number;
    updatePostingSurveyId: (postingSurveyId: number) => void;
    isLoadingStatus: boolean;
    updateLoadingStatus: (isLoading: boolean) => void;
    userDetail: UserDetail;
    updateUserDetail: (newDetail: UserDetail) => void;
    accessToken: AccessToken;
    updateAccessToken: (newToken: AccessToken) => void;
    userId: UserId;
    updateUserId: (newUserId: UserId) => void;
}

const CustomContext = createContext<CustomContextProps | undefined>(undefined);

interface CustomProviderProps {
    children: ReactNode;
}

export const CustomProvider: React.FC<CustomProviderProps> = ({ children }) => {
    const [postingSurveyId, setPostingSurveyId] = useState<number>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userDetail, setUserDetail] = useState<UserDetail>(null);
    const [accessToken, setAccessToken] = useState<AccessToken>(null);
    const [userId, setUserId] = useState<UserId>(null);

    const updatePostingSurveyId = (newId: number) => {
        setPostingSurveyId(newId);
    };

    const updateLoadingStatus = (loadingStatus: boolean) => {
        setIsLoading(loadingStatus);
    };

    const updateUserDetail = (userDetail: UserDetail) => {
        setUserDetail(userDetail);
    };

    const updateAccessToken = (accessToken: AccessToken) => {
        setAccessToken(accessToken);
    };

    const updateUserId = (userId: UserId) => {
        setUserId(userId);
    };

    return (
        <CustomContext.Provider
            value={{
                postingSurveyId,
                updatePostingSurveyId,
                isLoadingStatus: isLoading,
                updateLoadingStatus,
                userDetail,
                updateUserDetail,
                accessToken,
                updateAccessToken,
                userId,
                updateUserId,
            }}
        >
            {children}
        </CustomContext.Provider>
    );
};

export const useCustomContext = (): CustomContextProps => {
    const context = useContext(CustomContext);
    if (!context) {
        throw new Error("useCustomContext must be used within a MyProvider");
    }
    return context;
};
