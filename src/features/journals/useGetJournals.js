import { useQuery } from "@tanstack/react-query";
import { getJournalList } from "../../services/apiJournals";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { formatAPIResp } from "../../utils/helpers";

export function useGetJournals() {
  const { token } = useContext(AuthContext);
  const {
    isPending: isLoading,
    data: journals,
    error,
  } = useQuery({
    queryKey: ["journals"],
    queryFn: () => {
      const journalList = getJournalList(token);
      const formattedJournalList = formatAPIResp(...journalList, "journal");
      return formattedJournalList;
    },
  });
  return { journals, isLoading, error };
}

export const replaceStateJournalDataWithAPIData = function (
  formattedAPIData,
  type,
) {
  // if (type === "journal") {
  //   state.name = formattedAPIData.name;
  //   state.description = formattedAPIData.description;
  //   state.tableHeads = formattedAPIData.tableHeads;
  //   state.currentTable = formattedAPIData.currentTable;
  //   state.tags = formattedAPIData.tags;
  //   state.id = formattedAPIData.id;
  //   state.username = formattedAPIData.username;
  //   tableFunc = formattedAPIData.tableFunc;
  // }
  // if (type === "journalTables") {
  //   state.tables.splice(0, state.tables.length);
  //   state.tables.push(...formattedAPIData);
  // }
};
