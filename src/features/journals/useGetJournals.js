import { useQuery } from "@tanstack/react-query";
import { getJournalList } from "../../services/apiJournals";
import { formatAPIResp } from "../../utils/helpers";

export function useGetJournals(token, removeToken) {
  // const { token } = useContext(AuthContext);
  const {
    isPending: isLoading,
    data: journals,
    error,
    isFetchedAfterMount: journalsFetchedAfterMount,
  } = useQuery({
    queryKey: ["journals"],
    queryFn: async () => {
      const journalList = await getJournalList(token?.token, removeToken);
      const formattedJournalList = formatAPIResp(...journalList, "journal");
      return formattedJournalList;
    },
    staleTime: Infinity,
    refetchOnMount: false,
  });
  return { journals, isLoading, error, journalsFetchedAfterMount };
}
