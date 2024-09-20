import { useMutation } from "@tanstack/react-query";
import { renameTable as renameTableApi } from "../../services/apiJournals";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";
import { toast } from "react-hot-toast";

export function useUpdateTableRename(token) {
  const {
    isPending: isRenaming,
    mutate: renameTable,
    error: renameError,
  } = useMutation({
    mutationFn: (payload) => renameTableApi(token.token, payload),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { renameTable, isRenaming, renameError };
}
