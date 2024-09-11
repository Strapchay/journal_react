import { useState, useEffect, useCallback } from "react";

export function useLocalStorageState(initialState, authToken) {
  const [token, setToken] = useState(function () {
    const storedToken = localStorage.getItem(authToken);
    return storedToken ? JSON.parse(storedToken) : initialState;
  });

  useEffect(
    function () {
      console.log("the token value to be string", token);
      localStorage.setItem(authToken, JSON.stringify(token));
    },
    [token, authToken],
  );

  const removeToken = useCallback(() => {
    localStorage.removeItem("token");
  }, []);
  return { token, setToken, removeToken };
}
