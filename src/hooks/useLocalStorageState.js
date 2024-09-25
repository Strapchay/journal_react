import { useState, useEffect, useCallback } from "react";
import {
  DEFAULT_JOURNAL_DESC,
  TABLE_TAGS,
  TAGS_COLORS,
} from "../utils/constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useLocalStorageState(
  initialState,
  authToken = "",
  persistedJournal = "",
) {
  const navigate = useNavigate();
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

  function removeStorageData() {
    localStorage.removeItem(authToken);
    localStorage.removeItem(persistedJournal);
    navigate("/");
    toast.error("Invalid authorization, please re-authenticate!");
  }
  return { token, setToken, removeStorageData, journal, setJournal };
}
