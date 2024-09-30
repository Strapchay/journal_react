import { useContext } from "react";
import { AuthContext } from "../ProtectedRoute";
import { useRef } from "react";
import { useCreateTable } from "../features/journals/useCreateTable";
import { formatAPIResp, swapItemIndexInPlace } from "../utils/helpers";

export function useJournalTableHeadActions() {
  const { journalState, token, dispatch, selectedTableItems } =
    useContext(AuthContext);
  const tableHeadRef = useRef(null);

  const { createTable } = useCreateTable(token);
  const tables = journalState.tables.map((table) => [
    table.tableTitle,
    table.id,
  ]);
  const currentTableId = journalState.currentTable;
  const switchTableAdd = tables?.length >= 5;
  const tableItems = swapItemIndexInPlace(tables, currentTableId);
  const selectedTableItemsLength = Object.values(selectedTableItems).filter(
    (v) => v,
  ).length;

  function handleAddTableEvent(e) {
    createTable(journalState.id, {
      onSuccess: (data) => {
        const formattedData = formatAPIResp(data, "journalTables");
        dispatch({ type: "createTable", payload: formattedData });
        if (journalState.tables.length + 1 > 4) {
          dispatch({ type: "updateCurrentTable", payload: formattedData.id });
        }
      },
    });
  }

  return {
    handleAddTableEvent,
    switchTableAdd,
    tableItems,
    tableHeadRef,
    tables,
    selectedTableItemsLength,
  };
}
