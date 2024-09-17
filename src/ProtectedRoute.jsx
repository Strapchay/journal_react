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
import { useRef } from "react";
import { useDeleteTableItems } from "./features/journals/useDeleteTableItems";
import toast from "react-hot-toast";
import { useDuplicateTableItems } from "./features/journals/useDuplicateTableItems";
import { formatAPITableItems } from "./utils/helpers";

export const AuthContext = createContext();

function ProtectedRoute() {
  const navigate = useNavigate();
  const overlayContainerRef = useRef(null);
  const [selectedTableItems, setSelectedTableItems] = useState({});
  const { token, removeStorageData } = useLocalStorageState(
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
  const { deleteTableItems } = useDeleteTableItems(token);
  const { duplicateTableItems, isDuplicatingTableItems } =
    useDuplicateTableItems(token);
  console.log("j and fetched after mount", journalTables, journals);
  const [journalState, dispatch] = useReducer(journalReducer, initialState);
  const { isCreatingTableItem, createTableItem, createTableItemError } =
    useCreateTableItem(token);

  const currentTableIndex = journalState.tables.findIndex(
    (table) => table.id === journalState.currentTable,
  );
  const currentTable = journalState?.tables?.[currentTableIndex];
  const currentTableItems = currentTable?.tableItems;

  useEffect(() => {
    if (Object.keys(token)?.length === 0 || !token)
      navigate("/", { replace: true });
  }, [token, navigate]);

  useEffect(() => {
    if (Object.keys(token)?.length > 0)
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

  useEffect(() => {
    //FIXME: should auto run when an item is updated which should re-calc currentTableItems and cause useEffect to run
    const tableItemKeys = Object.keys(selectedTableItems);
    const updateAction =
      tableItemKeys.length < currentTableItems?.length
        ? "addItems"
        : tableItemKeys.length > currentTableItems?.length
          ? "removeItems"
          : null;
    console.log("trigged this", updateAction);

    if (updateAction === "addItems") {
      const newTableItems = currentTableItems
        .map((it) => (tableItemKeys.some((t) => t === it.id) ? null : it.id))
        .filter((it) => it);
      const updateObj = {};
      newTableItems.forEach((it) => (updateObj[it] = false));
      setSelectedTableItems((it) => ({ ...it, ...updateObj }));
    }
    if (updateAction === "removeItems") {
      const updateObj = {};
      currentTableItems.forEach((item) => (updateObj[item.id] = false));
      setSelectedTableItems(updateObj);
    }
  }, [currentTableItems, selectedTableItems]);

  function removeTokenAndLogout() {
    removeStorageData("token");
    navigate("/");
  }

  function unselectAllSelectedTableItems() {
    const updateObj = { ...selectedTableItems };
    const keys = Object.keys(selectedTableItems);
    keys.forEach((key) => (updateObj[key] = false));
    setSelectedTableItems((it) => ({ ...updateObj }));
  }

  function selectAllSelectedTableItems(state) {
    const updateObj = { ...selectedTableItems };
    const keys = Object.keys(selectedTableItems);
    keys.forEach((key) => (updateObj[key] = state));
    setSelectedTableItems((it) => ({ ...updateObj }));
  }

  function deleteSelectedTableItems() {
    const keys = Object.keys(selectedTableItems);
    const itemsToDelete = keys
      .map((key) => (!selectedTableItems[key] ? null : key))
      .filter((key) => +key);
    const payload = {
      delete_list: itemsToDelete,
    };
    deleteTableItems(payload, {
      onSuccess: (data) => {
        toast.success("Items deleted successfully");
        dispatch({ type: "deleteTableItems", payload: itemsToDelete });
      },
    });
  }

  function duplicateSelectedTableItems() {
    const keys = Object.keys(selectedTableItems);
    const itemsToDuplicate = keys
      .map((key) => (!selectedTableItems[key] ? null : key))
      .filter((key) => key)
      .map((key) => +key);
    const payload = {
      duplicate_list: [{ ids: itemsToDuplicate }],
    };
    duplicateTableItems(payload, {
      onSuccess: (data) => {
        toast.success("Items duplicated successfully");
        const res = formatAPITableItems(Array.isArray(data) ? data : [data]);
        dispatch({ type: "duplicateTableItems", payload: res });
      },
    });
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
        overlayContainerRef,
        selectedTableItems,
        setSelectedTableItems,
        currentTableItems,
        unselectAllSelectedTableItems,
        deleteSelectedTableItems,
        duplicateSelectedTableItems,
        isDuplicatingTableItems,
        selectAllSelectedTableItems,
      }}
    >
      <Journal />
    </AuthContext.Provider>
  );
}

export default ProtectedRoute;
