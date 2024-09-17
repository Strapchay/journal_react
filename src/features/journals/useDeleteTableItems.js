import { useMutation } from "@tanstack/react-query";
import { deleteTableItems as deleteTableItemsApi } from "../../services/apiJournals";
import { toast } from "react-hot-toast";

export function useDeleteTableItems(token) {
  const {
    isPending: isDeletingTableItems,
    mutate: deleteTableItems,
    error: deleteTableItemsError,
  } = useMutation({
    mutationFn: (payload) => deleteTableItemsApi(token?.token, payload),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { deleteTableItems, isDeletingTableItems, deleteTableItemsError };
}
