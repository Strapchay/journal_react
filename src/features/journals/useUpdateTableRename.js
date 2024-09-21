import { useMutation } from "@tanstack/react-query";
import { renameTable as renameTableApi } from "../../services/apiJournals";
import { toast } from "react-hot-toast";

export function useUpdateTableRename(token, removeToken) {
  const {
    isPending: isRenaming,
    mutate: renameTable,
    error: renameError,
  } = useMutation({
    mutationFn: (payload) => renameTableApi(token.token, payload, removeToken),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { renameTable, isRenaming, renameError };
}
