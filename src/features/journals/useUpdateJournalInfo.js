import { useMutation, useQuery } from "@tanstack/react-query";
import { updateJournalInfo as updateJournalInfoApi } from "../../services/apiJournals";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { formatAPIResp } from "../../utils/helpers";
import { useGetJournals } from "./useGetJournals";

export function useUpdateJournalInfo() {
  const { token } = useContext(AuthContext);
  const { journals } = useGetJournals();
  const {
    isPending: isLoading,
    mutate: updateJournalInfo,
    error,
  } = useMutation({
    mutationFn: (payload) => updateJournalInfoApi(token, payload, journals?.id),
  });
  return { updateJournalInfo, isLoading, error };
}
