import { useMutation } from "@tanstack/react-query";
import { updateJournalInfo as updateJournalInfoApi } from "../../services/apiJournals";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { useGetJournals } from "./useGetJournals";
import { toast } from "react-hot-toast";

export function useUpdateJournalInfo() {
  const { token } = useContext(AuthContext);
  const { journals } = useGetJournals();
  const {
    isPending: isLoading,
    mutate: updateJournalInfo,
    error,
  } = useMutation({
    mutationFn: (payload) =>
      updateJournalInfoApi(token.token, payload, journals?.id),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { updateJournalInfo, isLoading, error };
}
