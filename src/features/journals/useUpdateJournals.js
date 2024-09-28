import { useMutation } from "@tanstack/react-query";
import { updateJournal as updateJournalApi } from "../../services/apiJournals";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { useGetJournals } from "./useGetJournals";
import { toast } from "react-hot-toast";

export function useUpdateJournals(token, removeToken) {
  const {
    isPending: isLoading,
    mutate: updateJournal,
    error,
  } = useMutation({
    mutationFn: ({ payload, journalId }) =>
      updateJournalApi(token.token, journalId, payload, removeToken),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { updateJournal, isLoading, error };
}
