import { useMutation } from "@tanstack/react-query";
import { deleteTableItems as deleteTableItemsApi } from "../../services/apiJournals";
import { toast } from "react-hot-toast";

export function useDeleteTableItems(token, removeToken) {
  const {
    isPending: isDeletingTableItems,
    mutate: deleteTableItems,
    error: deleteTableItemsError,
  } = useMutation({
    mutationFn: ({ payload, type = null, typeId = null }) =>
      deleteTableItemsApi(token?.token, payload, removeToken, type, typeId),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { deleteTableItems, isDeletingTableItems, deleteTableItemsError };
}
