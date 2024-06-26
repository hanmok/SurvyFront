import { ReactNode, createContext, useContext, useState } from "react";
import { UserState } from "../../interfaces/UserState";
import { AccessToken, UserId } from "../../types/types";
import { GeoInfo } from "../../interfaces/GeoInfo";
import showAdminToast from "../../utils/toast/showAdminToast";
import { UserDetail } from "../../interfaces/UserDetail";
import { logObject } from "../../utils/Log";
/** collectedReward, age, birthDate, isMale, reputation, fatigue, homeAddress, officeAddresss, occupation */

interface CustomContextProps {
	username: string;
	updateUsername: (username: string) => void;
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
	resetContext: () => void;
}

const CustomContext = createContext<CustomContextProps | undefined>(undefined);

interface CustomProviderProps {
	children: ReactNode;
}

export const CustomProvider: React.FC<CustomProviderProps> = ({ children }) => {
	const [username, setUsername] = useState<string>(null);
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

	const updateUsername = (username: string) => {
		setUsername(username);
	};

	const updateParticipatingSurveyId = (newId: number) => {
		setParticipatingSurveyId(newId);
	};

	const updatePostingSurveyId = (newId: number) => {
		setPostingSurveyId(newId);
	};

	const updateLoadingStatus = (loadingStatus: boolean) => {
		setIsLoading(loadingStatus);
	};

	const updateUserDetail = (userDetail: UserDetail) => {
		logObject("updateUserDetail called", userDetail);
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

	const resetContext = () => {
		setUsername(null);
		setPostingSurveyId(null);
		setIsLoading(false);
		setUserDetail(null);
		setAccessToken(null);
		setUserId(null);
		setHomeAddress(null);
		setOfficeAddress(null);
		setParticipatingSurveyId(null);
	};

	return (
		<CustomContext.Provider
			value={{
				username,
				updateUsername,
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
				resetContext,
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
