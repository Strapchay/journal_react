import { useMutation } from "@tanstack/react-query";
import { updateTableItem as updateTableItemApi } from "../../services/apiJournals";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { useGetJournals } from "./useGetJournals";
import { toast } from "react-hot-toast";
import { formatAPIRequestUpdateTableItemPayload } from "../../utils/helpers";

export function useUpdateTableItem(onSubmit = null) {
  const { token, journalState } = useContext(AuthContext);
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
      ),
    onError: (err) => {
      toast.error(err.message);
      onSubmit?.();
    },
  });
  return { updateTableItem, isLoading, error };
}
