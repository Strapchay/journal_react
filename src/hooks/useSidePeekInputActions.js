import { useContext, useRef, useEffect } from "react";
import { AuthContext } from "../ProtectedRoute";
import {
  formatAPIRequestUpdateTableItemPayload,
  formatAPITableItems,
  formatInputTypeCamelCase,
  getItemsOrdering,
  setCreatePayloadValue,
  setInputUpdateTextContent,
} from "../utils/helpers";
import { useUpdateTableItem } from "../features/journals/useUpdateTableItem";
import toast from "react-hot-toast";
import { THROTTLE_TIMER } from "../utils/constants";

export function useSidePeekInputActions({
  inputType,
  type,
  tableItem,
  checkbox,
  typeIndex,
  selectionRef,
}) {
  const { dispatch, deleteTableItems } = useContext(AuthContext);
  const throttleTimerRef = useRef(null);
  const inputRef = useRef(null);
  const checkboxRef = useRef(null);
  const inputModelKey = formatInputTypeCamelCase(inputType);
  const { updateTableItem } = useUpdateTableItem();

  useEffect(() => {
    if (!inputRef.current.textContent)
      inputRef.current.textContent = type?.text?.trim() ?? "";
  }, [type]);

  function handleCheckboxChange(e) {
    const payload = {
      itemId: tableItem.id,
      modelProperty: {
        property: {
          updateActionItem: {
            checked: checkboxRef.current.checked,
            propertyId: type.id,
            value: inputRef.current.textContent,
            key: inputModelKey,
          },
        },
      },
    };

    updateTableItem(
      { payload, type: inputModelKey },
      {
        onSuccess: (data) => {
          const res = formatAPITableItems([data]);
          dispatch({ type: "updateTableItem", payload: res });
        },
      },
    );
  }

  function handleItemDelete() {
    clearThrottle();
    const payload = {
      itemId: tableItem.id,
      modelProperty: {
        property: {
          delete: {
            propertyId: type.id,
            key: inputModelKey,
          },
        },
      },
    };

    deleteTableItems(
      {
        payload: formatAPIRequestUpdateTableItemPayload(payload, inputModelKey),
        type: inputType,
        typeId: type.id,
      },
      {
        onSuccess: (_) => {
          selectionRef.current = {
            active: true,
            index: typeIndex,
            inputType: inputModelKey,
            next: false,
          };
          dispatch({
            type: "deleteTableItemType",
            payload: {
              id: tableItem.id,
              type: { type: inputModelKey, id: type.id },
            },
          });
        },
      },
    );
  }

  function handleInputContentEvent(e) {
    if (e.key === "Enter") return handleInputContentUpdateAndCreate(e);
    if (e.key === "Backspace" && !inputRef.current?.textContent?.length) {
      if (tableItem[inputModelKey].length > 1) return handleItemDelete();
      else {
        toast.error("You can't delete the only item relating to an activity");
        clearThrottle();
        return;
      }
    } else return handleInputContentUpdate(e);
  }

  function handleInputContentUpdateAndCreate(e) {
    const checkedPayload = {
      checkbox,
      checked: checkboxRef.current?.checked ?? false,
    };

    if (throttleTimerRef.current) {
      clearInterval(throttleTimerRef.current);
      throttleTimerRef.current = null;
    }

    const selectionAnchorOffset = document.getSelection().anchorOffset;
    const inputSelection = document.getSelection().getRangeAt(0)
      ?.startContainer?.data;
    const currentInputTextContent = inputRef.current.textContent;
    const inputSelectionExists = inputSelection?.length > 0;
    const nextItemExists = tableItem[inputModelKey][typeIndex + 1] ?? null;
    const createRelativeProperty =
      inputSelectionExists || nextItemExists ? type.id : null;

    setInputUpdateTextContent(
      inputSelectionExists,
      selectionAnchorOffset,
      inputRef,
    );

    const { createItemOrdering, itemsOrdering } = getItemsOrdering(
      tableItem,
      inputModelKey,
      createRelativeProperty,
    );
    const payload = {
      itemId: tableItem.id,
      modelProperty: {
        property: {
          create: {
            value: setCreatePayloadValue(
              inputSelectionExists,
              selectionAnchorOffset,
              currentInputTextContent,
            ),
            relativeProperty: createRelativeProperty,
            ordering: createItemOrdering,
          },
          update: {
            value: inputRef.current.textContent,
            key: inputModelKey,
            propertyId: type.id,
          },
          orderingList: itemsOrdering,
          key: inputModelKey,
          updateAndAddProperty: true,
        },
      },
    };

    if (checkbox)
      payload.modelProperty = { ...payload.modelProperty, checkedPayload };

    updateTableItem(
      { payload, type: inputModelKey },
      {
        onSuccess: (data) => {
          const res = formatAPITableItems([data]);
          selectionRef.current = {
            active: true,
            index: typeIndex,
            inputType: inputModelKey,
            next: true,
          };
          dispatch({ type: "updateTableItem", payload: res });
        },
      },
    );
  }

  function clearThrottle() {
    if (throttleTimerRef.current) {
      clearInterval(throttleTimerRef.current);
      throttleTimerRef.current = null;
    }
  }

  function handleInputContentUpdate(e) {
    clearThrottle();
    const checkedPayload = {
      checkbox,
      checked: checkboxRef.current?.checked ?? false,
    };

    const payload = {
      itemId: tableItem.id,
      modelProperty: {
        property: {
          update: {
            value: inputRef.current.textContent,
            key: inputModelKey,
            propertyId: type.id,
          },
        },
        updateProperty: true,
      },
    };

    if (checkbox)
      payload.modelProperty = { ...payload.modelProperty, checkedPayload };

    throttleTimerRef.current = setTimeout(() => {
      updateTableItem(
        { payload, type: inputModelKey },
        {
          onSuccess: (data) => {
            const res = formatAPITableItems([data]);
            dispatch({ type: "updateTableItem", payload: res });
          },
        },
      );
    }, THROTTLE_TIMER);
  }

  return {
    checkboxRef,
    handleCheckboxChange,
    inputRef,
    handleInputContentEvent,
  };
}
