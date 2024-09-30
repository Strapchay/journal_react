import { useState } from "react";
import { useRef } from "react";
import {
  SELECTED_COMPONENT_STATE_DEFAULTS,
  TABLE_PROPERTIES,
} from "../utils/constants";
import { useContext } from "react";
import { AuthContext } from "../ProtectedRoute";
import { formatAPITableItems } from "../utils/helpers";

export function useJournalTableHeadActionActions() {
  const { createTableItem, dispatch, journalState, setSidePeek } =
    useContext(AuthContext);
  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const breakScreenOptionRef = useRef(null);
  const [selectedComponentState, setSelectedComponentState] = useState(
    SELECTED_COMPONENT_STATE_DEFAULTS,
  );
  const propertiesToRender = TABLE_PROPERTIES.properties.filter(
    (property) => property.text.toLowerCase() !== "created",
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
    filterRef,
    sortRef,
    breakScreenOptionRef,
    propertiesToRender,
    setSelectedComponentState,
    selectedComponentState,
    setAllowSearch,
    allowSearch,
  };
}
