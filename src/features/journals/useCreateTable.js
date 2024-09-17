import { useMutation } from "@tanstack/react-query";
import { createTable as createTableApi } from "../../services/apiJournals";
import { toast } from "react-hot-toast";

export function useCreateTable(token) {
  const {
    isPending: isCreatingTable,
    mutate: createTable,
    error: createTableError,
  } = useMutation({
    mutationFn: (journalId) =>
      createTableApi(token?.token, { journal: journalId }),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { createTable, createTableError, isCreatingTable };
}
