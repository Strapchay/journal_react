import { useEffect } from "react";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { useNavigate } from "react-router-dom";
import { createContext } from "react";
import Journal from "./pages/Journal";

export const AuthContext = createContext();

function ProtectedRoute() {
  const { token, removeStorageData, journal } = useLocalStorageState(
    {},
    "token",
    "journal",
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(token).length === 0) navigate("/");
  }, [token, navigate]);

  function removeTokenAndLogout() {
    removeStorageData("token");
    navigate("/");
  }

  return (
    <AuthContext.Provider
      value={{
        removeTokenAndLogout,
        token,
        journal,
      }}
    >
      <Journal />
    </AuthContext.Provider>
  );
}

export default ProtectedRoute;
