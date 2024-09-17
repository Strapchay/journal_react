import { useQuery } from "@tanstack/react-query";
import { getJournalList } from "../../services/apiJournals";
import { formatAPIResp } from "../../utils/helpers";
import { getUserInfo as getUserInfoApi } from "../../services/apiUsers";

export function useGetUser(token) {
  const {
    isPending: isLoading,
    data: user,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserInfoApi(token?.token),
    staleTime: Infinity,
    refetchOnMount: false,
  });
  return { user, isLoading, error };
}
