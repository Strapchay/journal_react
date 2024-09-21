import { useMutation } from "@tanstack/react-query";
import { duplicateTableItems as duplicateTableItemsApi } from "../../services/apiJournals";
import { toast } from "react-hot-toast";

export function useDuplicateTableItems(token, removeToken) {
  const {
    isPending: isDuplicatingTableItems,
    mutate: duplicateTableItems,
    error: duplicateTableItemsError,
  } = useMutation({
    mutationFn: (payload) =>
      duplicateTableItemsApi(token?.token, payload, removeToken),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return {
    duplicateTableItems,
    isDuplicatingTableItems,
    duplicateTableItemsError,
  };
}
