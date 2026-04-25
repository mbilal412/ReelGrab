import { createContext } from "react";
import { useState } from "react";

export const ReelContext = createContext();

const ReelProvider = ({ children }) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  return (
    <ReelContext.Provider
      value={{
        downloading,
        setDownloading,
        progress,
        setProgress,
        error,
        setError,
      }}
    >
      {children}
    </ReelContext.Provider>
  );
};

export default ReelProvider;
