import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteTag as deleteTagApi } from "../../services/apiTableItems";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";

export function useDeleteTags() {
  const { token } = useContext(AuthContext);
  const {
    isPending: isDeletingTags,
    mutate: deleteTags,
    error: deleteTagsError,
  } = useMutation({
    mutationFn: (payload) => deleteTagApi(token?.token, payload),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { deleteTags, isDeletingTags, deleteTagsError };
}
