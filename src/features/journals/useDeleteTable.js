import { useMutation } from "@tanstack/react-query";
import { deleteTable as deleteTableApi } from "../../services/apiJournals";
import { toast } from "react-hot-toast";

export function useDeleteTable(token) {
  const {
    isPending: isDeletingTable,
    mutate: deleteTable,
    error: deleteTableError,
  } = useMutation({
    mutationFn: (tableId) => deleteTableApi(token?.token, tableId),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { deleteTable, isDeletingTable, deleteTableError };
}
