import { ReactNode, createContext, useContext, useState } from "react";
import { UserState } from "../../interfaces/UserState";
import { AccessToken, UserId } from "../../types/types";
import { GeoInfo } from "../../interfaces/GeoInfo";
import showAdminToast from "../../components/common/toast/showAdminToast";

export interface UserDetail {
    collectedReward: number;
    birthDate: string | null;
    age: number | null;
    isMale: number | null;
    reputation: number;
    fatigue: number;
    homeAddress: GeoInfo | null;
    officeAddress: GeoInfo | null;
    occupation: Occupation | null;
}

export interface Occupation {
    id: number;
    name: string;
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
    homeAddress: GeoInfo;
    updateHomeAddress: (newHomeAddress: GeoInfo) => void;
    officeAddress: GeoInfo;
    updateOfficeAddress: (newOfficeAddress: GeoInfo) => void;
    participatingSurveyId: number;
    updateParticipatingSurveyId: (newSurveyId: number) => void;
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
    const [homeAddress, setHomeAddress] = useState<GeoInfo | null>(null);
    const [officeAddress, setOfficeAddress] = useState<GeoInfo | null>(null);
    const [participatingSurveyId, setParticipatingSurveyId] = useState<
        number | null
    >(null);

    const updateParticipatingSurveyId = (newId: number) => [
        setParticipatingSurveyId(newId),
    ];

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

    const updateHomeAddress = (homeAddress: GeoInfo) => {
        setHomeAddress(homeAddress);
    };

    const updateOfficeAddress = (officeAddress: GeoInfo) => {
        setOfficeAddress(officeAddress);
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
                homeAddress,
                updateHomeAddress,
                officeAddress,
                updateOfficeAddress,
                participatingSurveyId,
                updateParticipatingSurveyId,
            }}
        >
            {children}
        </CustomContext.Provider>
    );
};

export const useCustomContext = (): CustomContextProps => {
    const context = useContext(CustomContext);
    if (!context) {
        console.error("useCustomContext must be used within a MyProvider");
        showAdminToast(
            "error",
            "useCustomContext must be used within a MyProvider"
        );
    }
    return context;
};
