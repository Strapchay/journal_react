import { useEffect } from "react";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { useNavigate } from "react-router-dom";
import { createContext } from "react";
import Journal from "./pages/Journal";
import { useGetJournals } from "./features/journals/useGetJournals";
import { useGetJournalTables } from "./features/journals/useGetJournalTables";
import { useState } from "react";
import { useReducer } from "react";
import { initialState, journalReducer } from "./JournalState";
import { useCreateTableItem } from "./features/journals/useCreateTableItem";
import { useRef } from "react";
import { useDeleteTableItems } from "./features/journals/useDeleteTableItems";
import toast from "react-hot-toast";
import { useDuplicateTableItems } from "./features/journals/useDuplicateTableItems";
import {
  formatAPITableItems,
  getSelectedItems,
  queryConditional,
  querySort,
} from "./utils/helpers";
import { useGetUser } from "./features/users/useGetUser";
import ComponentOverlay from "./ComponentOverlay";
import { useUpdateTableRename } from "./features/journals/useUpdateTableRename";
import { useDuplicateTable } from "./features/journals/useDuplicateTable";
import { useDeleteTable } from "./features/journals/useDeleteTable";
import { COPY_ALERT, SIDE_PEEK_DEFAULTS } from "./utils/constants";
import { useTableDataSupllier } from "./hooks/useTableDataSupplier";
import { useUpdateJournals } from "./features/journals/useUpdateJournals";

export const AuthContext = createContext();

function ProtectedRoute() {
  const navigate = useNavigate();
  const overlayContainerRef = useRef(null);
  const tableFuncPositionerRef = useRef(null);
  const [selectedTableItems, setSelectedTableItems] = useState({});
  const [searchTableItemText, setSearchTableItemText] = useState("");
  const [overlayCountMap, setOverlayCountMap] = useState({});
  const [sidePeek, setSidePeek] = useState(SIDE_PEEK_DEFAULTS);
  const { token, removeStorageData } = useLocalStorageState(
    {},
    "token",
    "journal",
  );

  const { user } = useGetUser(token, removeStorageData);
  const {
    journals,
    isLoading: journalsLoading,
    error: journalsError,
    journalsFetchedAfterMount,
  } = useGetJournals(token, removeStorageData);
  const {
    journalTables,
    isLoading: journalTablesLoading,
    error: journalTablesError,
    journalTablesFetchedAfterMount,
  } = useGetJournalTables(token, removeStorageData);
  console.log("the journals tab v", journalTables);
  const { deleteTableItems } = useDeleteTableItems(token, removeStorageData);
  const { duplicateTableItems, isDuplicatingTableItems } =
    useDuplicateTableItems(token, removeStorageData);
  const { updateJournal } = useUpdateJournals(token, removeStorageData);
  const [journalState, dispatch] = useReducer(journalReducer, initialState);
  const { isCreatingTableItem, createTableItem, createTableItemError } =
    useCreateTableItem(token, removeStorageData);
  const { renameTable, isRenaming, renameError } = useUpdateTableRename(
    token,
    removeStorageData,
  );
  const { duplicateTable } = useDuplicateTable(token, removeStorageData);
  const { deleteTable } = useDeleteTable(token, removeStorageData);
  const currentTableIndex = journalState.tables.findIndex(
    (table) => table.id === journalState.currentTable,
  );
  const currentTable = journalState?.tables?.[currentTableIndex];
  const { currentTableItems, currentTableFunc } = useTableDataSupllier({
    searchTableItemText,
    currentTable,
    journalState,
  });

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
    if (
      !journalsLoading &&
      !journalsError &&
      !journalState.journalsLoaded &&
      !journalTablesLoading &&
      !journalTablesError &&
      !journalState.journalTablesLoaded
    )
      updater = {
        ...journalState,
        ...journals,
        tables: journalTables,
        journalsLoaded: true,
        journalTablesLoaded: true,
      };

    if (journalState?.tableHeads?.length === 0 && updater)
      dispatch({ type: "updateState", payload: updater });
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

  function handleCopyToClipboardEvent(textToCopyRef) {
    navigator.clipboard.writeText(textToCopyRef.current.textContent.trim());
    toast.success(COPY_ALERT);
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
    const itemsToDelete = getSelectedItems(selectedTableItems);
    const payload = {
      delete_list: itemsToDelete,
    };
    deleteTableItems(
      { payload },
      {
        onSuccess: (data) => {
          toast.success("Items deleted successfully");
          dispatch({ type: "deleteTableItems", payload: itemsToDelete });
        },
      },
    );
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

  function increaseOverlayCountMap(component) {
    setOverlayCountMap((m) => ({
      ...m,
      [component]: Object.keys(m).length + 1,
    }));
  }

  function decreaseOverlayCountMap(component) {
    const activeOverlays = { ...overlayCountMap };
    delete activeOverlays[component];
    setOverlayCountMap((_) => activeOverlays);
  }

  function handleUpdateTableFunc() {
    console.log("before update table func", journalState);
    const payload = {
      journal_table_func: journalState.tableFunc,
    };
    console.log(
      "payload before update table func",
      payload,
      journalState.currentTable,
    );
    updateJournal({ payload, journalId: journalState.id });
  }

  return (
    <AuthContext.Provider
      value={{
        removeTokenAndLogout: removeStorageData,
        token,
        user,
        journalState,
        dispatch,
        isCreatingTableItem,
        createTableItem,
        createTableItemError,
        overlayContainerRef,
        selectedTableItems,
        setSelectedTableItems,
        currentTableItems,
        currentTableFunc,
        unselectAllSelectedTableItems,
        deleteSelectedTableItems,
        duplicateSelectedTableItems,
        isDuplicatingTableItems,
        selectAllSelectedTableItems,
        decreaseOverlayCountMap,
        increaseOverlayCountMap,
        overlayCountMap,
        tableFuncPositionerRef,
        renameTable,
        duplicateTable,
        deleteTable,
        sidePeek,
        setSidePeek,
        handleCopyToClipboardEvent,
        deleteTableItems,
        searchTableItemText,
        setSearchTableItemText,
        handleUpdateTableFunc,
      }}
    >
      <Journal />
    </AuthContext.Provider>
  );
}

export default ProtectedRoute;
