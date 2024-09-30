import { useState } from "react";
import { useRef } from "react";
import { SELECTED_COMPONENT_STATE_DEFAULTS } from "../utils/constants";
import { useContext } from "react";
import { AuthContext } from "../ProtectedRoute";
import { formatAPITableItems } from "../utils/helpers";

export function useTableFunctionActions() {
  const { createTableItem, dispatch, journalState, setSidePeek } =
    useContext(AuthContext);
  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const actionRefDictRef = useRef({
    filter: filterRef,
    sort: sortRef,
  });
  const breakScreenOptionRef = useRef(null);
  const [selectedComponentState, setSelectedComponentState] = useState(
    SELECTED_COMPONENT_STATE_DEFAULTS,
  );
  const [allowSearch, setAllowSearch] = useState(false);

  function handleCreateAndOpenSidePeek() {
    createTableItem(
      { currentTableId: journalState.currentTable },
      {
        onSuccess: (data) => {
          const formatResp = formatAPITableItems([data]);
          dispatch({ type: "createTableItem", payload: formatResp });
          setSidePeek((_) => ({ isActive: true, itemId: formatResp[0].id }));
        },
      },
    );
  }

  return {
    handleCreateAndOpenSidePeek,
    actionRefDictRef,
    breakScreenOptionRef,
    setSelectedComponentState,
    selectedComponentState,
    setAllowSearch,
    allowSearch,
  };
}
