import { useContext } from "react";
import { AuthContext } from "../ProtectedRoute";
import { OverlayContext } from "../ComponentOverlay";
import { useRef } from "react";
import {
  SELECTED_COMPONENT_STATE_DEFAULTS,
  TABLE_PROPERTIES,
} from "../utils/constants";
import { useEffect } from "react";

export function useSortActions({ setSelectedComponentState }) {
  const { currentTableFunc, dispatch, activateTableFuncPersist } =
    useContext(AuthContext);
  const { addExtraAction } = useContext(OverlayContext);
  const propertyRef = useRef(null);
  const sortTypeRef = useRef(null);

  useEffect(() => {
    addExtraAction(activateTableFuncPersist);
  }, [activateTableFuncPersist, addExtraAction]);

  function handleSortAction(e) {
    dispatch({
      type: "updateTableFunc",
      payload: {
        sort: { ...currentTableFunc.sort, type: e.target.textContent.trim() },
      },
    });
  }

  function handleDeleteSort() {
    dispatch({
      type: "updateTableFunc",
      payload: {
        sort: {},
      },
    });
    activateTableFuncPersist();

    if (setSelectedComponentState)
      setSelectedComponentState(SELECTED_COMPONENT_STATE_DEFAULTS);
  }
  return {
    handleDeleteSort,
    handleSortAction,
    propertyRef,
    sortTypeRef,
    currentTableFunc,
  };
}
