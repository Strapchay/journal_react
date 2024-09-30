import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AuthContext } from "../ProtectedRoute";

export function useSidePeekActions({ itemId }) {
  const { journalState, setSidePeek, sidePeek } = useContext(AuthContext);
  const currentTable = journalState.tables.find(
    (table) => table.id === journalState.currentTable,
  );
  const [currentItemId, setCurrentItemId] = useState(itemId);
  const tableItem = currentTable.tableItems.find(
    (item) => item.id === currentItemId,
  );
  const tableItemIndex = currentTable.tableItems.findIndex(
    (item) => item.id === currentItemId,
  );
  const shouldPrev = tableItemIndex > 0;
  const shouldNext = tableItemIndex < currentTable.tableItems.length - 1;

  useEffect(() => {
    if (sidePeek.itemId !== currentItemId)
      setCurrentItemId((v) => sidePeek.itemId);
  }, [sidePeek, currentItemId]);

  function handleNavigateItems(type = "") {
    if (type === "prev" && shouldPrev) {
      const prevTableItemId = currentTable.tableItems[tableItemIndex - 1].id;
      setCurrentItemId((_) => prevTableItemId);
      setSidePeek((v) => ({ ...v, itemId: prevTableItemId }));
    }
    if (type === "next" && shouldNext) {
      const nextTableItemId = currentTable.tableItems[tableItemIndex + 1].id;
      setCurrentItemId((_) => nextTableItemId);
      setSidePeek((v) => ({ ...v, itemId: nextTableItemId }));
    }
  }

  return {
    setSidePeek,
    sidePeek,
    handleNavigateItems,
    shouldNext,
    shouldPrev,
    tableItem,
  };
}
