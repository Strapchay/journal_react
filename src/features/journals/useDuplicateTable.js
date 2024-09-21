import { useMutation } from "@tanstack/react-query";
import { duplicateTable as duplicateTableApi } from "../../services/apiJournals";
import { toast } from "react-hot-toast";

export function useDuplicateTable(token, removeToken) {
  const {
    isPending: isDuplicatingTable,
    mutate: duplicateTable,
    error: duplicateTableError,
  } = useMutation({
    mutationFn: (payload) =>
      duplicateTableApi(token?.token, payload, removeToken),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return {
    duplicateTable,
    isDuplicatingTable,
    duplicateTableError,
  };
}
