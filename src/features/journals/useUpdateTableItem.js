import { useMutation } from "@tanstack/react-query";
import { updateTableItem as updateTableItemApi } from "../../services/apiJournals";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { toast } from "react-hot-toast";
import {
  formatAPIRequestUpdateTableItemPayload,
  formatAPISub,
} from "../../utils/helpers";

export function useUpdateTableItem(
  onSubmit = null,
  isMultipleTags = null,
  itemIds,
) {
  const {
    token,
    journalState,
    dispatch,
    removeTokenAndLogout,
    unselectAllSelectedTableItems,
  } = useContext(AuthContext);
  const {
    isPending: isLoading,
    mutate: updateTableItem,
    error,
  } = useMutation({
    mutationFn: ({ payload, type }) =>
      updateTableItemApi(
        token.token,
        formatAPIRequestUpdateTableItemPayload(payload, type),
        payload.itemId,
        removeTokenAndLogout,
        type,
      ),
    onSuccess: (data) => {
      //NOTE: should only run for tag related updates due to implementation issues with its component when it unmounts
      if (isMultipleTags !== null) {
        if (!isMultipleTags) {
          const res = formatAPISub(data.tags, "apiTags");
          dispatch({
            type: "updateTableItemTags",
            payload: { id: itemIds[0], tags: res },
          });
        }
        if (isMultipleTags) {
          const res = formatAPISub(data[0].tags, "apiTags");
          dispatch({
            type: "updateMultipleTableItemTags",
            payload: { ids: itemIds, tags: res },
          });
        }
        unselectAllSelectedTableItems();
      }
    },
    onError: (err) => {
      toast.error(err.message);
      onSubmit?.();
    },
  });
  return { updateTableItem, isLoading, error };
}
