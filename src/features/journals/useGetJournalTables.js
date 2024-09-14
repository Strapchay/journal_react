import { useQuery } from "@tanstack/react-query";
import { getJournalTables } from "../../services/apiJournals";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { formatAPIResp } from "../../utils/helpers";
import { IconsManifest } from "react-icons/lib";

export function useGetJournalTables(token) {
  // const { token } = useContext(AuthContext);
  const {
    isPending: isLoading,
    data: journalTables,
    error,
    isFetchedAfterMount: journalTablesFetchedAfterMount,
  } = useQuery({
    queryKey: ["journalTables"],
    queryFn: () => {
      const tableItems = [];
      const journalTables = getJournalTables(token?.token);
      journalTables.forEach((tableItem) =>
        tableItems.push(formatAPIResp(tableItem, "journalTables")),
      );
      return tableItems;
    },
    staleTime: Infinity,
  });
  return { journalTables, isLoading, error, journalTablesFetchedAfterMount };
}
