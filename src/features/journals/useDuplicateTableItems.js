import { useMutation } from "@tanstack/react-query";
import { duplicateTableItems as duplicateTableItemsApi } from "../../services/apiJournals";
import { toast } from "react-hot-toast";

export function useDuplicateTableItems(token) {
  const {
    isPending: isDuplicatingTableItems,
    mutate: duplicateTableItems,
    error: duplicateTableItemsError,
  } = useMutation({
    mutationFn: (payload) => duplicateTableItemsApi(token?.token, payload),
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
