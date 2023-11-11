import { ReactNode, createContext, useContext, useState } from "react";

interface CustomContextProps {
    postingSurveyId: number;
    updatePostingSurveyId: (postingSurveyId: number) => void;
    isLoadingStatus: boolean;
    updateLoadingStatus: (isLoading: boolean) => void;
}

const CustomContext = createContext<CustomContextProps | undefined>(undefined);

interface CustomProviderProps {
    children: ReactNode;
}

export const CustomProvider: React.FC<CustomProviderProps> = ({ children }) => {
    const [postingSurveyId, setPostingSurveyId] = useState<number>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const updatePostingSurveyId = (newId: number) => {
        setPostingSurveyId(newId);
    };

    const updateLoadingStatus = (loadingStatus: boolean) => {
        setIsLoading(loadingStatus);
    };
    return (
        <CustomContext.Provider
            value={{
                postingSurveyId,
                updatePostingSurveyId,
                isLoadingStatus: isLoading,
                updateLoadingStatus,
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
