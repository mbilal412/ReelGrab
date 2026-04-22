import { createContext } from "react";
import { useState } from "react";

export const ReelContext = createContext();

const ReelProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return (
        <ReelContext.Provider value={{ loading, setLoading, error, setError }}>
            {children}
        </ReelContext.Provider>
    )
}

export default ReelProvider;