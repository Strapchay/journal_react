import { useMutation } from "@tanstack/react-query";
import { createTableItem as createTableItemApi } from "../../services/apiJournals";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { toast } from "react-hot-toast";
import { createTableItemAPIRequestPayload } from "../../utils/helpers";

export function useCreateTableItem(token) {
  const {
    isPending: isCreatingTableItem,
    mutate: createTableItem,
    error: createTableItemError,
  } = useMutation({
    mutationFn: ({ currentTableId, relativeItem = false }) =>
      createTableItemApi(
        token?.token,
        createTableItemAPIRequestPayload(currentTableId, relativeItem),
      ),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { isCreatingTableItem, createTableItem, createTableItemError };
}
