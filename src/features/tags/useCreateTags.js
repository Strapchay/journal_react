import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createTag as createTagApi } from "../../services/apiTableItems";
import { useContext } from "react";
import { AuthContext } from "../../ProtectedRoute";

export function useCreateTags() {
  const { token } = useContext(AuthContext);
  const {
    isPending: isCreatingTag,
    mutate: createTag,
    error: createTagError,
  } = useMutation({
    mutationFn: (payload) => createTagApi(token?.token, payload),
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { createTag, createTagError, isCreatingTag };
}
