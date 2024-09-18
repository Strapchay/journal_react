import { useState, useEffect, useCallback } from "react";
import {
  DEFAULT_JOURNAL_DESC,
  TABLE_TAGS,
  TAGS_COLORS,
} from "../utils/constants";

export function useLocalStorageState(
  initialState,
  authToken = "",
  persistedJournal = "",
) {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem(authToken);
    return storedToken ? JSON.parse(storedToken) : initialState;
  });

  const [journal, setJournal] = useState(() => {
    const storedJournal = localStorage.getItem(persistedJournal);
    return storedJournal
      ? JSON.parse(storedJournal)
      : {
          name: "",
          description: DEFAULT_JOURNAL_DESC,
          tables: [],
          tableHeads: [],
          tags: TABLE_TAGS.tags,
          tagsColor: TAGS_COLORS.colors,
        };
  });

  useEffect(
    function () {
      localStorage.setItem(authToken, JSON.stringify(token));
    },
    [token, authToken],
  );

  useEffect(
    function () {
      localStorage.setItem(persistedJournal, JSON.stringify(journal));
    },
    [persistedJournal, journal],
  );

  const removeStorageData = useCallback((tokenName) => {
    localStorage.removeItem(tokenName);
    localStorage.removeItem("journal");
  }, []);
  return { token, setToken, removeStorageData, journal, setJournal };
}
