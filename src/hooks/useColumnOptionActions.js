import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../ProtectedRoute";
import toast from "react-hot-toast";
import { formatAPIResp } from "../utils/helpers";

export function useColumnOptionActions({ table, onSubmit, hasParent }) {
  const [renameActive, setRenameActive] = useState(false);
  const { renameTable, dispatch, journalState, duplicateTable, deleteTable } =
    useContext(AuthContext);

  const [tableNameInput, setTableNameInput] = useState(table[0]);

  const toastInst = toast;

  function handleTableNameChange(e) {
    if (e.key === "Enter") {
      const data = {
        table_name: tableNameInput,
        journal: table[1],
      };

      renameTable(data, {
        onSuccess: () => {
          if (hasParent) onSubmit?.();
          dispatch({ type: "updateTableName", payload: tableNameInput });
          setRenameActive((v) => false);
        },
        onError: () => {
          if (hasParent) onSubmit?.();
        },
      });
    } else setTableNameInput((i) => e.target.value);
  }

  function handleTableDuplicate() {
    toastInst.loading("Duplicating table...");
    const payload = {
      journal_table: table[1],
      journal: journalState?.id,
      duplicate: true,
    };
    duplicateTable(payload, {
      onSuccess: (data) => {
        onSubmit?.();
        toastInst.remove();
        const res = formatAPIResp(data, "journalTables");
        dispatch({ type: "createTable", payload: res });
      },
      onError: (_) => {
        onSubmit?.();
        toastInst.remove();
      },
    });
  }

  function handleTableDelete() {
    deleteTable(table[1], {
      onSuccess: () => {
        onSubmit?.();
        dispatch({ type: "deleteTable", payload: table[1] });
      },
    });
  }

  return {
    handleTableDelete,
    handleTableDuplicate,
    handleTableNameChange,
    renameActive,
    setRenameActive,
    tableNameInput,
  };
}
