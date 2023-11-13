// import { ReactNode, createContext, useContext, useState } from "react";

// interface MyContextProps {
//     ctxData: number;
//     updateCtxData: (newData: number) => void;
// }

// const MyContext = createContext<MyContextProps | undefined>(undefined);

// interface MyproviderProps {
//     children: ReactNode;
// }

// export const MyProvider: React.FC<MyproviderProps> = ({ children }) => {
//     const [ctxData, setCtxData] = useState(null);

//     const updateCtxData = newData => {
//         setCtxData(newData);
//     };

//     return (
//         <MyContext.Provider value={{ ctxData, updateCtxData }}>
//             {children}
//         </MyContext.Provider>
//     );
// };

// // export { MyContext, MyProvider}
// export const useCustomContext = (): MyContextProps => {
//     const context = useContext(MyContext);
//     if (!context) {
//         throw new Error("useCustomContext must be used within a CustomProvider");
//     }
//     return context;
// };
