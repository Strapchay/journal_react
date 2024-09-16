import { useQuery } from "@tanstack/react-query";
import { getJournalTables } from "../../services/apiJournals";
import { formatAPIResp } from "../../utils/helpers";

export function useGetJournalTables(token) {
  // const { token } = useContext(AuthContext);
  const {
    isPending: isLoading,
    data: journalTables,
    error,
    isFetchedAfterMount: journalTablesFetchedAfterMount,
  } = useQuery({
    queryKey: ["journalTables"],
    queryFn: async () => {
      const tableItems = [];
      const journalTables = await getJournalTables(token?.token);
      journalTables.forEach((tableItem) =>
        tableItems.push(formatAPIResp(tableItem, "journalTables")),
      );
      return tableItems;
    },
    staleTime: Infinity,
    refetchOnMount: false,
  });
  return { journalTables, isLoading, error, journalTablesFetchedAfterMount };
}
