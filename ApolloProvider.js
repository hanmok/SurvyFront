import React, { createContext, useContext } from "react";
import ApolloClient from "./apolloClient";

const ApolloContext = createContext(null);

export function ApolloProvider({ children }) {
    return (
        <ApolloContext.Provider value={ApolloClient}>
            {children}
        </ApolloContext.Provider>
    );
}

export function useApollo() {
    const context = useContext(ApolloContext);
    if (!context) {
        throw new Error("useApollo must be used within an ApolloProvider");
    }
    return context;
}
