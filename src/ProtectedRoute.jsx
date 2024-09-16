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
import { useCreateTableItem } from "./features/journals/useCreateTableItem";

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
  const {
    journalTables,
    isLoading: journalTablesLoading,
    error: journalTablesError,
    journalTablesFetchedAfterMount,
  } = useGetJournalTables(token);
  console.log("j and fetched after mount", journalTables, journals);
  const [journalState, dispatch] = useReducer(journalReducer, initialState);

  const { isCreatingTableItem, createTableItem, createTableItemError } =
    useCreateTableItem(token);
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
    if (!journalsLoading && !journalsError && !journalState.journalsLoaded)
      updater = { ...journalState, ...journals, journalsLoaded: true };
    if (
      !journalTablesLoading &&
      !journalTablesError &&
      !journalState.journalTablesLoaded
    ) {
      updater = {
        ...updater,
        tables: journalTables,
        journalTablesLoaded: true,
      };
      console.log("updater value jortab", updater);
    }

    if (journalState?.tableHeads?.length === 0 && updater) {
      console.log("update state from api");
      dispatch({ type: "updateState", payload: updater });
    }
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
        isCreatingTableItem,
        createTableItem,
        createTableItemError,
      }}
    >
      <Journal />
    </AuthContext.Provider>
  );
}

export default ProtectedRoute;
