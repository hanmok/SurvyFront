import { ReactNode, createContext, useContext, useState } from "react";

interface MyContextProps {
    ctxData: number;
    updateCtxData: (newData: number) => void;
}

const MyContext = createContext<MyContextProps | undefined>(undefined);

interface MyproviderProps {
    children: ReactNode;
}

export const MyProvider: React.FC<MyproviderProps> = ({ children }) => {
    const [ctxData, setCtxData] = useState(null);

    const updateCtxData = newData => {
        setCtxData(newData);
    };

    return (
        <MyContext.Provider value={{ ctxData, updateCtxData }}>
            {children}
        </MyContext.Provider>
    );
};

// export { MyContext, MyProvider}
export const useMyContext = (): MyContextProps => {
    const context = useContext(MyContext);
    if (!context) {
        throw new Error("useMyContext must be used within a MyProvider");
    }
    return context;
};
