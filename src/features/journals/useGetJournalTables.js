import { useQuery } from "@tanstack/react-query";
import { getJournalTables } from "../../services/apiJournals";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { formatAPIResp } from "../../utils/helpers";

export function useGetJournalTables() {
  const { token } = useContext(AuthContext);
  const {
    isPending: isLoading,
    data: journalTables,
    error,
  } = useQuery({
    queryKey: ["journalTables"],
    queryFn: () => {
      const tableItems = [];
      const journalTables = getJournalTables(token);
      journalTables.forEach((tableItem) =>
        tableItems.push(formatAPIResp(tableItem, "journalTables")),
      );
      return tableItems;
    },
  });
  return { journalTables, isLoading, error };
}
