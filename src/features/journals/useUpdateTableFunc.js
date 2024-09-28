import { useMutation } from "@tanstack/react-query";
import { createTableItem as createTableItemApi } from "../../services/apiJournals";
import { toast } from "react-hot-toast";
import { createTableItemAPIRequestPayload } from "../../utils/helpers";

export function useUpdateTableFunc(token, removeToken) {
  const {
    isPending: isCreatingTableItem,
    mutate: createTableItem,
    error: createTableItemError,
  } = useMutation({
    mutationFn: ({ currentTableId, relativeItem = null, tableItems = null }) =>
      createTableItemApi(
        token?.token,
        createTableItemAPIRequestPayload(
          currentTableId,
          relativeItem,
          tableItems,
        ),
        removeToken,
      ),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { isCreatingTableItem, createTableItem, createTableItemError };
}
