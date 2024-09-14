import { useEffect } from "react";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { useNavigate } from "react-router-dom";
import { createContext } from "react";
import Journal from "./pages/Journal";
import { useGetJournals } from "./features/journals/useGetJournals";
import { useGetJournalTables } from "./features/journals/useGetJournalTables";
import { useState } from "react";
import {
  DEFAULT_JOURNAL_DESC,
  TABLE_TAGS,
  TAGS_COLORS,
} from "./utils/constants";
import { useReducer } from "react";
import { initialState, journalReducer } from "./JournalState";

export const AuthContext = createContext();

function ProtectedRoute() {
  const { token, removeStorageData, journal } = useLocalStorageState(
    {},
    "token",
    "journal",
  );
  const {
    journals,
    isLoading: journalsLoading,
    error: journalsError,
    isFetchedAfterMount: journalsFetchedAfterMount,
  } = useGetJournals(token);
  console.log("j", journals);
  console.log("journal fetched aft mount", journalsFetchedAfterMount);
  const {
    journalTables,
    isLoading: journalTablesLoading,
    error: journalTablesError,
    journalTablesFetchedAfterMount,
  } = useGetJournalTables(token);
  const [journalState, dispatch] = useReducer(journalReducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(token).length === 0) navigate("/");
  }, [token, navigate]);

  useEffect(() => {
    document.body.classList.add("journal-template");

    return () => {
      document.body.classList.remove("journal-template");
    };
  }, []);

  useEffect(() => {
    let updater;
    if (!journalsLoading && !journalsError && !journalsFetchedAfterMount)
      updater = { ...journalState, ...journals };
    if (
      !journalTablesLoading &&
      !journalTablesError &&
      !journalTablesFetchedAfterMount
    )
      updater = { ...updater, tables: journalTables };

    if (journalState?.tableHeads?.length === 0 && updater)
      dispatch({ type: "updateState", payload: updater });
    // setJournalState((_) => updater);
  }, [
    journalState,
    journalTables,
    journals,
    journalsLoading,
    journalTablesLoading,
    journalsFetchedAfterMount,
    journalTablesFetchedAfterMount,
    journalTablesError,
    journalsError,
  ]);

  function removeTokenAndLogout() {
    removeStorageData("token");
    navigate("/");
  }

  return (
    <AuthContext.Provider
      value={{
        removeTokenAndLogout,
        token,
        // journal,
        journalState,
        dispatch,
      }}
    >
      <Journal />
    </AuthContext.Provider>
  );
}

export default ProtectedRoute;
