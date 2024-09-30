import { useContext } from "react";
import { THROTTLE_TIMER } from "../utils/constants";
import { AuthContext } from "../ProtectedRoute";
import { useScreenBreakpoints } from "./useScreenBreakpoints";
import { useState } from "react";
import { useRef } from "react";
import { useUpdateTableItem } from "../features/journals/useUpdateTableItem";
import { useEffect } from "react";
import { formatAPITableItems } from "../utils/helpers";

export function useSlideContentActions({ tableItem }) {
  const { handleCopyToClipboardEvent, dispatch } = useContext(AuthContext);

  const { mobileBreakpointMatches } = useScreenBreakpoints();
  const [title, setTitle] = useState(tableItem?.itemTitle);
  const throttleTimerRef = useRef(null);
  const textToCopyRef = useRef(null);
  const tagOptionRef = useRef(null);
  const { updateTableItem } = useUpdateTableItem();
  const tableItemTags = "Empty";
  const tagExists = tableItem?.itemTags?.length > 0;

  useEffect(() => {
    setTitle((_) => tableItem?.itemTitle);
  }, [tableItem]);

  function handleTitleUpdate(e) {
    setTitle((_) => e.target.value);
    if (throttleTimerRef.current) {
      clearInterval(throttleTimerRef.current);
      throttleTimerRef.current = null;
    }

    throttleTimerRef.current = setTimeout(() => {
      updateTableItem(
        {
          payload: {
            itemId: tableItem.id,
            title,
          },
          type: "title",
        },
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
    title,
    handleTitleUpdate,
    tableItemTags,
    tagOptionRef,
    tagExists,
    mobileBreakpointMatches,
    textToCopyRef,
    handleCopyToClipboardEvent,
  };
}
